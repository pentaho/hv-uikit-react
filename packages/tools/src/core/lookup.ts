/**
 * Lookups shared by the CLI and the MCP server. Each returns the exact text both print,
 * so an agent gets the same answer whichever way it asks.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { RULES as LINT_RULES } from "../lint/plugin.js";
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

/** Names agents reach for that aren't UI Kit core components, and a pointer to what to use instead. */
export const NOT_COMPONENTS: Record<string, string> = {
  hvkpi:
    "A KPI is a card, not a component: `uikit-tools info HvCard` (its KPI recipe).",
  hvlink:
    "A link is HvTypography with `link` on an `a` with `href` (`uikit-tools info HvTypography`); an action that looks like a link is an HvButton.",
  hvtogglebuttongroup:
    "Grouped options or a split button: HvMultiButton; a single on/off icon: HvToggleButton.",
  hvdropmenu: "A menu of actions: HvDropDownMenu.",
  usehvdata:
    "`useHvData` is `useHvTable`'s old name: `uikit-tools info useHvTable`.",
  hvwizard:
    "The UI Kit has no wizard: steps in order are one page with an HvSection per step and Back / Next (`uikit-tools info HvSection`).",
  hvbarchart:
    "Charts (HvBarChart, HvLineChart, HvDonutChart) are in @pentaho/uikit-react-viz, inside its HvVizProvider; props in its types (`data`, `groupBy`, `measures`, the donut's `measure`, `sortBy`, `stack`, `horizontal`, `height`). How: `node_modules/@pentaho/uikit-tools/skills/pentaho-plugin/summary.md`.",
  hvdashboard:
    "HvDashboard is in @pentaho/uikit-react-widgets, a work in progress: only when people should be able to rearrange or resize the panels themselves, each an HvSection; a laid-out dashboard is HvSection panels and HvCard figures in grid classes. How: `node_modules/@pentaho/uikit-tools/skills/pentaho-plugin/summary.md`.",
};
NOT_COMPONENTS.hvstepper = NOT_COMPONENTS.hvwizard;
NOT_COMPONENTS.hvlinechart = NOT_COMPONENTS.hvbarchart;
NOT_COMPONENTS.hvdonutchart = NOT_COMPONENTS.hvbarchart;
NOT_COMPONENTS.hvvizprovider = NOT_COMPONENTS.hvbarchart;

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

  const instead =
    NOT_COMPONENTS[
      wanted.startsWith("hv") || wanted.startsWith("use")
        ? wanted
        : `hv${wanted}`
    ];
  if (instead)
    throw new LookupError(`No UI Kit component named "${query}". ${instead}`);
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
      `- ${c.name}${hasGuidance(c) ? "" : " (no guidance)"}: ${firstSentence(c.purpose) || "no description"}`,
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
    "Run `uikit-tools info <Component>` (or several) for props and guidance.",
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

/** A long type (a callback's whole signature) cut short: the declaration file `info` names has it in full. */
const shortType = (type: string) =>
  type.length > 100 ? `${type.slice(0, 97).trimEnd()}…` : type;

