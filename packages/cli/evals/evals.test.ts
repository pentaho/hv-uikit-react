import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { gradeOf, promptOf } from "./grade.ts";
import { fisherOneSided, report, type Result } from "./report.ts";
import {
  infraFailure,
  installFromPacks,
  metricsOf,
  packsIn,
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
    // as Prettier writes it, so the plugin still passes its own check
    expect(fs.readFileSync(path.join(dir, ".oxlintrc.json"), "utf8")).toBe(
      '{\n  "extends": ["strict.json"]\n}\n',
    );
    expect(toolingLeft(dir)).toEqual(["src/page.tsx"]);
    fs.rmSync(dir, { recursive: true });
  });
});

describe("this branch's packages", () => {
  it("are installed from their tarballs, direct and transitive", () => {
    const dir = tmp();
    write(dir, "packs/pentaho-uikit-react-core-7.0.1.tgz", "");
    write(dir, "packs/pentaho-app-shell-ui-3.0.0.tgz", "");
    write(dir, "packs/notes.txt", "");
    const packs = packsIn(path.join(dir, "packs"));
    expect(Object.keys(packs).toSorted()).toEqual([
      "@pentaho/app-shell-ui",
      "@pentaho/uikit-react-core",
    ]);
    write(
      dir,
      "plugin/package.json",
      JSON.stringify({
        dependencies: { "@pentaho/uikit-react-core": "^7.0.1", react: "^18" },
      }),
    );
    installFromPacks(path.join(dir, "plugin"), packs);
    const pkg = JSON.parse(
      fs.readFileSync(path.join(dir, "plugin/package.json"), "utf8"),
    );
    expect(pkg.dependencies).toEqual({
      "@pentaho/uikit-react-core": `file:${packs["@pentaho/uikit-react-core"]}`,
      react: "^18",
    });
    expect(Object.keys(pkg.overrides)).toEqual(Object.keys(packs));
    // none packed: the released packages, from npm
    expect(packsIn(path.join(dir, "none"))).toEqual({});
  });
});

describe("the transcript", () => {
  const line = (entry: object) => JSON.stringify(entry);
  it("reads the model, version, tool calls, turns, times and tokens by kind", () => {
    const metrics = metricsOf(
      [
        line({
          type: "system",
          subtype: "init",
          model: "claude-opus-5-5",
          claude_code_version: "2.1.323",
        }),
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
          num_turns: 12,
          duration_ms: 600_000,
          duration_api_ms: 300_000,
          total_cost_usd: 1.5,
          usage: {
            input_tokens: 10,
            output_tokens: 20,
            output_tokens_details: { thinking_tokens: 5 },
            cache_read_input_tokens: 70,
            cache_creation_input_tokens: 30,
          },
        }),
      ].join("\n"),
    );
    // no dollars: the tokens by kind, never added up
    expect(metrics).toEqual({
      model: "claude-opus-5-5",
      claudeCodeVersion: "2.1.323",
      calls: 2,
      turns: 12,
      durationMs: 600_000,
      durationApiMs: 300_000,
      usage: {
        output: 20,
        thinking: 5,
        cacheRead: 70,
        cacheWrite: 30,
        input: 10,
      },
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
    // running out of turns is the agent's
    expect(
      infraFailure(
        metricsOf(line({ type: "result", subtype: "error_max_turns" })),
      ),
    ).toBeUndefined();
    // so is running out of time: stopped with no result line, the trial marks it and still counts
    expect(
      infraFailure({ ...metricsOf(""), ending: "timeout" }),
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
          { name: "failed", url: "{route}?samples=refus|fail" },
        ],
      },
      "http://127.0.0.1:5199",
      dir,
    );
    expect(shots.map((shot) => [shot.name, shot.url])).toEqual([
      ["01-list", "http://127.0.0.1:5199/users"],
      ["02-empty", "http://127.0.0.1:5199/users?samples=no-users"],
      ["03-failed", "http://127.0.0.1:5199/users?samples=refus|fail"],
    ]);
    // a state the plugin doesn't have: marked, so it isn't shot against other data
    expect(shots.map((shot) => Boolean(shot.noState))).toEqual([
      false,
      false,
      true,
    ]);
    fs.rmSync(dir, { recursive: true });
  });
});

