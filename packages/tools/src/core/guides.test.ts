/**
 * The guidance agents read stays true to the UI Kit: its code compiles against the real packages and passes the
 * design rules, and every component or hook it names exists.
 */
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { afterAll, describe, expect, it } from "vitest";

import { RULES } from "../lint/plugin.js";
import { lint } from "./lint.js";
import { NOT_COMPONENTS } from "./lookup.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../../..");
const tools = path.resolve(here, "../..");

/** Every markdown file agents read: the rule files and the skills. */
const guides = ["templates/rules", "skills"].flatMap((dir) =>
  readdirSync(path.join(tools, dir), { recursive: true })
    .filter((f): f is string => typeof f === "string" && f.endsWith(".md"))
    .map((f) => path.join(dir, f)),
);
const read = (file: string) => readFileSync(path.join(tools, file), "utf8");

/** The guides' whole tsx modules (a fragment, with no import, is left out), and the lint rules' `good` examples. */
const modules = [
  ...guides.flatMap((file) =>
    [...read(file).matchAll(/^\s*```tsx\n([\s\S]*?)^\s*```/gm)]
      .map((m) => m[1])
      .filter((code) => /^import /m.test(code))
      .map((code, i) => ({ name: `${file}#${i + 1}`, code })),
  ),
  ...RULES.filter((rule) => rule.good).map((rule) => ({
    name: `uikit/${rule.name} good`,
    code: rule.good as string,
  })),
];

const app = mkdtempSync(path.join(tmpdir(), "uikit-guides-"));
symlinkSync(path.join(repo, "node_modules"), path.join(app, "node_modules"));
const files = modules.map((m, i) => {
  const file = path.join(app, "src", `example-${i}.tsx`);
  return { ...m, file };
});
afterAll(() => rmSync(app, { recursive: true, force: true }));

describe("the guides' code", () => {
  it("has examples to check", () => {
    expect(
      files.filter((f) => !f.name.includes(" good")).length,
    ).toBeGreaterThan(1);
  });

  it("compiles against the UI Kit's packages", () => {
    writeFileSync(path.join(app, "package.json"), '{ "type": "module" }');
    for (const f of files) {
      ts.sys.createDirectory(path.dirname(f.file));
      writeFileSync(f.file, f.code);
    }
    const program = ts.createProgram(
      files.map((f) => f.file),
      {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        target: ts.ScriptTarget.ES2022,
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        types: [],
      },
    );
    const errors = ts.getPreEmitDiagnostics(program).map((d) => {
      const source = files.find((f) => f.file === d.file?.fileName)?.name;
      return `${source}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`;
    });
    expect(errors).toEqual([]);
  });

  it("passes the design rules", () => {
    const { report } = lint(["src"], app);
    const byName = files.reduce(
      (text, f) => text.replaceAll(path.basename(f.file), f.name),
      report,
    );
    expect(byName).toBe("");
  });
});

/** Components and hooks the UI Kit's packages declare. */
function declared() {
  const names = new Set<string>();
  for (const pkg of ["core", "viz", "widgets", "code-editor", "utils"]) {
    const src = path.join(repo, "packages", pkg, "src");
    for (const file of readdirSync(src, { recursive: true })) {
      if (typeof file !== "string" || !/\.tsx?$/.test(file)) continue;
      const text = readFileSync(path.join(src, file), "utf8");
      for (const m of text.matchAll(
        /export (?:declare )?(?:const|function|class|interface|type) ((?:use)?Hv\w+)/g,
      ))
        names.add(m[1]);
    }
  }
  return names;
}

describe("names the guidance cites", () => {
  it("are components and hooks the UI Kit has", () => {
    const known = declared();
    // what agents reach for and the lookup answers ("there's no HvWizard"); keys are lowercase
    const notComponents = new Set(Object.keys(NOT_COMPONENTS));
    const sources = [
      ...guides.map((file) => ({ file, text: read(file) })),
      ...Object.values(NOT_COMPONENTS).map((text) => ({
        file: "NOT_COMPONENTS",
        text,
      })),
      ...RULES.map((r) => ({ file: `uikit/${r.name}`, text: r.say })),
    ];
    const unknown = sources.flatMap(({ file, text }) =>
      [...text.matchAll(/\b(?:use)?Hv[A-Z]\w*/g)]
        .map((m) => m[0])
        .filter(
          (name) => !known.has(name) && !notComponents.has(name.toLowerCase()),
        )
        .map((name) => `${file}: ${name}`),
    );
    expect([...new Set(unknown)]).toEqual([]);
  });

  it("the lookup answers a name that isn't a component with a short pointer", () => {
    for (const text of Object.values(NOT_COMPONENTS)) {
      expect(text.length).toBeLessThanOrEqual(320);
      expect(text).toMatch(/uikit-tools info|summary\.md|: Hv\w+/);
    }
  });
});
