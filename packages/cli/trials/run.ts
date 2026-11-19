#!/usr/bin/env node
/**
 * Runs one trial unattended: a fresh folder with the task's design and the skills, Claude Code headless on the task's
 * request, its transcript saved, then the checker on what it left.
 *
 * Usage: node packages/cli/trials/run.ts <task> --model <id> [--registry <url>] [--dir <folder>]
 *   [--budget <usd>] [--dry-run]
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { parseArgs } from "node:util";

import { readTask, type Task } from "./check.ts";

const TRIALS = import.meta.dirname;
const CHECKER = path.join(TRIALS, "check.ts");
const SCREENSHOT = path.join(TRIALS, "screenshot.ts");

export const USAGE = `Usage: node packages/cli/trials/run.ts <task> --model <id> [options]
  --model <id>       the Claude model, e.g. claude-opus-5-5
  --registry <url>   install @pentaho/* from this registry (a local verdaccio: see the README)
  --dir <folder>     the trial folder (default: a new one in the temp folder); must not exist
  --budget <usd>     stop the agent past this spend (claude --max-budget-usd)
  --dry-run          print the commands, run nothing`;

export interface Options {
  task: Task;
  model: string;
  registry?: string;
  dir?: string;
  budget?: string;
  dryRun: boolean;
}

/** The options, or what's wrong with them (the caller exits 2). */
export function parseRunArgs(argv: string[]): Options | { help: true } {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      model: { type: "string" },
      registry: { type: "string" },
      dir: { type: "string" },
      budget: { type: "string" },
      "dry-run": { type: "boolean" },
      help: { type: "boolean" },
    },
  });
  if (values.help) return { help: true };
  if (positionals.length !== 1) throw new Error("give one task id");
  if (!values.model) throw new Error("give the model: --model <id>");
  if (values.registry && !/^https?:\/\//.test(values.registry))
    throw new Error(`--registry ${values.registry}: a URL is expected`);
  if (values.budget && !(Number(values.budget) > 0))
    throw new Error(`--budget ${values.budget}: an amount in USD is expected`);
  return {
    task: readTask(positionals[0]),
    model: values.model,
    registry: values.registry,
    dir: values.dir && path.resolve(values.dir),
    budget: values.budget,
    dryRun: values["dry-run"] ?? false,
  };
}

/** The request as the agent gets it: verbatim, then the unattended line and where the screenshot helper is. */
export function promptOf(task: Task): string {
  return [
    task.request,
    "No one will answer questions: decide, and list what you assumed.",
    `To screenshot the running plugin: node ${SCREENSHOT} <shots.json> --out review, shots.json a list of {"name": "01-list", "url", "width"?, "steps"?} (its header lists the steps).`,
  ].join("\n\n");
}

export interface Command {
  command: string;
  args: string[];
  cwd: string;
}

/** What a run does in `folder`: its environment and commands. The checker's plugin folder is known only after. */
export function planOf(options: Options, folder: string) {
  const env: Record<string, string> = {
    npm_config_cache: path.join(folder, ".npm-cache"),
  };
  if (options.registry) env.npm_config_registry = options.registry;
  const init: Command = {
    command: "npx",
    args: ["--yes", "@pentaho/uikit-tools", "init", "--agents", "claude"],
    cwd: folder,
  };
  // unattended in a throwaway folder: no permission prompts; only the project's settings (not this machine's
  // plugins, hooks or extra folders), so runs on different machines see the same setup
  const agent: Command = {
    command: "claude",
    args: [
      "-p",
      promptOf(options.task),
      "--model",
      options.model,
      "--output-format",
      "stream-json",
      "--verbose",
      "--permission-mode",
      "bypassPermissions",
      "--setting-sources",
      "project",
      ...(options.budget ? ["--max-budget-usd", options.budget] : []),
    ],
    cwd: folder,
  };
  const transcript = path.join(folder, "transcript.jsonl");
  const check = (plugin: string): Command => ({
    command: process.execPath,
    args: [CHECKER, options.task.id, plugin, "--transcript", transcript],
    cwd: process.cwd(),
  });
  const design = options.task.design
    ? path.join(TRIALS, "tasks", options.task.design)
    : undefined;
  return { env, design, init, agent, transcript, check };
}

