#!/usr/bin/env node
/**
 * The blind grader: for each trial, Claude reads its review screenshots, copied to a folder whose name says nothing of
 * the condition, against the task's request and review items, and judges whether it's an acceptable answer to the
 * request, with at most minor fixes. Like the agent, it gets none of this machine's Claude settings, memory or
 * plugins: a fresh HOME when CLAUDE_CODE_OAUTH_TOKEN is set, and only the (empty) project's settings. The verdict goes
 * in the trial's result.json as `grade`. Check it against a person on a few trials before trusting it: they read the
 * screenshots in review/ and add `"human": { "acceptable": 1 or 0 }` to result.json; the report counts the agreement.
 *
 * Usage: node packages/cli/evals/grade.ts <trial dir>… [--model claude-sonnet-5-5]
 */
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

import { readTask, type Task } from "./run.ts";

export interface Grade {
  acceptable: 0 | 1;
  notes: string;
  /** the grader's model */
  model?: string;
}

/** The design standards a Pentaho designer holds any page to, from the UI Kit's rules (packages/tools/rules: layout,
 * forms, components, actions, content). A person reviewing the trials judged by these as much as by the checklist. */
const DESIGN = [
  "The page is organized into clear sections (titled cards or sections), not one flat stack of controls and content.",
  "Details of an item and edits to one open in a dialog (not a drawer or a separate page); destructive or bulk actions are confirmed in a dialog that names what they affect.",
  "Forms keep a readable width, never stretched across a wide page, and a long form is grouped into titled sections, with Cancel then the primary action at its end.",
  "Inputs are handled: a required or invalid field is flagged at the field with how to fix it, and a server error is said in plain words, not as a raw message or stack trace.",
];

/** What the grader is asked: the request, the review items, the design standards, the screenshots to read (and those
 * the harness couldn't take), the answer's shape. */
export const promptOf = (task: Task, shots: string[], missing: string[] = []) =>
  [
    "You are a product designer at Pentaho reviewing a page an engineer built for this request, from its screenshots only. Decide whether you would accept it as an answer to the request, with at most minor fixes.",
    `The request:\n> ${task.request}`,
    `What the request implies, to check:\n${task.review.map((item, index) => `${index + 1}. ${item}`).join("\n")}\nJudge each item only as far as the request asks for it: something the request doesn't ask for is not a reason to reject.`,
    `The design standards every page is held to:\n${DESIGN.map((item) => `- ${item}`).join("\n")}\nA page that does what was asked but breaks one of these clearly is not acceptable.`,
    `Read every screenshot in this folder (${shots.join(", ")}).`,
    ...(missing.length
      ? [
          `The review script couldn't take ${missing.join(", ")}: a step found no matching control (a button the page names differently, or disables on purpose), or the page has no sample data for that state. Judge from the screenshots you have; a missing screenshot alone is not a failure.`,
        ]
      : []),
    'Then answer with only this JSON: {"acceptable": 1 or 0 (an acceptable answer to the request, at most minor fixes), "notes": "one sentence"}',
  ].join("\n\n");

/** The grade in the model's answer: its last JSON object, checked. */
export function gradeOf(answer: string): Grade {
  const json = answer.match(/\{[\s\S]*\}/g)?.at(-1);
  if (!json) throw new Error(`no JSON in the answer: ${answer.slice(0, 200)}`);
  const grade = JSON.parse(json) as Grade;
  if (grade.acceptable !== 0 && grade.acceptable !== 1)
    throw new Error(`acceptable is 1 or 0, not ${grade.acceptable}`);
  return grade;
}

function main(): number {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { model: { type: "string", default: "claude-sonnet-5-5" } },
  });
  if (!positionals.length) {
    console.error(
      "Usage: node packages/cli/evals/grade.ts <trial dir>… [--model <id>]",
    );
    return 2;
  }
  let graded = 0;
  for (const dir of positionals.map((each) => path.resolve(each))) {
    const file = path.join(dir, "result.json");
    if (!fs.existsSync(file)) {
      console.error(
        `${path.basename(dir)}: no result.json (the trial didn't start), skipped`,
      );
      continue;
    }
    const result = JSON.parse(fs.readFileSync(file, "utf8"));
    const review = path.join(dir, "review");
    if (result.infra || !fs.existsSync(review)) continue;
    // blind: a folder named at random, the PNGs only
    const blind = path.join(
      os.tmpdir(),
      `grade-${randomBytes(4).toString("hex")}`,
    );
    const shots = fs
      .readdirSync(review)
      .filter((name) => name.endsWith(".png"));
    fs.mkdirSync(blind);
    for (const shot of shots)
      fs.copyFileSync(path.join(review, shot), path.join(blind, shot));
    const answer = spawnSync(
      "claude",
      [
        "-p",
        promptOf(
          // the request the trial was given, which the task may have changed since
          {
            ...readTask(result.task),
            ...(result.request && { request: result.request }),
          },
          shots,
          result.missingShots,
        ),
        "--model",
        values.model,
        "--allowedTools",
        "Read",
        "--setting-sources",
        "project",
      ],
      {
        cwd: blind,
        encoding: "utf8",
        timeout: 10 * 60_000,
        env: process.env.CLAUDE_CODE_OAUTH_TOKEN
          ? { ...process.env, HOME: path.join(blind, ".home") }
          : process.env,
      },
    );
    fs.rmSync(blind, { recursive: true, force: true });
    try {
      result.grade = { ...gradeOf(answer.stdout ?? ""), model: values.model };
      fs.writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`);
      graded += 1;
      console.log(
        `${path.basename(dir)}: ${result.grade.acceptable} — ${result.grade.notes}`,
      );
    } catch (error) {
      console.error(`${path.basename(dir)}: ${(error as Error).message}`);
    }
  }
  console.log(`${graded} graded`);
  return 0;
}

if (import.meta.filename === process.argv[1]) process.exitCode = main();
