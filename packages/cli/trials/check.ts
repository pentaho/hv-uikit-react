#!/usr/bin/env node
/**
 * Checks what a coding agent left after a trial: a plugin project built from a task's request. Each check only reads
 * the project or runs its own scripts; it prints a pass/fail table, writes the result as JSON and prints the row for
 * RESULTS.md (`--log` appends it).
 *
 * Usage: node packages/cli/trials/check.ts <task id or file> <plugin dir> [--out <file>] [--log]
 *   [--transcript <claude-code.jsonl>] [--agent <agent/model>] [--minutes <n>] [--calls <n>] [--tokens <text>]
 *   [--cost <usd>] [--met <1,2,…>] [--review <verdict>] [--findings <text>]
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { unzipSync } from "fflate";

import { readPlugin, type Plugin } from "../src/pentaho/plugin.ts";
import {
  appShellConfig,
  bundlesOf,
  pluginXml,
  WEBCLIENT_DIR,
} from "../src/pentaho/server-files.ts";
import { readTranscript, tokensCell, type Metrics } from "./transcript.ts";

export interface Task {
  id: string;
  shape: "list" | "form" | "detail";
  request: string;
  /** The approved design's folder, relative to tasks/, copied into the agent's folder as design/. */
  design?: string;
  expect: {
    /** How many views plugin.json has. */
    views: number;
    /** A screenshot review/<nn>-<state>.png for each: alternatives as a regex (`empty|none`), case-insensitive. */
    states: string[];
    /** A samples.<state>.json for each, matched the same way. */
    samples: string[];
    /** Components the pages use, `<HvTable` or an import: alternatives as `HvDropdown|HvSelect`. */
    components: string[];
  };
  /** What a person looks for on the screenshots: the design review's checklist. */
  review: string[];
}

export interface Check {
  name: string;
  pass: boolean;
  detail?: string;
  /** How many there were, shown beside the verdict in RESULTS.md: the screenshots. */
  count?: number;
}

/** The checks, in the order RESULTS.md's columns list them. */
export const CHECKS = [
  "plugin",
  "samples",
  "components",
  "check",
  "tests",
  "lint",
  "build",
  "zip",
  "screenshots",
] as const;

const TASKS_DIR = path.join(import.meta.dirname, "tasks");
const RESULTS = path.join(import.meta.dirname, "RESULTS.md");
/** The repository, whose Prettier formats RESULTS.md. */
const REPO = path.resolve(import.meta.dirname, "../../..");
/** A screenshot as the pentaho-plugin skill names it. */
const SHOT = /^\d{2}-([a-z0-9-]+)\.png$/;
/** The first 8 bytes of every PNG file. */
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

