/**
 * Lookups shared by the CLI and the MCP server. Each returns the exact text both print,
 * so an agent gets the same answer whichever way it asks.
 */
import {
  CORE,
  loadMetadata,
  LookupError,
  type Component,
  type LoadOptions,
  type Metadata,
} from "./metadata.js";
import { loadRules, type RuleFile } from "./rules.js";
import { formatTokens, loadTokens } from "./tokens.js";

export { LookupError };

const firstSentence = (text: string) =>
  text
    .split("\n\n")[0]
    .replace(/\s*\n\s*/g, " ")
    .trim();

function distance(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
}

function suggest(query: string, names: string[]) {
  const q = query.toLowerCase().replace(/^hv/, "");
  return names
    .filter((name) => {
      const n = name.toLowerCase().replace(/^hv/, "");
      return n.includes(q) || q.includes(n) || distance(n, q) <= 2;
    })
    .slice(0, 8);
}

/**
 * A hook (`useHvTable`) is looked up as the component whose guidance names it: the one it's named after, else the one
 * that names it most.
 */
function hookOwner(metadata: Metadata, hook: string) {
  if (!/^use[A-Z]/.test(hook)) return undefined;
  const mentions = (c: Component) => JSON.stringify(c).split(hook).length - 1;
  const after = (c: Component) => Number(hook.slice(3).startsWith(c.name));
  return metadata.components
    .filter((c) => mentions(c) > 0)
    .toSorted((a, b) => after(b) - after(a) || mentions(b) - mentions(a))[0];
}

function findComponent(metadata: Metadata, query: string): Component {
  const wanted = query
    .trim()
    .replace(/^<|\/?>$/g, "")
    .toLowerCase();
  const component = metadata.components.find(
    (c) =>
      c.name.toLowerCase() === wanted || c.name.toLowerCase() === `hv${wanted}`,
  );
  if (component) return component;
  const owner = hookOwner(metadata, query.trim());
  if (owner) return owner;

  const close = suggest(
    wanted,
    metadata.components.map((c) => c.name),
  );
  throw new LookupError(
    `No UI Kit component named "${query}".` +
      (close.length > 0
        ? ` Did you mean: ${close.join(", ")}?`
        : " Run `uikit-tools components` for the list."),
  );
}

export interface Page {
  /** Most components to list; default all. */
  limit?: number;
  /** Components to skip; default 0. */
  offset?: number;
}

function formatComponentList(
  metadata: Metadata,
  { limit = Number.POSITIVE_INFINITY, offset = 0 }: Page = {},
): string {
  if (
    !(Number.isInteger(limit) || limit === Number.POSITIVE_INFINITY) ||
    !Number.isInteger(offset) ||
    limit < 0 ||
    offset < 0
  ) {
    throw new LookupError("limit and offset must be whole numbers, 0 or more.");
  }
  const total = metadata.components.length;
  const page = metadata.components.slice(offset, offset + limit);
  const lines = page.map(
    (c) =>
      `- ${c.name}${hasGuidance(c) ? " (guidance)" : ""}: ${firstSentence(c.purpose) || "no description"}`,
  );
  const shown =
    page.length === total
      ? `${total}`
      : page.length > 0
        ? `${offset + 1}-${offset + page.length} of ${total}`
        : `none of ${total}`;
  const next = offset + page.length;
  return [
    `# UI Kit components (${CORE}@${metadata.version}): ${shown}`,
    "",
    "Components marked (guidance) have design guidance. Run `uikit-tools info <Component>` for props and guidance.",
    "",
    ...lines,
    ...(next < total ? ["", `More: offset ${next}.`] : []),
  ].join("\n");
}

const hasGuidance = (c: Component) =>
  Boolean(
    c.note?.sections.length || c.variantSemantics || c.stateRules || c.a11y,
  );

const oneLine = (text: string) => text.replace(/\s*\n\s*/g, " ").trim();

