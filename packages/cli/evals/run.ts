#!/usr/bin/env node
/* eslint-disable no-await-in-loop -- polling the dev server until it answers */
/**
 * One trial: a new plugin (`full`: with `uikit-tools init`; `bare`: with the tooling taken out), Claude Code headless
 * on the task's request, then the gate (the plugin's own check, build and package, and its page coming up) and the
 * review screenshots. Writes `<dir>/result.json`; the plugin comes back to `<dir>/<task>` without node_modules.
 *
 * Exit: 0 gate passed, 1 gate failed, 2 bad arguments, 3 infrastructure failure (rerun it).
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { parseArgs } from "node:util";

import { takeShots, type Shot } from "../src/shots.ts";

const USAGE = `Usage: node packages/cli/evals/run.ts <task> --model <id> --condition full|bare --dir <dir>
  [--registry <url>] [--budget <usd>] [--timeout <min>]`;

export interface Task {
  id: string;
  /** The request, in an admin's words. */
  request: string;
  /** What a reviewer checks in the screenshots. */
  review: string[];
  /** The review screenshots: `{route}` is the plugin's first view; `?samples=` a pattern for its sample states. */
  shots: (Omit<Shot, "url"> & { url: string })[];
}

export const readTask = (id: string): Task =>
  JSON.parse(
    fs.readFileSync(
      path.join(import.meta.dirname, "tasks", `${id}.json`),
      "utf8",
    ),
  );

/** What the agent is told: the request, and that no one will answer. */
export const promptOf = (task: Task) =>
  `${task.request}\n\nNo one will answer questions: decide, and list what you assumed.`;

/** The variables the agent and the project's scripts get from the harness's environment; nothing else leaks in. */
const ALLOWED = ["PATH", "LANG", "TERM", "PLAYWRIGHT_BROWSERS_PATH"];
const AUTH = ["CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_API_KEY"];

/**
 * `bare`: takes the agent tooling out of a plugin just created, before it's installed: `@pentaho/uikit-tools` and the
 * scripts that call it, its lint preset (the plain lint stays), AGENTS.md and CLAUDE.md.
 */
export function stripTooling(plugin: string) {
  const file = path.join(plugin, "package.json");
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const deps of [pkg.dependencies, pkg.devDependencies])
    delete deps?.["@pentaho/uikit-tools"];
  for (const [name, script] of Object.entries<string>(pkg.scripts ?? {}))
    if (script.includes("uikit-tools")) delete pkg.scripts[name];
  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
  const lint = path.join(plugin, ".oxlintrc.json");
  const config = JSON.parse(fs.readFileSync(lint, "utf8"));
  config.extends = config.extends.filter(
    (each: string) => !each.includes("uikit-tools"),
  );
  fs.writeFileSync(lint, `${JSON.stringify(config, null, 2)}\n`);
  for (const name of ["AGENTS.md", "CLAUDE.md"])
    fs.rmSync(path.join(plugin, name), { force: true });
}

/** The plugin's own files that mention the tooling (none may, in `bare`, before the agent starts). */
export function toolingLeft(plugin: string): string[] {
  const own = fs
    .readdirSync(plugin, { recursive: true, encoding: "utf8" })
    .filter((name) => !/(^|\/)(node_modules|dist)(\/|$)/.test(name))
    .filter((name) => fs.statSync(path.join(plugin, name)).isFile());
  return [
    ...own.filter((name) =>
      /uikit-tools|AGENTS\.md/.test(
        fs.readFileSync(path.join(plugin, name), "utf8"),
      ),
    ),
    ...(fs.existsSync(path.join(plugin, "node_modules/@pentaho/uikit-tools"))
      ? ["node_modules/@pentaho/uikit-tools"]
      : []),
  ];
}

export interface Metrics {
  model?: string;
  costUsd?: number;
  tokens?: number;
  calls: number;
  minutes?: number;
  /** The result line's subtype: `success`, `error_max_budget_usd`…; undefined when Claude Code never finished. */
  ending?: string;
  error?: string;
}

/** The run's figures from Claude Code's stream-json: the init line, each tool call, the final result line. */
export function metricsOf(transcript: string): Metrics {
  const metrics: Metrics = { calls: 0 };
  for (const line of transcript.split("\n")) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (entry.type === "system" && entry.subtype === "init")
      metrics.model = entry.model;
    for (const block of entry.message?.content ?? [])
      if (block.type === "tool_use") metrics.calls += 1;
    if (entry.type === "result") {
      const usage = entry.usage ?? {};
      metrics.costUsd = entry.total_cost_usd;
      metrics.tokens =
        (usage.input_tokens ?? 0) +
        (usage.output_tokens ?? 0) +
        (usage.cache_read_input_tokens ?? 0) +
        (usage.cache_creation_input_tokens ?? 0);
      metrics.minutes = Math.round((entry.duration_ms ?? 0) / 60_000);
      metrics.ending = entry.subtype;
      if (entry.is_error) metrics.error = String(entry.result ?? "");
    }
  }
  return metrics;
}