describe("the grader", () => {
  it("asks about the request and its review items, never the condition", () => {
    const prompt = promptOf(readTask("users"), ["01-list.png"]);
    expect(prompt).toContain("1. Each user shows");
    expect(prompt).not.toMatch(/\b(full|bare)\b/);
    expect(prompt).not.toContain("couldn't take");
    // the design standards a designer holds any page to, and only what the request asks for
    expect(prompt).toContain(
      "Details of an item and edits to one open in a dialog",
    );
    expect(prompt).toContain(
      "something the request doesn't ask for is not a reason to reject",
    );
  });

  it("names the shots the review script couldn't take, so a gap isn't graded as a failure", () => {
    const prompt = promptOf(
      readTask("users"),
      ["01-list.png"],
      ["05-deactivated"],
    );
    expect(prompt).toContain("couldn't take 05-deactivated");
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
  const run = (
    task: string,
    condition: string,
    acceptable: 0 | 1,
    output: number,
    cacheRead: number,
    extra: Partial<Result> = {},
  ): Result => ({
    task,
    condition,
    model: "m",
    harness: "abc1234",
    started: "2026-11-25T10:00:00Z",
    passed: true,
    grade: { acceptable, notes: acceptable ? "fine" : "no owner column" },
    metrics: {
      calls: 10,
      turns: 20,
      durationMs: 360_000,
      usage: { output, thinking: 0, cacheRead, cacheWrite: 0, input: 0 },
    },
    ...extra,
  });

  it("a smoke test says so, counts without shares, no dollars, and the effort by kind with full ÷ bare", () => {
    const text = report([
      run("users", "full", 1, 30_000, 2_000_000),
      run("users", "bare", 0, 60_000, 4_000_000),
      { task: "users", condition: "bare", model: "m", infra: "API Error" },
    ]);
    expect(text).toContain("# Agent evals: full vs bare — smoke test");
    expect(text).toContain(
      "m · 1 run per arm · 1 task · harness abc1234 · 2026-11-25",
    );
    expect(text).toContain("Not evidence for or against the tooling.");
    expect(text).toContain("In-sample: the guides were tuned on these tasks.");
    expect(text).toContain("Grader not yet checked against a person.");
    expect(text).toContain("| users | full | 1 | 1/1 | 1/1 |  |");
    expect(text).toContain("|  | bare | 1 | 1/1 | 0/1 | no owner column |");
    expect(text).toContain(
      "| users | full | 30k | 0k | 2.00M | 0k | 20 | 6.0 |",
    );
    expect(text).toContain("| | full ÷ bare | 0.50 |");
    expect(text).toContain(
      "Acceptable: full 1/1 runs, bare 0/1. Too few runs to compare",
    );
    expect(text).toContain(
      "Effort: full read less context in 1 of 1 tasks, with one run each",
    );
    expect(text).toContain("Left out (infrastructure): full 0, bare 1.");
    expect(text).toContain("- users (bare): API Error");
    expect(text).not.toMatch(/\$|%|pts/);
  });

  it("states a difference only by the rules: enough runs, Fisher, no task the other way, ranges apart", () => {
    const arms = (task: string, full: (0 | 1)[], bare: (0 | 1)[]) => [
      ...full.map((a, i) => run(task, "full", a, 30_000 + i, 2_000_000 + i)),
      ...bare.map((a, i) => run(task, "bare", a, 60_000 + i, 4_000_000 + i)),
    ];
    const clear = report([
      ...arms("users", [1, 1, 1], [0, 0, 0]),
      ...arms("data-connection", [1, 1, 1], [0, 0, 1]),
      ...arms("report-usage", [1, 1, 1], [0, 0, 0]),
    ]);
    expect(clear).toContain("— 3 runs per arm");
    expect(clear).toContain(
      "Full is acceptable more often (one-sided Fisher p = 0.000)",
    );
    expect(clear).toContain(
      "Effort, users: full output tokens lower, context re-read lower (ranges don't overlap).",
    );
    const mixed = report([
      ...arms("users", [1, 1, 1], [1, 1, 1]),
      ...arms("data-connection", [1, 0, 0], [1, 1, 0]),
      ...arms("report-usage", [1, 1, 0], [1, 0, 0]),
    ]);
    expect(mixed).toMatch(
      /No difference shown \(one-sided Fisher p = [\d.]+; bare ahead on data-connection\)/,
    );
    expect(fisherOneSided(9, 9, 0, 9)).toBeLessThan(0.001);
    expect(fisherOneSided(3, 3, 0, 3)).toBeCloseTo(0.05, 3);
  });

  it("counts a run as acceptable only when its gate passed, and says which gate failed", () => {
    const text = report([
      run("users", "full", 1, 1, 1, {
        passed: false,
        gates: { check: false, build: true, package: true, renders: true },
      }),
      run("users", "bare", 1, 1, 1),
    ]);
    expect(text).toContain(
      "| users | full | 1 | 0/1 | 0/1 | Gate failed: check. |",
    );
    expect(text).toContain("Acceptable: full 0/1 runs, bare 1/1.");
  });

  it("counts the grader's agreement with a person", () => {
    const text = report([
      run("users", "full", 1, 1, 1, { human: { acceptable: 1 } }),
      run("users", "bare", 0, 1, 1, { human: { acceptable: 1 } }),
    ]);
    expect(text).toContain("Grader against a person: agrees on 1/2 runs.");
  });
});
