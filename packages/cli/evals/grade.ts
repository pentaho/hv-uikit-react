#!/usr/bin/env node
/**
 * The blind grader: for each trial, Claude reads its review screenshots, copied to a folder whose name says nothing of
 * the condition, against the task's request and review items, and judges whether it's an acceptable answer to the
 * request, with at most minor fixes. Like the agent, it gets none of this machine's Claude settings, memory or
 * plugins: a fresh HOME when CLAUDE_CODE_OAUTH_TOKEN is set, and only the (empty) project's settings. The verdict goes
 * in the trial's result.json as `grade`. Check it against a person on a few trials (the screenshots are in each
 * trial's review/) before trusting it.
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
}

/** What the grader is asked: the request, the review items, the screenshots to read, the answer's shape. */
export const promptOf = (task: Task, shots: string[]) =>
  [
    "You are a product designer reviewing a page an engineer built for this request, from its screenshots only.",
    `The request:\n> ${task.request}`,
    `What to check:\n${task.review.map((item, index) => `${index + 1}. ${item}`).join("\n")}`,
    `Read every screenshot in this folder (${shots.join(", ")}).`,
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
    const result = JSON.parse(fs.readFileSync(file, "utf8"));
    const review = path.join(dir, "review");
    if (result.infra || !fs.existsSync(review)) continue;
    // blind: a folder named at random, the PNGs only
    const blind = path.join(
      os.tmpdir(),
      `grade-${randomBytes(4).toString("hex")}`,
    );
    fs.cpSync(review, blind, { recursive: true });
    const shots = fs.readdirSync(blind).filter((name) => name.endsWith(".png"));
    const answer = spawnSync(
      "claude",
      [
        "-p",
        promptOf(readTask(result.task), shots),
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
      result.grade = gradeOf(answer.stdout ?? "");
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