/** A task by id (tasks/<id>.json) or by its file. */
export function readTask(idOrFile: string): Task {
  const file = idOrFile.endsWith(".json")
    ? idOrFile
    : path.join(TASKS_DIR, `${idOrFile}.json`);
  if (!fs.existsSync(file)) {
    const ids = fs
      .readdirSync(TASKS_DIR)
      .filter((name) => name.endsWith(".json"));
    throw new Error(
      `no task ${idOrFile}; the tasks: ${ids.map((name) => name.slice(0, -5)).join(", ")}`,
    );
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as Task;
}

const matcher = (alternatives: string) => new RegExp(alternatives, "i");
const missingOf = (patterns: string[], names: string[]) =>
  patterns.filter(
    (pattern) => !names.some((name) => matcher(pattern).test(name)),
  );
const fail = (name: string, detail: string): Check => ({
  name,
  pass: false,
  detail,
});

/** A command in the project: passed, or its output's tail as the detail. At most 10 minutes. */
function commandCheck(name: string, dir: string, command: string[]): Check {
  const run = spawnSync(command[0], command.slice(1), {
    cwd: dir,
    encoding: "utf8",
    env: { ...process.env, CI: "1", FORCE_COLOR: "0" },
    shell: process.platform === "win32",
    timeout: 10 * 60_000,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (run.status === 0 && !run.error) return { name, pass: true };
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
  const reason = run.error
    ? `${run.error.message}${output ? `: ${output.slice(-300)}` : ""}`
    : output.slice(-400);
  return fail(name, reason || `exit ${run.status ?? run.signal}`);
}

/** plugin.json: valid, with the task's number of views, and each view's page. */
function pluginCheck(dir: string, task: Task, plugin: Plugin): Check {
  const problems: string[] = [];
  if (plugin.views.length !== task.expect.views)
    problems.push(
      `${plugin.views.length} view(s), expected ${task.expect.views}`,
    );
  for (const view of plugin.views)
    if (!fs.existsSync(path.join(dir, "src", "pages", `${view.id}.tsx`)))
      problems.push(`no src/pages/${view.id}.tsx`);
  if (plugin.id === "my-plugin")
    problems.push("still the template's my-plugin");
  return problems.length
    ? fail("plugin", problems.join("; "))
    : {
        name: "plugin",
        pass: true,
        detail: plugin.views.map((view) => view.route).join(", "),
      };
}

/** samples.json with the day it was written, and a samples.<state>.json for each state the task names. */
function samplesCheck(dir: string, task: Task): Check {
  const file = path.join(dir, "samples.json");
  if (!fs.existsSync(file)) return fail("samples", "no samples.json");
  let samples: Record<string, unknown>;
  try {
    samples = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return fail("samples", `samples.json: ${(error as Error).message}`);
  }
  const calls = Object.keys(samples).filter((key) => key !== "$written");
  const states = fs
    .readdirSync(dir)
    .map((name) => /^samples\.(.+)\.json$/.exec(name)?.[1])
    .filter((state) => state !== undefined);

  const problems: string[] = [];
  if (typeof samples.$written !== "string") problems.push("no $written");
  if (calls.length === 0) problems.push("no calls answered");
  const missing = missingOf(task.expect.samples, states);
  if (missing.length)
    problems.push(`no samples.<${missing.join(">.json, samples.<")}>.json`);
  const detail = `${calls.length} call(s); states: ${states.join(", ") || "none"}`;
  return problems.length
    ? fail("samples", `${problems.join("; ")} (${detail})`)
    : { name: "samples", pass: true, detail };
}

/** The source files under src, tests left out. */
function sourcesOf(dir: string): string[] {
  const src = path.join(dir, "src");
  if (!fs.existsSync(src)) return [];
  return fs
    .readdirSync(src, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file))
    .map((file) => fs.readFileSync(path.join(src, file), "utf8"));
}

/** The components the task names, each used in the source (as JSX or an import). */
function componentsCheck(dir: string, task: Task): Check {
  const used = new Set(
    sourcesOf(dir).flatMap((source) => source.match(/\bHv[A-Z]\w*/g) ?? []),
  );
  const missing = task.expect.components.filter(
    (alternatives) => !alternatives.split("|").some((name) => used.has(name)),
  );
  return missing.length
    ? fail("components", `not used: ${missing.join(", ")}`)
    : { name: "components", pass: true };
}

/** The files under `src`, newest first: [relative path, mtime]. */
function newestSource(dir: string): [string, number] | undefined {
  const src = path.join(dir, "src");
  if (!fs.existsSync(src)) return undefined;
  let newest: [string, number] | undefined;
  for (const file of fs.readdirSync(src, {
    recursive: true,
    encoding: "utf8",
  })) {
    const stat = fs.statSync(path.join(src, file));
    if (stat.isFile() && (!newest || stat.mtimeMs > newest[1]))
      newest = [`src/${file}`, stat.mtimeMs];
  }
  return newest;
}

/** <id>.zip, as `uikit-cli package` writes it: the server's files for this plugin.json and every bundle, packaged after the last source change. */
function zipCheck(dir: string, plugin: Plugin): Check {
  const file = path.join(dir, `${plugin.id}.zip`);
  if (!fs.existsSync(file)) return fail("zip", `no ${plugin.id}.zip`);
  let entries: ReturnType<typeof unzipSync>;
  try {
    entries = unzipSync(fs.readFileSync(file));
  } catch (error) {
    return fail(
      "zip",
      `${plugin.id}.zip unreadable: ${(error as Error).message}`,
    );
  }
  const text = (name: string) => {
    const entry = entries[`${plugin.id}/${name}`];
    return entry ? Buffer.from(entry).toString("utf8") : undefined;
  };

  const missing = bundlesOf(plugin)
    .map((bundle) => `${WEBCLIENT_DIR}/${bundle}`)
    .filter((name) => !entries[`${plugin.id}/${name}`]);
  const problems = missing.length ? [`missing ${missing.join(", ")}`] : [];
  if (text("plugin.xml") !== pluginXml(plugin))
    problems.push("plugin.xml isn't this plugin.json's");
  if (text("pentaho-app-shell.config.json") !== appShellConfig(plugin))
    problems.push(
      "pentaho-app-shell.config.json isn't this plugin.json's (packaged before a change?)",
    );
  const newest = newestSource(dir);
  if (newest && newest[1] > fs.statSync(file).mtimeMs)
    problems.push(`${newest[0]} changed after packaging`);
  return problems.length
    ? fail("zip", problems.join("; "))
    : {
        name: "zip",
        pass: true,
        detail: `${Object.keys(entries).length} files`,
      };
}

function isPng(file: string): boolean {
  const head = Buffer.alloc(PNG_SIGNATURE.length);
  const fd = fs.openSync(file, "r");
  try {
    fs.readSync(fd, head, 0, head.length, 0);
  } finally {
    fs.closeSync(fd);
  }
  return head.equals(PNG_SIGNATURE);
}

/** review/<nn>-<state>.png, a real PNG, for every state the task names. */
function screenshotsCheck(dir: string, task: Task): Check {
  const review = path.join(dir, "review");
  const files = fs.existsSync(review) ? fs.readdirSync(review).toSorted() : [];
  const shots = files.filter((file) => SHOT.test(file));
  const notPng = shots.filter((file) => !isPng(path.join(review, file)));
  const states = shots
    .filter((file) => !notPng.includes(file))
    .map((file) => SHOT.exec(file)![1]);
  const missing = missingOf(task.expect.states, states);
  const count = states.length;
  const problems = [`${count} in review/`];
  if (notPng.length) problems.push(`not PNG: ${notPng.join(", ")}`);
  if (missing.length) problems.push(`none for ${missing.join(", ")}`);
  if (problems.length === 1)
    return { name: "screenshots", pass: true, detail: problems[0], count };
  problems.push(`files: ${files.join(", ") || "none"}`);
  return { ...fail("screenshots", problems.join("; ")), count };
}

/** Every check on the plugin in `dir`; without a valid plugin.json, the ones that need it fail with that reason. */
export function checkPlugin(task: Task, dir: string): Check[] {
  const read = readPlugin(dir);
  const withPlugin = (name: string, run: (plugin: Plugin) => Check): Check =>
    read.ok ? run(read.plugin) : fail(name, read.problems.join("; "));

  return [
    withPlugin("plugin", (plugin) => pluginCheck(dir, task, plugin)),
    samplesCheck(dir, task),
    componentsCheck(dir, task),
    commandCheck("check", dir, ["npm", "run", "check"]),
    commandCheck("tests", dir, ["npm", "test", "--", "--run"]),
    commandCheck("lint", dir, [
      "npx",
      "--no-install",
      "uikit-tools",
      "lint",
      "src",
    ]),
    commandCheck("build", dir, ["npm", "run", "build"]),
    withPlugin("zip", (plugin) => zipCheck(dir, plugin)),
    screenshotsCheck(dir, task),
  ];
}

/** The pass/fail table. */
export function table(checks: Check[]): string {
  const width = Math.max(...checks.map((check) => check.name.length));
  return checks
    .map((check) => {
      const detail = check.detail
        ? `  ${check.detail.replaceAll(/\s+/g, " ")}`
        : "";
      return `${check.pass ? "pass" : "FAIL"}  ${check.name.padEnd(width)}${detail}`;
    })
    .join("\n");
}

/** What the run was built from: this repo's commit, the skills the agent had, the `@pentaho/*` it installed. */
export interface Provenance {
  commit?: string;
  /** A short hash of the trial folder's `.claude/skills/<skill>/SKILL.md` files. */
  skills?: string;
  packages: Record<string, string>;
}

/** The skills folder: in the trial folder (where `init` ran), else in the plugin. */
function skillsHash(dir: string): string | undefined {
  const skills = [path.dirname(dir), dir]
    .map((each) => path.join(each, ".claude", "skills"))
    .find((each) => fs.existsSync(each));
  if (!skills) return undefined;
  const files = fs
    .readdirSync(skills, { recursive: true, encoding: "utf8" })
    .filter((file) => path.basename(file) === "SKILL.md")
    .toSorted();
  if (!files.length) return undefined;
  const hash = createHash("sha256");
  for (const file of files)
    hash.update(`${file}\n`).update(fs.readFileSync(path.join(skills, file)));
  return hash.digest("hex").slice(0, 7);
}

export function provenance(dir: string): Provenance {
  const git = (...args: string[]) =>
    spawnSync("git", args, { cwd: REPO, encoding: "utf8" });
  const head = git("rev-parse", "--short", "HEAD");
  const dirty = git("status", "--porcelain").stdout?.trim();
  const commit =
    head.status === 0
      ? `${head.stdout.trim()}${dirty ? "+dirty" : ""}`
      : undefined;

  const packages: Record<string, string> = {};
  const lock = path.join(dir, "package-lock.json");
  if (fs.existsSync(lock)) {
    const entries = (
      JSON.parse(fs.readFileSync(lock, "utf8")) as {
        packages?: Record<string, { version?: string }>;
      }
    ).packages;
    for (const [key, value] of Object.entries(entries ?? {})) {
      const name = /^node_modules\/(@pentaho\/[^/]+)$/.exec(key)?.[1];
      if (name && value.version) packages[name] = value.version;
    }
  }
  return { commit, skills: skillsHash(dir), packages };
}

/** The Build cell: `0267eb6+dirty · skills 3f9a1c2 · core 7.0.0 · tools 1.0.0 · app-shell 3.0.0`. */
export function buildCell({ commit, skills, packages }: Provenance): string {
  const shown = ["uikit-react-core", "uikit-tools", "app-shell-ui"]
    .filter((name) => packages[`@pentaho/${name}`])
    .map(
      (name) =>
        `${name.replaceAll(/^uikit-(react-)?|-ui$/g, "")} ${packages[`@pentaho/${name}`]}`,
    );
  return [commit ?? "?", `skills ${skills ?? "none"}`, ...shown].join(" · ");
}

/** The review items met, from `--met 1,2,4` (1-based); undefined when not given. */
export function parseMet(task: Task, met?: string): boolean[] | undefined {
  if (met === undefined) return undefined;
  const numbers = met
    .split(",")
    .map((each) => each.trim())
    .filter(Boolean)
    .map(Number);
  const bad = numbers.filter(
    (n) => !Number.isInteger(n) || n < 1 || n > task.review.length,
  );
  if (bad.length)
    throw new Error(
      `--met ${met}: the review list has items 1 to ${task.review.length}`,
    );
  return task.review.map((_, index) => numbers.includes(index + 1));
}

/** `3/4 (missed 3)`, then the verdict if any. */
export function reviewCell(met?: boolean[], verdict?: string): string {
  if (!met) return verdict ?? "?";
  const missed = met.flatMap((each, index) => (each ? [] : [index + 1]));
  const score = `${met.length - missed.length}/${met.length}${missed.length ? ` (missed ${missed.join(", ")})` : ""}`;
  return verdict ? `${score}; ${verdict}` : score;
}

export interface Run {
  agent?: string;
  build?: string;
  minutes?: string;
  calls?: string;
  tokens?: string;
  cost?: string;
  review?: string;
  findings?: string;
}

/** The run's row for RESULTS.md, its checks in CHECKS' order. */
export function resultsRow(
  task: Task,
  checks: Check[],
  run: Run,
  date: string,
): string {
  const cell = (value?: string) =>
    (value ?? "?").replaceAll("|", "\\|").replaceAll("\n", " ");
  const verdict = (name: string) => {
    const check = checks.find((each) => each.name === name);
    if (!check) return "–";
    const count = check.count === undefined ? "" : ` (${check.count})`;
    return `${check.pass ? "pass" : "fail"}${count}`;
  };
  const cells = [
    date,
    task.id,
    cell(run.agent),
    cell(run.build),
    ...CHECKS.map(verdict),
    cell(run.minutes),
    cell(run.calls),
    cell(run.tokens),
    cell(run.cost),
    cell(run.review),
    cell(run.findings),
  ];
  return `| ${cells.join(" | ")} |`;
}

/** The row's cells: the hand flags first, then what the transcript says. */
export function runOf(
  flags: Omit<Run, "build">,
  metrics: Metrics | undefined,
  build: string,
  met: boolean[] | undefined,
): Run {
  const extras = metrics
    ? [
        metrics.ranCheck ? "ran check" : "",
        metrics.screenshots ? `${metrics.screenshots} shot cmds` : "",
      ].filter(Boolean)
    : [];
  return {
    agent:
      flags.agent ??
      (metrics?.model ? `Claude Code (${metrics.model})` : undefined),
    build,
    minutes: flags.minutes ?? metrics?.minutes?.toString(),
    calls:
      flags.calls ??
      (metrics ? [String(metrics.calls), ...extras].join(" · ") : undefined),
    tokens: flags.tokens ?? (metrics ? tokensCell(metrics.tokens) : undefined),
    cost:
      flags.cost ??
      (metrics?.costUsd === undefined
        ? undefined
        : `$${metrics.costUsd.toFixed(2)}`),
    review: reviewCell(met, flags.review),
    findings: flags.findings,
  };
}

const USAGE = `Usage: node packages/cli/trials/check.ts <task> <plugin dir> [--out <file>] [--log]
  [--transcript <claude-code.jsonl>]  the date, minutes, model, tool calls, tokens and cost from the agent's transcript
  [--agent <name>] [--minutes <n>] [--calls <n>] [--tokens <text>] [--cost <text>]  by hand, over the transcript's
  [--met <1,2,…>]  the review items the screenshots meet   [--review <verdict>] [--findings <text>]`;

const parse = () =>
  parseArgs({
    allowPositionals: true,
    options: {
      out: { type: "string" },
      log: { type: "boolean" },
      transcript: { type: "string" },
      agent: { type: "string" },
      minutes: { type: "string" },
      calls: { type: "string" },
      tokens: { type: "string" },
      cost: { type: "string" },
      met: { type: "string" },
      review: { type: "string" },
      findings: { type: "string" },
      help: { type: "boolean" },
    },
  });

function main(): number {
  let args: ReturnType<typeof parse>;
  let task: Task;
  let met: boolean[] | undefined;
  let metrics: Metrics | undefined;
  try {
    args = parse();
    if (args.values.help) {
      console.log(USAGE);
      return 0;
    }
    if (args.positionals.length !== 2)
      throw new Error("give a task and a plugin folder");
    task = readTask(args.positionals[0]);
    met = parseMet(task, args.values.met);
    if (args.values.transcript)
      metrics = readTranscript(fs.readFileSync(args.values.transcript, "utf8"));
  } catch (error) {
    console.error(`error: ${(error as Error).message}\n${USAGE}`);
    return 2;
  }
  const {
    out,
    log,
    transcript,
    met: _met,
    help: _help,
    ...flags
  } = args.values;
  const dir = path.resolve(args.positionals[1]);
  const checks = checkPlugin(task, dir);
  const date = (metrics?.start ?? new Date().toISOString()).slice(0, 10);
  const passed = checks.every((check) => check.pass);
  const built = provenance(dir);
  const run = runOf(flags, metrics, buildCell(built), met);

  const file = path.resolve(out ?? `${dir}.trial.json`);
  const result = {
    task: task.id,
    shape: task.shape,
    dir,
    date,
    ...run,
    transcript: transcript && path.resolve(transcript),
    metrics,
    provenance: built,
    passed,
    checks,
    review: task.review.map((item, index) => ({ item, met: met?.[index] })),
  };
  fs.writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`);

  const row = resultsRow(task, checks, run, date);
  console.log(
    `${task.id} (${task.shape}${task.design ? ", with a design" : ""}) in ${dir}\n`,
  );
  console.log(table(checks));
  if (metrics)
    console.log(
      `\nTranscript: ${metrics.start ?? "?"} to ${metrics.end ?? "?"} (${metrics.minutes ?? "?"} min), ${metrics.model ?? "model unknown"}; ${metrics.calls} tool calls; ${tokensCell(metrics.tokens)}; ${metrics.costUsd === undefined ? "no cost" : `$${metrics.costUsd.toFixed(2)}`}; ${metrics.ranCheck ? "ran" : "never ran"} npm run check; ${metrics.screenshots} screenshot command(s)`,
    );
  console.log(`Build: ${run.build}`);
  console.log(`\n${passed ? "All passed" : "Failed"}. Result: ${file}`);
  console.log(
    `\nDesign review (then --met with the numbers met): look for\n${task.review.map((item, index) => `${index + 1}. ${item}`).join("\n")}`,
  );
  if (log) {
    fs.appendFileSync(RESULTS, `${row}\n`);
    // the table's columns realigned, as the repo's format check wants them
    spawnSync("npx", ["--no-install", "prettier", "--write", RESULTS], {
      cwd: REPO,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
  }
  console.log(`\nRESULTS.md row${log ? " (appended)" : ""}:\n${row}`);
  return passed ? 0 : 1;
}

if (import.meta.filename === process.argv[1]) process.exitCode = main();
