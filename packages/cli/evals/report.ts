#!/usr/bin/env node
/**
 * The A/B report from the trials' result.json, Markdown on stdout. Per task and arm: how many runs passed the gate and
 * how many are acceptable, a working plugin (gate passed) the grader accepts (counts, never shares: the runs are few),
 * why each other run isn't (the failed gate, the grader's note), and the effort per run in tokens by kind, turns and
 * minutes (median and range when there are several runs), with full ÷ bare. Then the verdicts, by fixed rules, so a few runs never read as a finding:
 * - acceptable: a difference is stated only with 3 or more graded runs per arm on every task, a pooled one-sided
 *   Fisher p below 0.05, and no task going the other way;
 * - effort, per task: lower or higher only with 3 or more runs per arm and ranges that don't overlap.
 * Trials that hit an infrastructure failure are left out and counted per arm.
 *
 * Usage: node packages/cli/evals/report.ts <trial dir or folder of them>…
 */
import fs from "node:fs";
import path from "node:path";

import type { Metrics } from "./run.ts";

export interface Result {
  task: string;
  condition: string;
  model: string;
  harness?: string;
  started?: string;
  infra?: string;
  passed?: boolean;
  gates?: Record<string, boolean>;
  grade?: { acceptable: 0 | 1; notes?: string };
  /** a person's verdict on the same screenshots, to check the grader */
  human?: { acceptable: 0 | 1 };
  missingShots?: string[];
  metrics?: Metrics;
}

/** The tasks the guides were tuned against (README): a result on them is in-sample. */
const TUNED_ON = new Set(["users", "data-connection", "report-usage"]);
const ARMS = ["full", "bare"] as const;
/** Runs per arm, on every task, before a difference is stated. */
const ENOUGH = 3;

const tokens = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : `${Math.round(n / 1e3)}k`;
const minutes = (ms: number) => (ms / 60_000).toFixed(1);
const median = (values: number[]) => {
  const sorted = values.toSorted((a, b) => a - b);
  const mid = sorted.length / 2;
  return Number.isInteger(mid)
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[Math.floor(mid)];
};
/** Acceptable: a working plugin (its gate passed) that the grader accepts. */
const accepted = (run: Result) => Boolean(run.passed && run.grade?.acceptable);
const count = (runs: Result[], ok: (run: Result) => boolean) =>
  `${runs.filter(ok).length}/${runs.length}`;

/** One effort measure of a run, undefined when the transcript had no result line. */
const MEASURES: {
  label: string;
  of: (m: Metrics) => number | undefined;
  show: (n: number) => string;
}[] = [
  { label: "Output tokens", of: (m) => m.usage?.output, show: tokens },
  { label: "of which thinking", of: (m) => m.usage?.thinking, show: tokens },
  { label: "Context re-read", of: (m) => m.usage?.cacheRead, show: tokens },
  { label: "Context written", of: (m) => m.usage?.cacheWrite, show: tokens },
  { label: "Turns", of: (m) => m.turns, show: String },
  { label: "Minutes", of: (m) => m.durationMs, show: minutes },
];
/** The measures a verdict on effort reads: what the agent wrote, what it read, how long it went on. */
const VERDICT_MEASURES = ["Output tokens", "Context re-read", "Turns"];

const valuesOf = (runs: Result[], of: (m: Metrics) => number | undefined) =>
  runs.flatMap((run) => {
    const value = run.metrics && of(run.metrics);
    return value === undefined ? [] : [value];
  });

/** `30k` for one run, `30k [24k–37k]` (median, range) for several. */
function cell(values: number[], show: (n: number) => string) {
  if (!values.length) return "–";
  if (values.length === 1) return show(values[0]);
  return `${show(median(values))} [${show(Math.min(...values))}–${show(Math.max(...values))}]`;
}