/** The API, network, login or usage limits failing: not the agent's doing, so the run says nothing. */
export const infraFailure = (metrics: Metrics) =>
  !metrics.ending
    ? "claude stopped without a result"
    : metrics.error &&
        /API Error|overloaded|rate.?limit|usage limit|authentication|not logged in/i.test(
          metrics.error,
        )
      ? metrics.error.slice(0, 200)
      : undefined;

/** The task's shots against the plugin served at `base`: `?samples=` matched to the sample states the plugin has. */
export function shotsFor(task: Task, base: string, plugin: string): Shot[] {
  let route = "/";
  try {
    route =
      JSON.parse(fs.readFileSync(path.join(plugin, "plugin.json"), "utf8"))
        .views?.[0]?.route ?? "/";
  } catch {
    // no plugin.json: the shots fail, and the gate says so
  }
  const states = fs
    .readdirSync(plugin)
    .flatMap((file) => file.match(/^samples\.(.+)\.json$/)?.[1] ?? []);
  return task.shots.map((shot, index) => ({
    ...shot,
    name: `${String(index + 1).padStart(2, "0")}-${shot.name}`,
    url: `${base}${shot.url.replace("{route}", route)}`.replace(
      /samples=([^&]+)/,
      (all, want: string) =>
        `samples=${states.find((state) => new RegExp(want, "i").test(state)) ?? want}`,
    ),
    // the App Shell's main panel with the view in it, not its spinner
    waitFor: "#hv-root main > :not(.HvLoading-root):not(:empty)",
    steps: [{ wait: 1500 }, ...(shot.steps ?? [])],
  }));
}

/** The plugin's dev server, then the shots; the names of the ones that failed. */
async function shoot(
  task: Task,
  plugin: string,
  out: string,
  env: NodeJS.ProcessEnv,
) {
  const port = 5199;
  const base = `http://127.0.0.1:${port}`;
  const server = spawn(
    "npx",
    [
      "--no-install",
      "vite",
      "--port",
      String(port),
      "--strictPort",
      "--host",
      "127.0.0.1",
    ],
    { cwd: plugin, detached: true, stdio: "ignore", env },
  );
  const shots = shotsFor(task, base, plugin);
  try {
    for (let waited = 0; waited < 60_000; waited += 500) {
      if (
        await fetch(base).then(
          (r) => r.ok,
          () => false,
        )
      )
        break;
      await sleep(500);
    }
    const failed = await takeShots(shots, out);
    // a fresh vite optimizes its dependencies on the first page and reloads: once more, warm
    return failed.length
      ? await takeShots(
          shots.filter((shot) => failed.includes(shot.name)),
          out,
        )
      : [];
  } catch (error) {
    console.error(`shots: ${(error as Error).message}`);
    return shots.map((shot) => shot.name);
  } finally {
    try {
      process.kill(-server.pid!, "SIGTERM");
    } catch {
      // already gone
    }
  }
}

/** Claude Code on the request, its stream-json saved (the login masked) to `transcript`. */
function runAgent(
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
  transcript: string,
  minutes: number,
) {
  const out = fs.createWriteStream(transcript);
  const secrets = AUTH.map((name) => env[name] ?? "").filter(
    (value) => value.length >= 8,
  );
  const child = spawn("claude", args, {
    cwd,
    env,
    stdio: ["ignore", "pipe", "inherit"],
  });
  const timer = setTimeout(() => child.kill("SIGTERM"), minutes * 60_000);
  readline.createInterface({ input: child.stdout }).on("line", (line) => {
    out.write(
      `${secrets.reduce((text, secret) => text.replaceAll(secret, "[redacted]"), line)}\n`,
    );
  });
  return new Promise<void>((resolve) => {
    child.on("close", () => {
      clearTimeout(timer);
      out.end(resolve);
    });
    child.on("error", (error) => {
      console.error(`claude: ${error.message}`);
      clearTimeout(timer);
      out.end(resolve);
    });
  });
}

