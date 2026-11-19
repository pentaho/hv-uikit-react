// What a sync would do to a Figma file's variables, from the bundle (the code), the variables as Figma has them, and
// what the last sync wrote to each (its baseline, kept on the variable). Pure, so it's tested without Figma; the
// plugin (apply.ts) reads Figma, calls it and applies the result.
//   create      the code has it, Figma doesn't
//   update      Figma still has what the last sync wrote, the code moved on: written
//   unchanged   Figma has what the code has
//   figma-edit  someone changed it in Figma, the code didn't move: kept, and reported as a proposal for the code
//   conflict    both changed, or never synced and a value differs: nothing is written, a person decides
// A variable is matched by what the last sync wrote to it, else by its collection and name: an existing variable of
// the same name is adopted: unchanged when it already has the code's values, updated when only its description, scopes
// or code syntax differ (the code owns those), else a conflict. Applying writes creates
// and updates in full, and an unchanged variable's baseline only when it is missing or out of date (writesOf), so a
// second apply writes nothing. A variable Figma has and the code doesn't is reported, never deleted.
import type { Bundle, FigmaVariable, Value } from "../sync/types.ts";

/** A variable's fields as text, the same for the code and for Figma: one per mode, its description, scopes and code
 *  syntax. Every field the sync writes is one it compares, so a Figma edit to any of them is kept, not overwritten. */
export type Fields = Record<string, string>;
export interface Current {
  id: string;
  collection: string;
  name: string;
  fields: Fields;
  baseline?: { path: string; fields: Fields }; // what the last sync wrote
}
type Action = "create" | "update" | "unchanged" | "figma-edit" | "conflict";
export interface Change {
  path: string;
  action: Action;
  id?: string;
  fields: { field: string; code: string; figma?: string }[]; // the fields that differ
  rebase?: true; // unchanged, but what the last sync wrote is missing or out of date
}

/** A number to 3 decimals: what Figma keeps, so values compare equal. */
export const round = (n: number) => Math.round(n * 1000) / 1000;
/** A color channel as its 8-bit value: Figma keeps channels as 32-bit floats, so decimals can round either way. */
const channel = (n: number) => Math.round(n * 255);

/** A value as text: `alias:blue/600`, `rgba(37,99,235,1)` (alpha to 3 decimals) or the value itself. */
export function valueText(v: Value): string {
  if ("alias" in v) return `alias:${v.alias}`;
  if ("color" in v) {
    const [r, g, b, a] = v.color;
    return `rgba(${[r, g, b].map(channel).join(",")},${round(a)})`;
  }
  return String(v.value);
}

const ENTITIES: Record<string, string> = {
  "&quot;": '"',
  "&#39;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
};
/** A description as written: Figma gives it back with HTML entities for quotes and brackets. */
export const descriptionText = (text: string) =>
  text.replaceAll(/&(?:quot|#39|lt|gt|amp);/g, (e) => ENTITIES[e]);

/** Scopes as text, in a fixed order: Figma may list them in another. */
export const scopesText = (scopes: readonly string[]) =>
  [...scopes].toSorted().join(",");

export const fieldsOf = (v: FigmaVariable): Fields => ({
  ...Object.fromEntries(
    Object.entries(v.values).map(([mode, value]) => [mode, valueText(value)]),
  ),
  description: v.description ?? "",
  scopes: scopesText(v.scopes),
  code: v.code ?? "",
});

/** The fields that describe a variable rather than give its value. */
const META = new Set(["description", "scopes", "code"]);

/** One field's action: the code against Figma, with what the last sync wrote. */
function fieldAction(
  field: string,
  code: string,
  figma: string | undefined,
  base: string | undefined,
): Action {
  if (figma === code) return "unchanged";
  // never synced: the code owns its notes, scopes and code syntax; whose value it is, only a person knows
  if (base === undefined) return META.has(field) ? "update" : "conflict";
  if (figma === base) return "update"; // untouched in Figma since the last sync
  return code === base ? "figma-edit" : "conflict";
}

const RANK: Action[] = ["unchanged", "update", "figma-edit", "conflict"];

function change(v: FigmaVariable, current: Current | undefined): Change {
  if (!current) return { path: v.path, action: "create", fields: [] };

  const code = fieldsOf(v);
  const differ = Object.keys(code).filter((f) => current.fields[f] !== code[f]);
  const actions = differ.map((f) =>
    fieldAction(f, code[f], current.fields[f], current.baseline?.fields[f]),
  );
  const action = actions.reduce<Action>(
    (worst, a) => (RANK.indexOf(a) > RANK.indexOf(worst) ? a : worst),
    "unchanged",
  );
  const base = current.baseline;
  const stale =
    !base ||
    base.path !== v.path ||
    Object.keys(code).some((f) => base.fields[f] !== code[f]);
  return {
    path: v.path,
    action,
    id: current.id,
    ...(action === "unchanged" && stale && { rebase: true as const }),
    fields: differ.map((f) => ({
      field: f,
      code: code[f],
      figma: current.fields[f],
    })),
  };
}

/** The changes for every variable in the bundle, and Figma's variables the code doesn't have. */
export function planSync(bundle: Bundle, current: Current[]) {
  const byPath = new Map(
    current.flatMap((c) => (c.baseline ? [[c.baseline.path, c]] : [])),
  );
  const byName = new Map(current.map((c) => [`${c.collection}/${c.name}`, c]));
  const { variables } = bundle;

  const changes = variables.map((v) =>
    change(v, byPath.get(v.path) ?? byName.get(`${v.collection}/${v.name}`)),
  );
  const matched = new Set(changes.map((c) => c.id));

  const collections = new Set(variables.map((v) => v.collection));
  const notInCode = current
    .filter((c) => collections.has(c.collection) && !matched.has(c.id))
    .map((c) => `${c.collection}/${c.name}`);
  return { changes, notInCode };
}

/** What applying a plan writes: each variable to create or update, in full; an unchanged one, only its baseline, and
 *  only when that is missing or out of date. Figma edits and conflicts are never written. */
export function writesOf(changes: Change[]) {
  return {
    full: changes.filter((c) => c.action === "create" || c.action === "update"),
    baseline: changes.filter((c) => c.action === "unchanged" && c.rebase),
  };
}