function formatComponent(component: Component): string {
  const out: string[] = [
    `# ${component.name}`,
    "",
    "```tsx",
    `import { ${component.name} } from "${CORE}";`,
    "```",
    "",
  ];
  if (component.purpose) out.push(component.purpose, "");
  if (component.note?.status && component.note.status !== "stable") {
    out.push(`Status: ${component.note.status}.`, "");
  }

  // The designers' note: when to use, spec, don'ts, as written.
  for (const s of component.note?.sections ?? []) {
    if (s.body) out.push(`## ${s.title}`, "", s.body, "");
  }
  if (component.note?.related.length) {
    out.push(`Related: ${component.note.related.join(", ")}.`, "");
  }
  if (component.note?.rules?.length) {
    out.push(`Checked by lint: ${component.note.rules.join(", ")}.`, "");
  }

  if (component.props?.length) {
    out.push("## Props", "");
    for (const p of component.props) {
      const details = [
        p.type,
        p.required ? "required" : undefined,
        p.defaultValue != null ? `default ${p.defaultValue}` : undefined,
      ]
        .filter(Boolean)
        .join(", ");
      out.push(
        `- \`${p.name}\` (${details})${p.description ? `: ${oneLine(p.description)}` : ""}`,
      );
    }
    out.push("");
  }

  const section = (title: string, lines: string[] | undefined) => {
    if (lines?.length) out.push(`## ${title}`, "", ...lines, "");
  };
  section(
    "Variants",
    component.variantSemantics?.map((v) => `- "${v.name}": ${v.description}`),
  );
  section(
    "States",
    component.stateRules?.map((s) => `- \`${s.name}\`: ${s.description}`),
  );
  if (component.a11y) {
    section("Accessibility", [
      ...(component.a11y.role ? [`Role: ${component.a11y.role}`, ""] : []),
      ...component.a11y.requirements.map((r) => `- ${r}`),
    ]);
  }

  return out.join("\n").trimEnd();
}

const firstLine = (body: string) =>
  firstSentence(
    body
      .split("\n")
      .map((line) => line.replace(/^\s*[-*]\s+/, "").trim())
      .find((line) => line && !line.startsWith("```")) ?? "",
  ).replace(/(\.)\s.*$/, "$1");

function formatRuleList(rules: RuleFile[]): string {
  const out = [
    "# UI Kit design rules",
    "",
    "Run `uikit-tools rule <id>` for a rule, or `uikit-tools rule <file>` for a whole file.",
  ];
  for (const file of rules) {
    out.push("", `## ${file.id}: ${file.title}`, "");
    if (file.sections.length === 0) {
      out.push(`- ${file.id}: the whole file is one rule.`);
    }
    for (const section of file.sections) {
      const summary = firstLine(section.body);
      out.push(
        `- ${section.id}: ${section.title}${summary ? `. ${summary}` : ""}`,
      );
    }
  }
  return out.join("\n");
}

function formatRule(rules: RuleFile[], id: string): string {
  const wanted = id.trim().replace(/\.md$/, "").toLowerCase();
  const file = rules.find((f) => f.id === wanted);
  if (file) return file.text.trim();

  const section = rules
    .flatMap((f) => f.sections.map((s) => ({ file: f, section: s })))
    .find(({ section: s }) => s.id === wanted);
  if (section) {
    return [
      `# ${section.section.title}`,
      "",
      `Rule \`${section.section.id}\` from ${section.file.title} (${section.file.file}).`,
      "",
      section.section.body,
    ].join("\n");
  }

  const ids = rules.flatMap((f) => [f.id, ...f.sections.map((s) => s.id)]);
  const close = ids.filter((i) => i.includes(wanted) || wanted.includes(i));
  throw new LookupError(
    `No rule "${id}".` +
      (close.length > 0
        ? ` Did you mean: ${close.slice(0, 8).join(", ")}?`
        : " Run `uikit-tools rules` for the list."),
  );
}

export type LookupRequest =
  | { kind: "component"; name: string }
  | ({ kind: "components" } & Page)
  | { kind: "rules" }
  | { kind: "rule"; id: string }
  | { kind: "tokens"; query?: string };

/** Component lookups, answered from the installed UI Kit's metadata. */
export function lookup(
  metadata: Metadata,
  request: Extract<LookupRequest, { kind: "component" | "components" }>,
): string {
  switch (request.kind) {
    case "component":
      return formatComponent(findComponent(metadata, request.name));
    case "components":
      return formatComponentList(metadata, request);
  }
}

/**
 * The single entry point the CLI and MCP both call. Component and token lookups read the
 * installed UI Kit; rule lookups read the rules shipped with these tools.
 */
export function answer(
  request: LookupRequest,
  options: LoadOptions & { tokensPath?: string } = {},
): string {
  switch (request.kind) {
    case "tokens":
      return formatTokens(loadTokens(options), request.query);
    case "rules":
      return formatRuleList(loadRules());
    case "rule":
      return formatRule(loadRules(), request.id);
    default:
      return lookup(loadMetadata(options).metadata, request);
  }
}
