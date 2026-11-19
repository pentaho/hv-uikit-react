// A documentation page is the designers' template (content/page-template.json) filled with one page's content
// (content/pages/*.json). In the template, "{{key}}" stands for a value, { "slot": key } for a list of layers, "if"
// keeps a layer only when its key has a value, and "each" repeats a layer per item, as {{item}}.
import type { DocPage } from "./types.ts";

export type Values = Record<string, unknown>;
type Directive = { slot?: string; if?: string; each?: string };

const present = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : v !== undefined;

function valueOf(key: string, values: Values) {
  if (values[key] === undefined)
    throw new Error(`The page has no value for {{${key}}}.`);
  return values[key];
}

function fill(s: string, values: Values): unknown {
  const whole = /^\{\{(\w+)\}\}$/.exec(s);
  return whole
    ? valueOf(whole[1], values)
    : s.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(valueOf(k, values)));
}

function object(node: object, values: Values) {
  return Object.fromEntries(
    Object.entries(node).map(([k, v]) => [k, one(v, values)]),
  );
}

function many(node: unknown, values: Values): unknown[] {
  if (!node || typeof node !== "object" || Array.isArray(node))
    return [one(node, values)];

  const { slot, if: when, each, ...rest } = node as Directive;
  if (slot) return (values[slot] as unknown[] | undefined) ?? [];
  if (when && !present(values[when])) return [];
  if (!each) return [object(rest, values)];
  return (values[each] as string[]).map((item) =>
    object(rest, { ...values, item }),
  );
}

function one(node: unknown, values: Values): unknown {
  if (typeof node === "string") return fill(node, values);
  if (Array.isArray(node)) return node.flatMap((n) => many(n, values));
  return node && typeof node === "object" ? object(node, values) : node;
}

/** The page: the template filled with its content (Light's layers serve Dark too unless it has its own). */
export function expand(template: unknown, content: Values): DocPage {
  const {
    name,
    components,
    when = [],
    dont = [],
    sections = [],
    modes = "HORIZONTAL",
    overviewTitle = "Overview",
  } = content;
  const usage = [when, dont].some(present) ? true : undefined;
  const dark = content.dark ?? content.light;
  const values = {
    ...content,
    when,
    dont,
    sections,
    modes,
    dark,
    usage,
    overviewTitle,
  };

  return { name, page: many(template, values)[0], components } as DocPage;
}

/** The library components `x` (pages, a page, a layer) names, each once. */
export function componentsIn(x: unknown): string[] {
  const found = new Set<string>();
  (function walk(n: unknown) {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== "object") return;
    const { component } = n as { component?: unknown };
    if (typeof component === "string") found.add(component);
    Object.values(n).forEach(walk);
  })(x);
  return [...found];
}
