/**
 * HVUIKIT-7482 — mechanical off-system scorer.
 *
 * Counts, in generated code, the ways it departs from the design system. It has
 * to be mechanical: "baseline recorded and repeatable" is in the ticket, and an
 * eyeballed count is neither.
 *
 * Five categories, deliberately separated because they mean different things:
 *
 *   raw-color      a literal colour where a token exists
 *   raw-spacing    a hardcoded pixel value where a spacing token exists
 *   raw-element    a bare element where a component exists
 *   unsupported    a prop the component accepts by type but does not honour
 *   stale-api      v6 imports and removed props
 *
 * The last one matters most for interpreting a baseline. `stale-api` means the
 * agent has *wrong* context from training data; the others mean it has *no*
 * context. Only the second kind is what better context is supposed to fix, so
 * conflating them would overstate the benefit.
 *
 *   node scripts/spike/baseline/score.ts <file-or-dir>...
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

/** Bare elements that have a UI Kit equivalent. */
const ELEMENT_SUBSTITUTES: Record<string, string> = {
  button: "HvButton",
  input: "HvInput",
  select: "HvSelect",
  textarea: "HvTextArea",
  table: "HvTable",
  dialog: "HvDialog",
  progress: "HvProgressBar",
};

/** Props accepted by the type signature but not honoured. Extend from doc files. */
const UNSUPPORTED: Record<string, string[]> = {
  HvGrid: ["sx"],
};

/** Props and imports that were removed in v7. */
const STALE: {
  imports: RegExp;
  props: Record<string, string[]>;
  components: string[];
} = {
  imports: /^@hitachivantara\//,
  props: {
    HvGrid: ["item", "xs", "sm", "md", "lg", "xl", "zeroMinWidth"],
  },
  components: ["HvSimpleGrid", "HvOverflowTooltip"],
};

const COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
const PX = /\b\d{2,}px\b/;

/**
 * A literal inside `var(--token, fallback)` is the fallback for a token that is
 * already being used correctly. Flagging it would penalise the right thing.
 */
const isTokenFallback = (text: string) => /var\(\s*--[\w-]+\s*,/.test(text);

/**
 * Whether a string literal is a utility-class list rather than a CSS value.
 * `h-24px` in a className is a utility; `height: "24px"` in a style object is a
 * hardcoded value. Only the second is off-system.
 */
function isClassName(node: ts.Node): boolean {
  let n: ts.Node | undefined = node.parent;
  while (n) {
    if (
      ts.isJsxAttribute(n) &&
      /^(className|class)$/.test(n.name?.getText() ?? "")
    )
      return true;
    if (ts.isJsxAttribute(n) || ts.isPropertyAssignment(n)) break;
    n = n.parent;
  }
  return false;
}

const sourceFile = (file: string) =>
  ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

export interface Finding {
  category: string;
  file: string;
  line: number;
  detail: string;
}

export function scoreFile(file: string): Finding[] {
  const src = sourceFile(file);
  const findings: Finding[] = [];
  const at = (node: ts.Node) =>
    src.getLineAndCharacterOfPosition(node.getStart()).line + 1;
  const add = (category: string, node: ts.Node, detail: string) =>
    findings.push({ category, file, line: at(node), detail });

  const visit = (node: ts.Node): void => {
    // imports from the old scope
    if (ts.isImportDeclaration(node)) {
      const spec = node.moduleSpecifier.getText().replace(/['"]/g, "");
      if (STALE.imports.test(spec))
        add("stale-api", node, `import from ${spec}`);
    }

    // bare elements with a UI Kit equivalent
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText();
      if (ELEMENT_SUBSTITUTES[tag])
        add("raw-element", node, `<${tag}> — use ${ELEMENT_SUBSTITUTES[tag]}`);
      if (STALE.components.includes(tag))
        add("stale-api", node, `${tag} was removed in v7`);

      for (const attr of node.attributes.properties) {
        if (!ts.isJsxAttribute(attr) || !attr.name) continue;
        const prop = attr.name.getText();
        if (UNSUPPORTED[tag]?.includes(prop))
          add("unsupported", attr, `${tag} accepts \`${prop}\` but drops it`);
        if (STALE.props[tag]?.includes(prop))
          add("stale-api", attr, `${tag}.${prop} was removed in v7`);
      }
    }

    // literal colours and hardcoded spacing, in any string or template
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const utility = isClassName(node);
      if (COLOR.test(node.text) && !isTokenFallback(node.text) && !utility)
        add("raw-color", node, node.text.slice(0, 40));
      if (PX.test(node.text) && !utility)
        add("raw-spacing", node, node.text.slice(0, 40));
    }

    ts.forEachChild(node, visit);
  };
  visit(src);
  return findings;
}

const walk = (target: string): string[] => {
  const stat = fs.statSync(target);
  if (stat.isFile()) return /\.(tsx?|jsx?)$/.test(target) ? [target] : [];
  return fs
    .readdirSync(target)
    .filter((f) => f !== "node_modules" && !f.startsWith("."))
    .flatMap((f) => walk(path.join(target, f)));
};

export function score(targets: string[]) {
  const findings = targets.flatMap(walk).flatMap(scoreFile);
  const byCategory: Record<string, number> = {};
  for (const f of findings)
    byCategory[f.category] = (byCategory[f.category] ?? 0) + 1;
  return { findings, byCategory, total: findings.length };
}

const isEntrypoint =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntrypoint) {
  const targets = process.argv.slice(2);
  if (!targets.length) {
    console.error("usage: score.ts <file-or-dir>...");
    process.exitCode = 1;
  } else {
    const { findings, byCategory, total } = score(targets);
    for (const f of findings)
      console.info(
        `  ${f.category.padEnd(12)} ${f.file}:${f.line}  ${f.detail}`,
      );
    console.info(`\n  total off-system findings: ${total}`);
    for (const [c, n] of Object.entries(byCategory).toSorted())
      console.info(`    ${c.padEnd(12)} ${n}`);
  }
}
