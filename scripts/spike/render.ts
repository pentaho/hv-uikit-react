/** HVUIKIT-7481 spike — render a component description as agent-facing markdown. */

import { describe } from "./describe.ts";

type Described = Awaited<ReturnType<typeof describe>>;
type Prop = Described["props"][number];

/** Props inherited from MUI/DOM that we should not advertise as UI Kit API. */
const NOISE = /^(aria-|data-|on[A-Z]|sx$|component$|ref$|key$|style$)/;

/**
 * MUI system props. Components wrapping MUI (e.g. HvGrid) resolve the whole
 * system surface with no parent info, so they pass the node_modules filter.
 * FINDING (HVUIKIT-7481): type-based extraction cannot separate these from the
 * real API -- MUI-wrapping components need curation, not just extraction.
 */
const MUI_SYSTEM = new Set(
  (
    "alignContent alignItems alignSelf bottom boxShadow boxSizing color columnGap direction display flex " +
    "flexBasis flexDirection flexGrow flexShrink flexWrap fontFamily fontSize fontStyle fontWeight gap grid " +
    "gridArea gridAutoColumns gridAutoFlow gridAutoRows gridColumn gridRow gridTemplateAreas gridTemplateColumns " +
    "gridTemplateRows height justifyContent justifyItems justifySelf left letterSpacing lineHeight m margin " +
    "marginBottom marginLeft marginRight marginTop mb ml mr mt mx my order overflow p padding paddingBottom " +
    "paddingLeft paddingRight paddingTop pb pl position pr pt px py right rowGap textAlign top typography " +
    "visibility whiteSpace width zIndex bgcolor border borderBottom borderColor borderLeft borderRadius " +
    "borderRight borderTop boxSizing maxHeight maxWidth minHeight minWidth"
  ).split(/\s+/),
);

/**
 * The advertised prop surface.
 *
 * `doc.props.only` wins when present — extraction cannot infer the real API for
 * components that inherit an upstream type. Otherwise fall back to filtering the
 * obvious noise.
 */
function ownProps(d: Described): Prop[] {
  const rule = d.guidance?.props;
  if (rule?.only) {
    const keep = new Set(rule.only);
    return d.props.filter((p: Prop) => keep.has(p.name));
  }
  const hide = new Set(rule?.hide ?? []);
  return d.props.filter(
    (p: Prop) =>
      !hide.has(p.name) && !NOISE.test(p.name) && !MUI_SYSTEM.has(p.name),
  );
}