/** The one-sided Fisher exact p that full is acceptable more often than bare, from pooled counts. */
export function fisherOneSided(
  fullYes: number,
  fullRuns: number,
  bareYes: number,
  bareRuns: number,
) {
  const choose = (n: number, k: number) => {
    let c = 1;
    for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
    return c;
  };
  const yes = fullYes + bareYes;
  const total = fullRuns + bareRuns;
  let p = 0;
  for (let x = fullYes; x <= Math.min(fullRuns, yes); x++)
    p +=
      (choose(yes, x) * choose(total - yes, fullRuns - x)) /
      choose(total, fullRuns);
  return Math.min(p, 1);
}

export function report(results: Result[]): string {
  const kept = results.filter((result) => !result.infra);
  const tasks = [...new Set(kept.map((result) => result.task))].toSorted();
  const arm = (task: string, condition: string) =>
    kept.filter(
      (result) => result.task === task && result.condition === condition,
    );
  const perArm = tasks.flatMap((task) =>
    ARMS.map((condition) => arm(task, condition).length),
  );
  const k = Math.max(0, ...perArm);
  const models = [...new Set(kept.map((result) => result.model))];
  const shas = [
    ...new Set(kept.flatMap((result) => result.harness ?? [])),
  ].toSorted();
  const days = [
    ...new Set(kept.flatMap((result) => result.started?.slice(0, 10) ?? [])),
  ].toSorted();
  const inSample = tasks.filter((task) => TUNED_ON.has(task));
  const checked = kept.filter((result) => result.human && result.grade);

  const header = [
    `# Agent evals: full vs bare — ${k <= 1 ? "smoke test" : `${k} runs per arm`}`,
    [
      models.join(", ") || "no model",
      `${k} run${k === 1 ? "" : "s"} per arm`,
      `${tasks.length} task${tasks.length === 1 ? "" : "s"}`,
      `harness ${shas.join(", ") || "unknown"}`,
      days.length > 1 ? `${days[0]} to ${days.at(-1)}` : (days[0] ?? ""),
    ]
      .filter(Boolean)
      .join(" · "),
    "",
    ...(k <= 1
      ? [
          "Smoke test: shows the harness works end to end. Not evidence for or against the tooling.",
        ]
      : []),
    ...(inSample.length
      ? [
          `In-sample: the guides were tuned on ${inSample.length === tasks.length ? "these tasks" : `${inSample.join(", ")}`}. A finding on new work needs new tasks.`,
        ]
      : []),
    checked.length
      ? `Grader against a person: agrees on ${checked.filter((run) => run.human!.acceptable === run.grade!.acceptable).length}/${checked.length} runs.`
      : "Grader not yet checked against a person.",
  ];

  const outcome = [
    "## Outcome",
    "",
    "| Task | Arm | Runs | Gate | Acceptable | Why runs weren't acceptable |",
    "| --- | --- | --- | --- | --- | --- |",
    ...tasks.flatMap((task) =>
      ARMS.map((condition, index) => {
        const runs = arm(task, condition);
        const graded = runs.filter((run) => run.grade);
        const notes = graded
          .filter((run) => !accepted(run))
          .map((run) =>
            [
              ...(run.passed
                ? []
                : [
                    `Gate failed: ${Object.entries(run.gates ?? {})
                      .filter(([, ok]) => !ok)
                      .map(([gate]) => gate)
                      .join(", ")}.`,
                  ]),
              ...(run.grade!.acceptable ? [] : [run.grade!.notes ?? ""]),
            ]
              .filter(Boolean)
              .join(" "),
          )
          .filter(Boolean)
          .join(" / ");
        return `| ${index ? "" : task} | ${condition} | ${runs.length} | ${count(runs, (run) => Boolean(run.passed))} | ${graded.length ? count(graded, accepted) : "–"} | ${notes} |`;
      }),
    ),
  ];

  const effort = [
    `## Effort, per run${k > 1 ? " (median [min–max])" : ""}`,
    "",
    `| Task | Arm | ${MEASURES.map((m) => m.label).join(" | ")} |`,
    `| --- | --- | ${MEASURES.map(() => "---").join(" | ")} |`,
    ...tasks.flatMap((task) => {
      const rows = ARMS.map(
        (condition, index) =>
          `| ${index ? "" : task} | ${condition} | ${MEASURES.map((m) => cell(valuesOf(arm(task, condition), m.of), m.show)).join(" | ")} |`,
      );
      const ratios = MEASURES.map((m) => {
        const [full, bare] = ARMS.map((condition) =>
          valuesOf(arm(task, condition), m.of),
        );
        return full.length && bare.length && median(bare)
          ? (median(full) / median(bare)).toFixed(2)
          : "–";
      });
      return [...rows, `| | full ÷ bare | ${ratios.join(" | ")} |`];
    }),
  ];

  // the verdicts
  const graded = (condition: string) =>
    kept.filter((run) => run.condition === condition && run.grade);
  const [full, bare] = ARMS.map(graded);
  const yes = (runs: Result[]) => runs.filter(accepted).length;
  const enough = tasks.every((task) =>
    ARMS.every(
      (condition) =>
        arm(task, condition).filter((run) => run.grade).length >= ENOUGH,
    ),
  );
  const rate = (runs: Result[]) => (runs.length ? yes(runs) / runs.length : 0);
  const contrary = tasks.filter((task) => {
    const [f, b] = ARMS.map((condition) =>
      arm(task, condition).filter((run) => run.grade),
    );
    return rate(b) > rate(f);
  });
  const p = fisherOneSided(yes(full), full.length, yes(bare), bare.length);
  const acceptable = `Acceptable: full ${yes(full)}/${full.length} runs, bare ${yes(bare)}/${bare.length}. ${
    !enough
      ? `Too few runs to compare: a difference needs ${ENOUGH} graded runs per arm on every task.`
      : p < 0.05 && !contrary.length
        ? `Full is acceptable more often (one-sided Fisher p = ${p.toFixed(3)}).`
        : `No difference shown (one-sided Fisher p = ${p.toFixed(2)}${contrary.length ? `; bare ahead on ${contrary.join(", ")}` : ""}).`
  }`;

  const effortVerdicts = enough
    ? tasks.map((task) => {
        const found = MEASURES.filter((m) =>
          VERDICT_MEASURES.includes(m.label),
        ).flatMap((m) => {
          const [f, b] = ARMS.map((condition) =>
            valuesOf(arm(task, condition), m.of),
          );
          if (f.length < ENOUGH || b.length < ENOUGH) return [];
          if (Math.max(...f) < Math.min(...b))
            return [`${m.label.toLowerCase()} lower`];
          if (Math.min(...f) > Math.max(...b))
            return [`${m.label.toLowerCase()} higher`];
          return [];
        });
        return `Effort, ${task}: ${found.length ? `full ${found.join(", ")} (ranges don't overlap)` : "no difference shown"}.`;
      })
    : [
        `Effort: full read less context in ${
          tasks.filter((task) => {
            const [f, b] = ARMS.map((condition) =>
              valuesOf(arm(task, condition), (m) => m.usage?.cacheRead),
            );
            return f.length && b.length && median(f) < median(b);
          }).length
        } of ${tasks.length} tasks, with ${k <= 1 ? "one run each" : "too few runs"}: a direction, not a finding.`,
      ];

  const left = (condition: string) =>
    results.filter((run) => run.infra && run.condition === condition).length;
  const uneven = tasks.filter(
    (task) => arm(task, "full").length !== arm(task, "bare").length,
  );
  const missing = kept.reduce(
    (sum, run) => sum + (run.missingShots?.length ?? 0),
    0,
  );
  const verdicts = [
    "## Verdict",
    "",
    acceptable,
    ...effortVerdicts,
    `Screenshots the script couldn't take: ${missing}. Left out (infrastructure): full ${left("full")}, bare ${left("bare")}.`,
    ...(uneven.length
      ? [
          `Uneven runs on ${uneven.join(", ")}: rerun the arm that's short before comparing.`,
        ]
      : []),
    ...results
      .filter((run) => run.infra)
      .map((run) => `- ${run.task} (${run.condition}): ${run.infra}`),
  ];

  return [...header, "", ...outcome, "", ...effort, "", ...verdicts].join("\n");
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
