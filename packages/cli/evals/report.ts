#!/usr/bin/env node
/**
 * The A/B report from the trials' result.json: per task and model, each arm's runs, how many passed the gate, how
 * many the grader found acceptable, pass^k (every run of the arm acceptable) and the mean cost, then `full` minus
 * `bare` on acceptable. Trials that hit an infrastructure failure are left out and listed. Markdown on stdout.
 *
 * Usage: node packages/cli/evals/report.ts <trial dir or folder of them>…
 */
import fs from "node:fs";
import path from "node:path";

export interface Result {
  task: string;
  condition: string;
  model: string;
  infra?: string;
  passed?: boolean;
  grade?: { acceptable: 0 | 1 };
  metrics?: { costUsd?: number; tokens?: number };
}

const mean = (values: number[]) =>
  values.length
    ? values.reduce((sum, each) => sum + each, 0) / values.length
    : undefined;
const pct = (value?: number) =>
  value === undefined ? "–" : `${Math.round(value * 100)}%`;

export function report(results: Result[]): string {
  const kept = results.filter((result) => !result.infra);
  const groups = [
    ...new Set(kept.map((result) => `${result.task} (${result.model})`)),
  ].toSorted();
  const arm = (group: string, condition: string) =>
    kept.filter(
      (result) =>
        `${result.task} (${result.model})` === group &&
        result.condition === condition,
    );
  const acceptable = (runs: Result[]) =>
    mean(runs.filter((run) => run.grade).map((run) => run.grade!.acceptable));
  const rows = groups.flatMap((group) =>
    ["full", "bare"].map((condition) => {
      const runs = arm(group, condition);
      const graded = runs.filter((run) => run.grade);
      const cost = mean(runs.flatMap((run) => run.metrics?.costUsd ?? []));
      return `| ${group} | ${condition} | ${runs.length} | ${pct(mean(runs.map((run) => Number(run.passed))))} | ${pct(acceptable(runs))} | ${graded.length ? (graded.every((run) => run.grade!.acceptable) ? "yes" : "no") : "–"} | ${cost === undefined ? "–" : `$${cost.toFixed(2)}`} |`;
    }),
  );
  const diffs = groups.flatMap((group) => {
    const [a, b] = [
      acceptable(arm(group, "full")),
      acceptable(arm(group, "bare")),
    ];
    return a === undefined || b === undefined ? [] : [a - b];
  });
  const diff = mean(diffs);
  const left = results.filter((result) => result.infra);
  return [
    "# Eval: full vs bare",
    "| Task | Arm | Runs | Gate | Acceptable | All acceptable | Cost |\n| --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
    diff === undefined
      ? "No task is graded in both arms yet."
      : `Acceptable, full minus bare, mean over ${diffs.length} task(s): **${diff >= 0 ? "+" : "−"}${Math.round(Math.abs(diff) * 100)} pts**.`,
    ...(left.length
      ? [
          "",
          "Left out (infrastructure):",
          ...left.map(
            (result) =>
              `- ${result.task} (${result.condition}): ${result.infra}`,
          ),
        ]
      : []),
  ].join("\n");
}

/** The result.json of each trial named, or of each trial in a folder named. */
function resultsIn(paths: string[]): Result[] {
  return paths.flatMap((each) => {
    const file = path.join(each, "result.json");
    if (fs.existsSync(file)) return [JSON.parse(fs.readFileSync(file, "utf8"))];
    return fs
      .readdirSync(each)
      .map((name) => path.join(each, name, "result.json"))
      .filter((name) => fs.existsSync(name))
      .map((name) => JSON.parse(fs.readFileSync(name, "utf8")));
  });
}

if (import.meta.filename === process.argv[1]) {
  if (!process.argv[2]) {
    console.error(
      "Usage: node packages/cli/evals/report.ts <trial dir or folder of them>…",
    );
    process.exitCode = 2;
  } else console.log(report(resultsIn(process.argv.slice(2))));
}