export async function render(
  component: string,
  { dense = false }: { dense?: boolean } = {},
) {
  const d = await describe(component);
  const own = ownProps(d);
  const curated = Boolean(d.guidance?.props?.only);
  const wrapsMui = !curated && d.props.length - own.length > 30;
  const dropped = d.props.length - own.length;

  const L = [];
  L.push(`# ${d.name}`, "");
  if (d.description) L.push(d.description, "");
  if (d.importFrom)
    L.push("```tsx", `import { ${d.name} } from "${d.importFrom}";`, "```", "");

  L.push("## Props", "");
  L.push(
    "| Prop | Type | Required | Description |",
    "| --- | --- | --- | --- |",
  );
  for (const p of own)
    L.push(
      `| \`${p.name}\` | \`${(p.type ?? "").replace(/\|/g, "\\|").slice(0, 60)}\` | ${p.required ? "yes" : "no"} | ${(p.description ?? "").split("\n")[0]} |`,
    );
  if (dropped) L.push("", `_${dropped} inherited DOM/MUI props omitted._`);
  if (wrapsMui)
    L.push(
      "",
      "> **Needs curation.** This component wraps MUI and resolves its full system prop surface.",
      "> Extraction alone cannot tell which of those the UI Kit actually supports.",
    );

  if (d.classes.length) {
    L.push("", "## Style classes", "");
    for (const c of d.classes)
      L.push(`- \`${c.name}\`${c.description ? ` — ${c.description}` : ""}`);
  }
  if (d.tokens.length) {
    L.push(
      "",
      "## Design tokens used",
      "",
      d.tokens.map((t) => `\`theme.${t}\``).join(", "),
    );
  }
  if (d.examples.length) {
    L.push("", "## Examples (Storybook)", "");
    for (const e of d.examples)
      L.push(
        `- **${e.name}**${e.args.length ? ` — args: ${e.args.map((a) => `\`${a}\``).join(", ")}` : ""}`,
      );
  }
  const g = d.guidance;
  if (g?.usage?.bestPractices?.length) {
    L.push("", "## Best practices", "");
    for (const b of g.usage.bestPractices)
      L.push(`- ${b.guidance ? "**Do:**" : "**Don't:**"} ${b.description}`);
  }
  if (g?.usage?.accessibility?.length) {
    L.push("", "## Accessibility", "");
    for (const a of g.usage.accessibility)
      L.push(`- ${a.criterion ? `**${a.criterion}** — ` : ""}${a.description}`);
  }
  if (g?.usage?.anatomy?.length) {
    L.push("", "## Anatomy", "");
    for (const a of g.usage.anatomy)
      L.push(
        `- \`${a.name}\`${a.required ? " (required)" : ""} — ${a.description}`,
      );
  }
  const live = (g?.decisions ?? []).filter((x) => x.status !== "archived");
  if (live.length) {
    L.push("", "## Decisions", "");
    for (const dec of live)
      L.push(
        `- ${dec.change}${dec.since ? ` _(${dec.since})_` : ""}` +
          (dec.rationale ? `\n  - why: ${dec.rationale}` : "") +
          (dec.migrate ? `\n  - migrate: \`${dec.migrate}\`` : ""),
      );
  }
  L.push("", "## Source", "");
  L.push(
    [
      d.docFile && `guidance: \`${d.docFile}\``,
      d.usage.file && `docs: \`${d.usage.file}\``,
    ]
      .filter(Boolean)
      .join("  ·  ") || "_No doc file._",
  );

  const md = dense ? denseify(L.join("\n"), d) : L.join("\n");
  return {
    md,
    stats: {
      own: own.length,
      dropped,
      classes: d.classes.length,
      tokens: d.tokens.length,
      examples: d.examples.length,
    },
  };
}

/**
 * Shorten a type for the dense view without truncating mid-token.
 *
 * A silently-cut type reads as a complete one — `Partial<{ root: string;` looks
 * like a real signature. Mark the cut so it cannot be mistaken for the whole type.
 */
function shortType(type: string | null): string {
  const t = type ?? "?";
  if (t.length <= 24) return t;
  return `${t.slice(0, 23).trimEnd()}…`;
}

/** Token-efficient variant: identity, props table, best practices, decisions. */
function denseify(_md: string, d: Described): string {
  const g = d.guidance;
  const L = [`# ${d.name}`];
  if (d.importFrom) L.push(`import { ${d.name} } from "${d.importFrom}";`);
  if (g?.usage?.description) L.push(g.usage.description);
  const own = ownProps(d);
  L.push(
    "props: " +
      own
        .map((p) => `${p.name}${p.required ? "!" : ""}:${shortType(p.type)}`)
        .join(", "),
  );
  for (const b of g?.usage?.bestPractices ?? [])
    L.push(`${b.guidance ? "do" : "dont"}: ${b.description}`);
  // accessibility obligations are never dropped for token savings
  for (const a of g?.usage?.accessibility ?? [])
    L.push(`a11y${a.criterion ? ` ${a.criterion}` : ""}: ${a.description}`);
  for (const dec of (g?.decisions ?? []).filter((x) => x.status !== "archived"))
    L.push(
      `changed${dec.since ? ` ${dec.since}` : ""}: ${dec.change}${dec.migrate ? ` -> ${dec.migrate}` : ""}`,
    );
  return L.join("\n");
}
