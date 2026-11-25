import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

import { hookProblems } from "../commands/hook.js";
import { callTool } from "../commands/mcp.js";
import { lintText, lint as uikitLint } from "../core/lint.js";
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

// The preset loads `@pentaho/uikit-tools/lint`, the built plugin: `npm test` builds it first.
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("oxlint.json", () => {
  it("reports exactly the lines marked ✗ in the fixtures", () => {
    const found = new Set(
      lint(fixtures).map(
        (d) => `${path.basename(d.filename)}:${d.labels[0]?.span.line ?? 0}`,
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
    const listed = new Set(
      [...text.matchAll(/"(uikit\/[a-z-]+)": "error"/g)].map((m) => m[1]),
    );
    expect([...listed].toSorted()).toEqual(RULES.map(ruleId).toSorted());
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
});

describe("uikit-tools hook", () => {
  const project = path.dirname(fixtures);
  const stop = (active = false) =>
    JSON.stringify({ hook_event_name: "Stop", stop_hook_active: active });

  it("returns the project's design problems when the agent is about to finish", () => {
    expect(hookProblems(stop(), project)).toContain("uikit(raw-elements)");
  });

  it("lets the agent finish once it has had the report, and ignores bad input", () => {
    expect(hookProblems(stop(true), project)).toBeUndefined();
    expect(hookProblems("not json", project)).toBeUndefined();
  });

  it("doesn't hold the agent when there's no code to lint", () => {
    const empty = path.join(dir, "empty");
    mkdirSync(path.join(empty, "src"), { recursive: true });
    writeFileSync(path.join(empty, "src/notes.md"), "# notes\n");
    expect(hookProblems(stop(), empty)).toBeUndefined();
  });

  it("passes a project with clean code", () => {
    const clean = path.join(dir, "clean");
    mkdirSync(path.join(clean, "src"), { recursive: true });
    writeFileSync(path.join(clean, "src/ok.ts"), "export const ok = 1;\n");
    expect(hookProblems(stop(), clean)).toBe("");
  });
});

describe("uikit-tools lint", () => {
  it("reports only the design rules, with the oxlint it ships, as the MCP tool does", () => {
    const result = uikitLint(["test-fixtures/lint/src"], tools);
    expect(result.ok).toBe(false);
    expect(result.report).toMatch(/Page\.tsx:\d+:\d+: .*uikit\(raw-elements\)/);
    const codes = result.report.match(/\[\w+\/[\w-]+\(/g) ?? [];
    expect(codes.every((c) => /\/(uikit|jsx-a11y)\($/.test(c))).toBe(true);
    const mcp = callTool(
      "lint",
      { paths: ["test-fixtures/lint/src"] },
      { cwd: tools },
    );
    expect(mcp.content[0].text).toBe(lintText(result));
  });

  it("reports the preset's accessibility rules, the internals' imports, and not tests' bare markup", () => {
    const project = path.join(dir, "checks");
    mkdirSync(path.join(project, "src"), { recursive: true });
    writeFileSync(
      path.join(project, "src/Logo.tsx"),
      'import { Box } from "@mui/material";\nimport type { Theme } from "@mui/material";\nexport type T = Theme;\nexport default () => <Box><img src="logo.png" /></Box>;\n',
    );
    writeFileSync(
      path.join(project, "src/Logo.test.tsx"),
      'export const t = () => <button type="button">x</button>;\n',
    );
    const cwd = path.join(dir, "cwd");
    mkdirSync(cwd, { recursive: true });
    // a path with `..`, as an agent writes one
    const { report } = uikitLint(["../checks/src"], cwd);
    expect(report).toMatch(/Logo\.tsx:1:\d+: .*uikit\(internal-imports\)/);
    expect(report).not.toMatch(/Logo\.tsx:2:/);
    expect(report).toContain("jsx-a11y(alt-text)");
    expect(report).not.toContain("Logo.test.tsx");
  });

  it("passes clean code, and fails on a path with no files", () => {
    expect(uikitLint(["src/cli.ts"], tools)).toEqual({
      report: expect.any(String),
      ok: true,
    });
    expect(() => uikitLint(["no-such-folder"], tools)).toThrow(/oxlint failed/);
    // a flag-like path is a missing file, never an oxlint option such as --fix
    expect(() => uikitLint(["--fix"], tools)).toThrow(/oxlint failed/);
  });
});