const quote = (arg: string) =>
  /^[\w./:=@,+-]+$/.test(arg) ? arg : `'${arg.replaceAll("'", `'\\''`)}'`;
export const shell = ({ command, args }: Command) =>
  [command, ...args].map(quote).join(" ");

/** A stream-json line stamped with when it arrived, so the checker can time the run. */
export function stamp(line: string, now = new Date()): string {
  try {
    const entry = JSON.parse(line) as unknown;
    if (entry && typeof entry === "object" && !("timestamp" in entry))
      return JSON.stringify({ ...entry, timestamp: now.toISOString() });
  } catch {
    // not JSON: kept as it is
  }
  return line;
}

/** The folder under `folder` with a plugin.json: what the agent created. */
function pluginIn(folder: string): string | undefined {
  return fs
    .readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => path.join(folder, entry.name))
    .find((dir) => fs.existsSync(path.join(dir, "plugin.json")));
}

/** Claude Code, its stream-json saved line by line to the transcript; a line per tool call on the terminal. */
function runAgent(agent: Command, env: NodeJS.ProcessEnv, transcript: string) {
  const out = fs.createWriteStream(transcript);
  const child = spawn(agent.command, agent.args, {
    cwd: agent.cwd,
    env,
    stdio: ["ignore", "pipe", "inherit"],
  });
  readline.createInterface({ input: child.stdout }).on("line", (line) => {
    out.write(`${stamp(line)}\n`);
    try {
      const entry = JSON.parse(line);
      for (const block of entry.message?.content ?? [])
        if (block.type === "tool_use")
          console.log(
            `  ${block.name} ${String(
              block.input?.command ?? block.input?.file_path ?? "",
            )
              .split("\n")[0]
              .slice(0, 100)}`,
          );
      if (entry.type === "result") console.log(`\n${entry.result ?? ""}`);
    } catch {
      // not JSON
    }
  });
  return new Promise<number>((resolve) => {
    child.on("close", (code) => out.end(() => resolve(code ?? 1)));
    child.on("error", (error) => {
      console.error(`claude: ${error.message}`);
      out.end(() => resolve(1));
    });
  });
}

async function main(): Promise<number> {
  let options: ReturnType<typeof parseRunArgs>;
  try {
    options = parseRunArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`error: ${(error as Error).message}\n${USAGE}`);
    return 2;
  }
  if ("help" in options) {
    console.log(USAGE);
    return 0;
  }
  if (options.dir && fs.existsSync(options.dir)) {
    console.error(
      `error: ${options.dir} exists; a trial starts in a new folder`,
    );
    return 2;
  }

  const folder = options.dryRun
    ? (options.dir ?? path.join(os.tmpdir(), `trial-${options.task.id}-XXXXXX`))
    : options.dir
      ? (fs.mkdirSync(options.dir, { recursive: true }), options.dir)
      : fs.mkdtempSync(path.join(os.tmpdir(), `trial-${options.task.id}-`));
  const plan = planOf(options, folder);
  const envText = Object.entries(plan.env)
    .map(([key, value]) => `${key}=${quote(value)}`)
    .join(" ");
  const plugin = path.join(folder, "<plugin>");

  if (options.dryRun) {
    console.log(`mkdir ${quote(folder)}`);
    if (plan.design)
      console.log(
        `cp -R ${quote(plan.design)} ${quote(path.join(folder, "design"))}`,
      );
    console.log(`cd ${quote(folder)}`);
    console.log(`env ${envText} ${shell(plan.init)}`);
    console.log(
      `env ${envText} ${shell(plan.agent)} > ${quote(plan.transcript)}`,
    );
    console.log(shell(plan.check(plugin)));
    return 0;
  }

  console.log(`Trial ${options.task.id} with ${options.model} in ${folder}`);
  if (plan.design)
    fs.cpSync(plan.design, path.join(folder, "design"), { recursive: true });
  const env = { ...process.env, ...plan.env };
  const init = spawnSync(plan.init.command, plan.init.args, {
    cwd: folder,
    env,
    stdio: "inherit",
  });
  if (init.status !== 0) {
    console.error(`error: ${shell(plan.init)} failed`);
    return 1;
  }

  const code = await runAgent(plan.agent, env, plan.transcript);
  if (code !== 0) console.error(`claude exited ${code}; checking what it left`);
  const dir = pluginIn(folder);
  if (!dir) {
    console.error(
      `error: no plugin (a folder with plugin.json) in ${folder}; transcript: ${plan.transcript}`,
    );
    return 1;
  }
  const check = plan.check(dir);
  const checked = spawnSync(check.command, check.args, { stdio: "inherit" });
  console.log(
    `\nAfter the design review of ${path.join(dir, "review")}, log the run:\n${shell(check)} --met <1,2,…> --review '<verdict>' --findings '<…>' --log`,
  );
  return checked.status ?? 1;
}

if (import.meta.filename === process.argv[1]) process.exitCode = await main();
