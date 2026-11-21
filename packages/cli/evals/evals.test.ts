import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { gradeOf, promptOf } from "./grade.ts";
import { report, type Result } from "./report.ts";
import {
  infraFailure,
  metricsOf,
  readTask,
  shotsFor,
  stripTooling,
  toolingLeft,
} from "./run.ts";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "evals-"));
const write = (dir: string, name: string, text: string) => {
  fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
  fs.writeFileSync(path.join(dir, name), text);
};

describe("the tasks", () => {
  it.each(["users", "data-connection", "report-usage"])(
    "%s has a request, review items and shots",
    (id) => {
      const task = readTask(id);
      expect(task.id).toBe(id);
      expect(task.request.length).toBeGreaterThan(50);
      expect(task.review.length).toBeGreaterThan(2);
      expect(task.shots[0].url).toContain("{route}");
    },
  );
});

describe("bare", () => {
  it("takes the tooling out of a new plugin, and says what's left", () => {
    const dir = tmp();
    write(
      dir,
      "package.json",
      JSON.stringify({
        scripts: { check: "oxlint", rule: "uikit-tools rule" },
        devDependencies: { "@pentaho/uikit-tools": "*", oxlint: "*" },
      }),
    );
    write(
      dir,
      ".oxlintrc.json",
      JSON.stringify({
        extends: ["strict.json", "@pentaho/uikit-tools/oxlint.json"],
      }),
    );
    write(dir, "AGENTS.md", "Run uikit-tools.");
    write(dir, "src/page.tsx", "// see AGENTS.md");
    stripTooling(dir);
    expect(
      JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")),
    ).toEqual({
      scripts: { check: "oxlint" },
      devDependencies: { oxlint: "*" },
    });
    expect(
      JSON.parse(fs.readFileSync(path.join(dir, ".oxlintrc.json"), "utf8"))
        .extends,
    ).toEqual(["strict.json"]);
    expect(toolingLeft(dir)).toEqual(["src/page.tsx"]);
    fs.rmSync(dir, { recursive: true });
  });
});

describe("the transcript", () => {
  const line = (entry: object) => JSON.stringify(entry);
  it("reads the model, tool calls, tokens and cost", () => {
    const metrics = metricsOf(
      [
        line({ type: "system", subtype: "init", model: "claude-opus-5-5" }),
        line({
          type: "assistant",
          message: { content: [{ type: "tool_use" }, { type: "text" }] },
        }),
        line({
          type: "assistant",
          message: { content: [{ type: "tool_use" }] },
        }),
        "not json",
        line({
          type: "result",
          subtype: "success",
          total_cost_usd: 1.5,
          duration_ms: 600_000,
          usage: {
            input_tokens: 10,
            output_tokens: 20,
            cache_read_input_tokens: 70,
          },
        }),
      ].join("\n"),
    );
    expect(metrics).toEqual({
      model: "claude-opus-5-5",
      calls: 2,
      costUsd: 1.5,
      tokens: 100,
      minutes: 10,
      ending: "success",
    });
    expect(infraFailure(metrics)).toBeUndefined();
  });

  it("tells an infrastructure failure from the agent's", () => {
    expect(infraFailure(metricsOf(""))).toBe("claude stopped without a result");
    const failed = (result: string) =>
      infraFailure(
        metricsOf(
          line({ type: "result", subtype: "success", is_error: true, result }),
        ),
      );
    expect(failed("API Error: 529 overloaded")).toContain("API Error");
    expect(failed("I couldn't finish")).toBeUndefined();
    // the budget running out is the agent's
    expect(
      infraFailure(
        metricsOf(line({ type: "result", subtype: "error_max_budget_usd" })),
      ),
    ).toBeUndefined();
  });
});

describe("the shots", () => {
  it("point at the plugin's first view and the sample states it has", () => {
    const dir = tmp();
    write(dir, "plugin.json", JSON.stringify({ views: [{ route: "/users" }] }));
    write(dir, "samples.no-users.json", "[]");
    const shots = shotsFor(
      {
        id: "t",
        request: "",
        review: [],
        shots: [
          { name: "list", url: "{route}" },
          { name: "empty", url: "{route}?samples=empty|no-users" },
        ],
      },
      "http://127.0.0.1:5199",
      dir,
    );
    expect(shots.map((shot) => [shot.name, shot.url])).toEqual([
      ["01-list", "http://127.0.0.1:5199/users"],
      ["02-empty", "http://127.0.0.1:5199/users?samples=no-users"],
    ]);
    fs.rmSync(dir, { recursive: true });
  });
});

describe("the grader", () => {
  it("asks about the request and its review items, never the condition", () => {
    const prompt = promptOf(readTask("users"), ["01-list.png"]);
    expect(prompt).toContain("1. Each user shows");
    expect(prompt).not.toMatch(/\b(full|bare)\b/);
  });

  it("reads the verdict from the answer's last JSON", () => {
    expect(gradeOf('Looked.\n{"acceptable": 1, "notes": "fine"}')).toEqual({
      acceptable: 1,
      notes: "fine",
    });
    expect(() => gradeOf('{"acceptable": 2}')).toThrow(/1 or 0/);
    expect(() => gradeOf("no verdict")).toThrow(/no JSON/);
  });
});

describe("the report", () => {
  it("compares the arms on acceptable, with pass^k and cost, leaving out infrastructure failures", () => {
    const run = (
      condition: string,
      acceptable: 0 | 1,
      costUsd: number,
    ): Result => ({
      task: "users",
      condition,
      model: "m",
      passed: true,
      grade: { acceptable },
      metrics: { costUsd },
    });
    const text = report([
      run("full", 1, 2),
      run("full", 1, 4),
      run("bare", 1, 1),
      run("bare", 0, 1),
      { task: "users", condition: "bare", model: "m", infra: "API Error" },
    ]);
    expect(text).toContain(
      "| users (m) | full | 2 | 100% | 100% | yes | $3.00 |",
    );
    expect(text).toContain(
      "| users (m) | bare | 2 | 100% | 50% | no | $1.00 |",
    );
    expect(text).toContain("mean over 1 task(s): **+50 pts**");
    expect(text).toContain("- users (bare): API Error");
  });
});
