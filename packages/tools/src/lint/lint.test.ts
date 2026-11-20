import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { hookProblems } from "../commands/hook.js";
import { callTool } from "../commands/mcp.js";
import { lintText, lint as uikitLint } from "../core/lint.js";
import { loadRules } from "../core/rules.js";
import { RULES } from "./plugin.js";
import { ruleId } from "./rule.js";

const tools = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const repo = path.resolve(tools, "../..");
const preset = path.join(tools, "oxlint.json");
const fixtures = path.join(tools, "test-fixtures/lint/src");
const oxlint = path.join(repo, "node_modules/.bin/oxlint");
const dir = mkdtempSync(path.join(tmpdir(), "uikit-lint-"));

interface Diagnostic {
  code: string;
  filename: string;
  labels: { span: { line: number } }[];
}

/** oxlint with the preset (which loads the built plugin) over `target`. */
function lint(target: string, cwd = tools): Diagnostic[] {
  const config = path.join(dir, ".oxlintrc.json");
  writeFileSync(config, JSON.stringify({ extends: [preset] }));
  let out = "";
  try {
    out = execFileSync(oxlint, ["-c", config, "--format", "json", target], {
      encoding: "utf8",
      cwd,
    });
  } catch (error) {
    out = (error as { stdout: string }).stdout;
  }
  return (JSON.parse(out) as { diagnostics: Diagnostic[] }).diagnostics;
}

// The preset loads `@pentaho/uikit-tools/lint`, the built plugin.
beforeAll(() => {
  execFileSync(path.join(repo, "node_modules/.bin/tsc"), ["-p", tools]);
}, 60_000);
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("oxlint.json", () => {
  it("reports exactly the lines marked ✗ in the fixtures", () => {
    const found = new Set(
      lint(fixtures).map(
        (d) => `${path.basename(d.filename)}:${d.labels[0].span.line}`,
      ),
    );
    const marked = new Set(
      readFileSync(path.join(fixtures, "Page.tsx"), "utf8")
        .split("\n")
        .flatMap((line, i) =>
          line.includes("✗") && !line.includes("Lines marked")
            ? [`Page.tsx:${i + 1}`]
            : [],
        ),
    );
    expect(marked.size).toBeGreaterThan(0);
    expect([...found].toSorted()).toEqual([...marked].toSorted());
  });

  it("turns on every plugin rule, and only those", () => {
    const text = readFileSync(preset, "utf8");
    const listed = [...text.matchAll(/"(uikit\/[a-z-]+)"/g)].map((m) => m[1]);
    expect(listed.toSorted()).toEqual(RULES.map(ruleId).toSorted());
  });

  it("names only rule ids that exist in the rule files", () => {
    const cited = [
      ...readFileSync(preset, "utf8").matchAll(
        /\brule ([a-z-]+\/[a-z0-9-]+(?:, [a-z-]+\/[a-z0-9-]+)*)/g,
      ),
    ].flatMap((m) => m[1].split(", "));
    const ids = new Set(
      loadRules().flatMap((f) => f.sections.map((s) => s.id)),
    );
    expect(cited.length).toBeGreaterThan(0);
    expect(cited.filter((id) => !ids.has(id))).toEqual([]);
  });
});

describe("the uikit plugin", () => {
  it("each rule trips on its bad example and passes its good one", () => {
    // An app with a stand-in UI Kit whose declarations deprecate HvList, so uikit/deprecated has something to read
    // without a core build.
    const app = path.join(dir, "app");
    const core = path.join(app, "node_modules/@pentaho/uikit-react-core");
    mkdirSync(path.join(core, "dist"), { recursive: true });
    writeFileSync(
      path.join(core, "package.json"),
      JSON.stringify({ name: "@pentaho/uikit-react-core", version: "7.0.0" }),
    );
    writeFileSync(
      path.join(core, "dist/index.d.ts"),
      "/** @deprecated use HvListContainer */\nexport declare const HvList: () => null;\n",
    );
    const examples = path.join(app, "examples");
    mkdirSync(examples);
    for (const r of RULES) {
      writeFileSync(path.join(examples, `${r.name}.bad.tsx`), r.bad);
      if (r.good)
        writeFileSync(path.join(examples, `${r.name}.good.tsx`), r.good);
    }
    const hits = lint(examples, app)
      .filter((d) => d.code.startsWith("uikit("))
      .map((d) => `${path.basename(d.filename)} ${d.code}`);

    for (const r of RULES) {
      expect(hits).toContain(`${r.name}.bad.tsx uikit(${r.name})`);
      expect(hits.filter((h) => h.startsWith(`${r.name}.good.tsx`))).toEqual(
        [],
      );
    }
  });

  it("every lint rule a design note cites, in its text or `rules:`, exists", () => {
    const core = path.join(repo, "packages/core/src");
    const names = new Set(RULES.map(ruleId));
    const cited = readdirSync(core, { recursive: true })
      .filter((f): f is string => typeof f === "string" && f.endsWith(".md"))
      .flatMap((f) =>
        [
          ...readFileSync(path.join(core, f), "utf8").matchAll(
            /\b(uikit\/[a-z-]+)/g,
          ),
        ].map((m) => `${f}: ${m[1]}`),
      );
    expect(cited.length).toBeGreaterThan(0);
    expect(cited.filter((c) => !names.has(c.split(": ")[1]))).toEqual([]);
  });
});

describe("uikit-tools hook", () => {
  const input = (file: string) =>
    JSON.stringify({ tool_input: { file_path: file } });

  it("returns the design problems in a code file the agent wrote", () => {
    const problems = hookProblems(
      input(path.join(fixtures, "Page.tsx")),
      tools,
    );
    expect(problems).toContain("uikit(raw-elements)");
  });

  it("ignores other files, files outside the project and bad input", () => {
    expect(hookProblems(input(path.join(tools, "README.md")), tools)).toBe("");
    expect(hookProblems(input(path.join(fixtures, "Page.tsx")), dir)).toBe("");
    expect(hookProblems("not json", tools)).toBe("");
  });
});

describe("uikit-tools lint", () => {
  it("reports the findings with the oxlint it ships, as the MCP tool does", () => {
    const result = uikitLint(["test-fixtures/lint/src"], tools);
    expect(result.ok).toBe(false);
    expect(result.report).toMatch(/Page\.tsx:\d+:\d+: .*uikit\(raw-elements\)/);
    const mcp = callTool(
      "lint",
      { paths: ["test-fixtures/lint/src"] },
      { cwd: tools },
    );
    expect(mcp.content[0].text).toBe(lintText(result));
  });

  it("reports only the design rules, and reads every path as a path", () => {
    const { report } = uikitLint(["test-fixtures/lint/src"], tools);
    const codes = report.match(/\[\w+\/[\w-]+\(/g) ?? [];
    expect(codes.length).toBeGreaterThan(0);
    expect(codes.every((c) => /\/(uikit|jsx-a11y)\($/.test(c))).toBe(true);
    // a flag-like path is a missing file, never an oxlint option such as --fix
    expect(() => uikitLint(["--fix"], tools)).toThrow(/oxlint failed/);
  });

  it("passes clean code, and fails on a path with no files", () => {
    expect(uikitLint(["src/cli.ts"], tools)).toEqual({
      report: expect.any(String),
      ok: true,
    });
    expect(() => uikitLint(["no-such-folder"], tools)).toThrow(/oxlint failed/);
  });
});
