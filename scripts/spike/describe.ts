/**
 * HVUIKIT-7481 spike — build a machine-readable description of a component
 * from sources that already exist in the repo:
 *   props   <- react-docgen-typescript on <C>.tsx
 *   classes <- createClasses(...) in <C>.styles.ts  (TS AST)
 *   tokens  <- theme.* references in <C>.styles.ts
 *   examples<- exported stories in <C>.stories.tsx  (TS AST)
 *   usage   <- apps/docs/src/content/components/<c>.mdx
 */
import fs from "node:fs";
import path from "node:path";
import rdt from "react-docgen-typescript";
import ts from "typescript";

import type { HvComponentDoc } from "../../packages/core/src/types/doc.ts";

const CORE = "packages/core/src";
const DOCS = "apps/docs/src/content/components";

const parser = rdt.withCustomConfig("./tsconfig.json", {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (p) => !p.parent || !/node_modules/.test(p.parent.fileName),
});

const sf = (file: string) =>
  ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

/** class keys + their JSDoc, from createClasses("Name", { key: {...} }) */
export interface DocClass {
  name: string;
  description: string | null;
}

function extractClasses(file: string): DocClass[] {
  if (!fs.existsSync(file)) return [];
  const src = sf(file);
  const out: DocClass[] = [];
  const visit = (n: ts.Node): void => {
    if (ts.isCallExpression(n) && n.expression.getText() === "createClasses") {
      const obj = n.arguments[1];
      if (obj && ts.isObjectLiteralExpression(obj)) {
        for (const p of obj.properties) {
          if (!p.name) continue;
          const full = p.getFullText();
          const doc = full
            .match(/\/\*\*\s*(.*?)\s*\*\//s)?.[1]
            ?.replace(/\s*\n\s*\*\s?/g, " ")
            .trim();
          out.push({
            name: p.name.getText().replace(/['"]/g, ""),
            description: doc ?? null,
          });
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(src);
  return out;
}

/** design tokens referenced, e.g. theme.colors.bgHover */
function extractTokens(file: string): string[] {
  if (!fs.existsSync(file)) return [];
  const txt = fs.readFileSync(file, "utf8");
  return [
    ...new Set(
      [...txt.matchAll(/\btheme\.((?:[a-zA-Z0-9_]+\.)*[a-zA-Z0-9_]+)/g)].map(
        (m) => m[1],
      ),
    ),
  ].toSorted();
}

/** exported stories: name + args keys */
export interface DocExample {
  name: string;
  args: string[];
}

function extractExamples(file: string): {
  importFrom: string | null;
  examples: DocExample[];
} {
  if (!fs.existsSync(file)) return { importFrom: null, examples: [] };
  const src = sf(file);
  let importFrom: string | null = null;
  const examples: DocExample[] = [];
  const visit = (n: ts.Node): void => {
    if (ts.isImportDeclaration(n)) {
      const spec = n.moduleSpecifier.getText().replace(/['"]/g, "");
      if (spec.startsWith("@pentaho/uikit-react-core")) importFrom = spec;
    }
    if (
      ts.isVariableStatement(n) &&
      n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const d of n.declarationList.declarations) {
        const init = d.initializer;
        if (!init || !ts.isObjectLiteralExpression(init)) continue;
        const argsProp = init.properties.find(
          (p) => p.name?.getText() === "args",
        );
        const args =
          argsProp &&
          ts.isPropertyAssignment(argsProp) &&
          ts.isObjectLiteralExpression(argsProp.initializer)
            ? argsProp.initializer.properties
                .map((p) => p.name?.getText())
                .filter((n) => n !== undefined)
            : [];
        examples.push({ name: d.name.getText(), args });
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(src);
  return { importFrom, examples };
}

/**
 * Read the colocated `<Component>.doc.ts` guidance file.
 *
 * The file is TypeScript, so it is transpiled in memory and imported as a data
 * URL. No temp files, no build step, and the schema stays enforced by `tsc`
 * during CI rather than by anything here.
 */
async function loadDoc(
  dir: string,
  component: string,
): Promise<{ file: string | null; doc: HvComponentDoc | null }> {
  const file = path.join(dir, `${component}.doc.ts`);
  if (!fs.existsSync(file)) return { file: null, doc: null };
  const src = fs.readFileSync(file, "utf8");
  // the only import is the type-only schema, which erases to nothing
  const js = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
    },
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`;
  try {
    const mod = await import(url);
    return { file, doc: mod.docs ?? null };
  } catch {
    return { file, doc: null };
  }
}

/** prose usage guidance from the docs page */
function extractUsage(name: string) {
  const slug = name
    .replace(/^Hv/, "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
  const file = path.join(DOCS, `${slug}.mdx`);
  if (!fs.existsSync(file))
    return { file: null, hasFrontmatter: false, text: null };
  const txt = fs.readFileSync(file, "utf8");
  return {
    file,
    text: txt
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("import ") && !l.startsWith("<"))
      .slice(0, 6)
      .join("\n"),
  };
}

const resolveStyles = (dir: string, c: string): string =>
  [".ts", ".tsx"]
    .map((e) => path.join(dir, `${c}.styles${e}`))
    .find(fs.existsSync) ?? "";

export async function describe(component: string) {
  const dir = path.join(CORE, component);
  const stylesFile = resolveStyles(dir, component);
  const tsx = path.join(dir, `${component}.tsx`);
  if (!fs.existsSync(tsx)) throw new Error(`no such component: ${tsx}`);

  const t0 = Date.now();
  const doc = parser.parse([tsx])[0];
  const classes = extractClasses(stylesFile);
  const tokens = extractTokens(stylesFile);
  const { importFrom, examples } = extractExamples(
    path.join(dir, `${component}.stories.tsx`),
  );
  const usage = extractUsage(doc?.displayName ?? component);
  const { file: docFile, doc: guidance } = await loadDoc(dir, component);

  return {
    name: doc?.displayName ?? component,
    importFrom,
    description: doc?.description || null,
    props: Object.entries(doc?.props ?? {}).map(([n, p]: [string, any]) => ({
      name: n,
      type: p.type?.name ?? null,
      required: p.required ?? false,
      defaultValue: p.defaultValue?.value ?? null,
      description: p.description || null,
    })),
    classes,
    tokens,
    examples,
    usage,
    docFile,
    guidance,
    _ms: Date.now() - t0,
  };
}