/** A prop's description in `info`: its first sentence, the rest being in the types; none for a placeholder. */
const propText = (description?: string) => {
  const first = oneLine(description ?? "").split(/(?<=[.!?])\s+(?=[A-Z`])/)[0];
  return !first || /^Internal labels\??\.?$/i.test(first) ? "" : `: ${first}`;
};

/** `classes` in `info`: its JSDoc speaks of the old JSS overrides; it takes utility classes per part. */
const CLASSES_TEXT =
  ': utility classes per part (`classes={{ root: "gap-sm" }}`)';

function formatComponent(
  component: Component,
  spec = false,
  brief = false,
): string {
  const out: string[] = [
    `# ${component.name}`,
    "",
    "```tsx",
    `import { ${component.name} } from "${CORE}";`,
    "```",
    "",
  ];
  if (component.types) {
    out.push(
      `Types: \`node_modules/${CORE}/${component.types}\` (every prop and the types they use).`,
      "",
    );
  }
  if (component.purpose) out.push(component.purpose, "");
  if (component.note?.status && component.note.status !== "stable") {
    out.push(`Status: ${component.note.status}.`, "");
  }

  // The designers' note: when to use, spec, don'ts, as written.
  let specLeftOut = false;
  for (const s of component.note?.sections ?? []) {
    if (s.title === "Spec" && !spec) specLeftOut = Boolean(s.body);
    else if (s.body) out.push(`## ${s.title}`, "", s.body, "");
  }
  if (specLeftOut)
    out.push(
      `Its spec (sizes and tokens, for design reviews): \`uikit-tools info ${component.name} --spec\`.`,
      "",
    );
  if (component.note?.related.length) {
    out.push(`Related: ${component.note.related.join(", ")}.`, "");
  }
  if (component.note?.rules?.length) {
    out.push(`Checked by lint: ${component.note.rules.join(", ")}.`, "");
  }

  if (component.props?.length && brief) {
    const names = component.props.map((prop) => `\`${prop.name}\``);
    out.push(
      `Props: ${names.join(", ")} (types: \`uikit-tools info ${component.name}\`).`,
      "",
    );
  } else if (component.props?.length) {
    out.push("## Props", "");
    for (const p of component.props) {
      const details = [
        // a named type (HvSize) spelled out; a union already written out in full stays as it is
        p.allowedValues?.some((v) => !p.type.includes(`"${v}"`))
          ? `${p.type}: ${p.allowedValues.map((v) => `"${v}"`).join(" | ")}`
          : shortType(p.type),
        p.required ? "required" : undefined,
        p.defaultValue != null ? `default ${p.defaultValue}` : undefined,
      ]
        .filter(Boolean)
        .join(", ");
      const text =
        p.name === "classes" ? CLASSES_TEXT : propText(p.description);
      out.push(`- \`${p.name}\` (${details})${text}`);
    }
    out.push("");
  }

  // what the designers' note already says about a prop or variant isn't repeated from the JSDoc
  const noteText = (component.note?.sections ?? [])
    .map((s) => s.body)
    .join("\n");
  const unsaid = <T extends { name: string }>(entries: T[] | undefined) =>
    entries?.filter(
      (e) =>
        !noteText.includes(`\`${e.name}\``) &&
        !noteText.includes(`"${e.name}"`),
    );
  const section = (title: string, lines: string[] | undefined) => {
    if (lines?.length) out.push(`## ${title}`, "", ...lines, "");
  };
  section(
    "Variants",
    unsaid(component.variantSemantics)?.map(
      (v) =>
        `- "${v.name}"${v.semanticMeaning ? ` (${v.semanticMeaning})` : ""}: ${v.description}`,
    ),
  );
  section(
    "States",
    unsaid(component.stateRules)?.map(
      (s) => `- \`${s.name}\`: ${s.description}`,
    ),
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

/** A lint rule a finding cites, as lint prints it (`uikit(raw-elements)`) or configs name it (`uikit/raw-elements`). */
function formatLintRule(id: string): string | undefined {
  const name = id.match(/^uikit[/(]([\w-]+)\)?$/)?.[1];
  const rule = LINT_RULES.find((r) => r.name === name);
  if (!rule) return undefined;
  return [
    `# uikit/${rule.name}`,
    "",
    "A lint rule of `uikit-tools lint`.",
    "",
    rule.say,
    "",
    "Flagged:",
    "",
    "```tsx",
    rule.bad,
    "```",
  ].join("\n");
}

function formatRule(rules: RuleFile[], id: string): string {
  let wanted = id.trim().replace(/\.md$/, "").toLowerCase();
  // a finding's jsx-a11y(<name>): its rule is the accessibility one
  if (/^jsx-a11y[/(]/.test(wanted)) wanted = "accessibility/rules-of-aria";
  const file = rules.find((f) => f.id === wanted);
  if (file) return file.text.trim();
  const lintRule = formatLintRule(wanted);
  if (lintRule) return lintRule;

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
  /** `brief`: the props by name only, for a lookup of several components at once. */
  | { kind: "component"; name: string; spec?: boolean; brief?: boolean }
  | ({ kind: "components" } & Page)
  | { kind: "rules" }
  | { kind: "rule"; id: string }
  | { kind: "tokens"; query?: string };

/**
 * `export declare const|function <hook>…;` from the declaration files under `dir`, to the end of the statement
 * (brackets balanced); undefined when none declares it.
 */
export function hookDeclaration(
  dir: string,
  hook: string,
): { text: string; file: string } | undefined {
  let files: string[];
  try {
    files = readdirSync(dir, { recursive: true, encoding: "utf8" }).filter(
      (f) => f.endsWith(".d.ts"),
    );
  } catch {
    return undefined;
  }
  const start = new RegExp(
    `^export declare (?:const|function) ${hook}\\b`,
    "m",
  );
  for (const each of files) {
    const text = readFileSync(path.join(dir, each), "utf8");
    const at = text.search(start);
    if (at === -1) continue;
    let depth = 0;
    for (let i = at; i < text.length; i += 1) {
      const c = text[i];
      if ("{([<".includes(c)) depth += 1;
      else if ("})]>".includes(c) && text[i - 1] !== "=") depth -= 1;
      else if (c === ";" && depth <= 0)
        return {
          text: text.slice(at, i + 1),
          file: each.split(path.sep).join("/"),
        };
    }
  }
  return undefined;
}

/** Component lookups, answered from the installed UI Kit's metadata. */
export function lookup(
  metadata: Metadata,
  request: Extract<LookupRequest, { kind: "component" | "components" }>,
): string {
  switch (request.kind) {
    case "component": {
      const component = findComponent(metadata, request.name);
      const hook = request.name.trim();
      if (!/^use[A-Z]/.test(hook))
        return formatComponent(component, request.spec, request.brief);
      // a hook has no page of its own: say whose this is, and where its types are
      const types = component.types
        ? ` Its types: \`node_modules/${CORE}/${path.posix.dirname(component.types)}/\` (search for ${hook}).`
        : "";
      return `> \`${hook}\` is a hook, not a component: its guidance is ${component.name}'s, below.${types}\n\n${formatComponent(component, request.spec, request.brief)}`;
    }
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
    default: {
      const { metadata, file } = loadMetadata(options);
      const text = lookup(metadata, request);
      if (
        request.kind !== "component" ||
        !/^use[A-Z]/.test(request.name.trim())
      )
        return text;
      // a hook: its declaration from the installed types, so its signature needs no search
      const types = findComponent(metadata, request.name).types;
      const declaration =
        types &&
        hookDeclaration(
          path.join(path.dirname(path.dirname(file)), path.dirname(types)),
          request.name.trim(),
        );
      if (!declaration) return text;
      // the exact file: what the hook adds (a table instance's methods, its options) is declared beside it
      const rest = text.split("\n\n").slice(1);
      const where = `node_modules/${CORE}/${path.posix.dirname(types)}/${declaration.file}`;
      return [
        `> \`${request.name.trim()}\` is a hook, declared in \`${where}\` with what it adds; its guidance is below.`,
        `\`\`\`ts\n${declaration.text}\n\`\`\``,
        ...rest,
      ].join("\n\n");
    }
  }
}