async function main(): Promise<number> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      model: { type: "string" },
      condition: { type: "string" },
      dir: { type: "string" },
      registry: { type: "string" },
      budget: { type: "string" },
      timeout: { type: "string", default: "60" },
    },
  });
  const { model, condition, dir: given } = values;
  if (
    positionals.length !== 1 ||
    !model ||
    !given ||
    !["full", "bare"].includes(condition ?? "")
  ) {
    console.error(USAGE);
    return 2;
  }
  const task = readTask(positionals[0]);
  const dir = path.resolve(given);
  fs.mkdirSync(dir, { recursive: true });
  // in a container, the project lives off the mounted folder (a shared folder makes installs many times slower)
  const container =
    fs.existsSync("/.dockerenv") || fs.existsSync("/run/.containerenv");
  const work = container ? "/work" : dir;
  const plugin = path.join(work, task.id);
  const pick = (names: string[]) =>
    Object.fromEntries(
      names
        .filter((name) => process.env[name])
        .map((name) => [name, process.env[name]]),
    );
  const env: NodeJS.ProcessEnv = {
    ...pick(ALLOWED),
    npm_config_cache: container
      ? "/tmp/npm-cache"
      : path.join(dir, ".npm-cache"),
    ...(values.registry && { npm_config_registry: values.registry }),
  };
  const result: Record<string, unknown> = { task: task.id, condition, model };
  const save = () =>
    fs.writeFileSync(
      path.join(dir, "result.json"),
      `${JSON.stringify(result, null, 2)}\n`,
    );
  const run = (command: string, args: string[], cwd = plugin) =>
    spawnSync(command, args, { cwd, env, stdio: "inherit" }).status === 0;
  const step = (ok: boolean, what: string) => {
    if (!ok) throw new Error(what);
  };

  try {
    // npx keeps a CLI by its version: a republished local registry would hand out the old one
    fs.rmSync(path.join(env.npm_config_cache!, "_npx"), {
      recursive: true,
      force: true,
    });
    step(
      run(
        "npx",
        [
          "--yes",
          "@pentaho/uikit-cli",
          "create",
          task.id,
          "-t",
          "plugin",
          "--no-install",
        ],
        work,
      ),
      "create failed",
    );
    // neither arm is told how to get the tooling: `full` gets it from the harness
    const readme = path.join(plugin, "README.md");
    fs.writeFileSync(
      readme,
      fs
        .readFileSync(readme, "utf8")
        .replace(/\n+For coding agents:[^\n]*\n/, "\n"),
    );
    if (condition === "bare") stripTooling(plugin);
    step(run("npm", ["install"]), "npm install failed");
    if (condition === "full")
      step(
        run("npx", [
          "--no-install",
          "uikit-tools",
          "init",
          "--agents",
          "claude",
        ]),
        "uikit-tools init failed",
      );
    else {
      // the installed uikit-cli carries its templates' AGENTS.md: out of reach of `bare`
      const templates = path.join(
        plugin,
        "node_modules/@pentaho/uikit-cli/templates",
      );
      if (fs.existsSync(templates))
        for (const name of fs.readdirSync(templates))
          fs.rmSync(path.join(templates, name, "AGENTS.md"), { force: true });
      const left = toolingLeft(plugin);
      step(!left.length, `bare still has the tooling: ${left.join(", ")}`);
    }
    step(run("npm", ["run", "check"]), "the new plugin fails its own check");
  } catch (error) {
    result.infra = (error as Error).message;
    save();
    console.error(`error: ${result.infra} (infrastructure: rerun)`);
    return 3;
  }

  // a fresh HOME (no user settings, skills or memory), trusting the plugin's folder as a person does once
  const home = path.join(dir, "home");
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(
    path.join(home, ".claude.json"),
    JSON.stringify({
      projects: { [plugin]: { hasTrustDialogAccepted: true } },
    }),
  );
  const transcript = path.join(dir, "transcript.jsonl");
  await runAgent(
    [
      "-p",
      promptOf(task),
      "--model",
      model,
      "--effort",
      "high",
      "--output-format",
      "stream-json",
      "--verbose",
      "--permission-mode",
      "bypassPermissions",
      "--setting-sources",
      "project",
      ...(values.budget ? ["--max-budget-usd", values.budget] : []),
    ],
    plugin,
    { ...env, ...pick(AUTH), HOME: home },
    transcript,
    Number(values.timeout),
  );
  const metrics = metricsOf(fs.readFileSync(transcript, "utf8"));
  result.metrics = metrics;
  const infra = infraFailure(metrics);
  if (infra) {
    result.infra = infra;
    save();
    console.error(`error: ${infra} (infrastructure: rerun)`);
    return 3;
  }

  // the gate: the plugin's own scripts, then its page coming up
  const gates: Record<string, boolean> = {};
  for (const script of ["check", "build", "package"])
    gates[script] = run("npm", ["run", script]);
  // the agent's own dev servers and browsers gone first
  if (container) spawnSync("pkill", ["-f", "vite|chrom"], { stdio: "ignore" });
  const failed = await shoot(task, plugin, path.join(dir, "review"), env);
  gates.renders = !failed.includes(shotsFor(task, "", plugin)[0]?.name ?? "");
  result.gates = gates;
  result.passed = Object.values(gates).every(Boolean);
  save();
  if (plugin !== path.join(dir, task.id))
    fs.cpSync(plugin, path.join(dir, task.id), {
      recursive: true,
      filter: (source) => path.basename(source) !== "node_modules",
    });
  console.log(
    `${task.id} (${condition}): gate ${result.passed ? "passed" : "failed"} ${JSON.stringify(gates)}`,
  );
  return result.passed ? 0 : 1;
}

if (import.meta.filename === process.argv[1]) process.exitCode = await main();
