// The agent scripts' data, compact: an agent copies each script into a Figma MCP call as it is, and a short script with
// little repetition is one it copies faithfully. The library is a table of tuples (colors as hex, aliases and values
// by mode, shared descriptions and scopes); a page is a string table over its JSON. Both unpack to what the core takes.
import type { Bundle, FigmaVariable, TextStyle, Value } from "../sync/types.ts";

const TYPES = ["COLOR", "FLOAT", "STRING"] as const;
const CODE = /^var\(--uikit-(.+)\)$/;

/** A channel 0..1 as two hex digits, and back. */
const hex = (n: number) =>
  Math.round(n * 255)
    .toString(16)
    .padStart(2, "0");
const unhex = (s: string, i: number) =>
  Math.round((Number.parseInt(s.slice(i, i + 2), 16) / 255) * 1e4) / 1e4;

/** A value: `@name` an alias, `#rrggbbaa` a color, `=text` a string, a number as it is. */
type PackedValue = string | number;
function packValue(v: Value): PackedValue {
  if ("alias" in v) return `@${v.alias}`;
  if ("color" in v) return `#${v.color.map(hex).join("")}`;
  return typeof v.value === "number" ? v.value : `=${v.value}`;
}
function unpackValue(p: PackedValue): Value {
  if (typeof p === "number") return { value: p };
  if (p[0] === "@") return { alias: p.slice(1) };
  if (p[0] === "#")
    return {
      color: [1, 3, 5, 7].map((i) => unhex(p, i)) as [
        number,
        number,
        number,
        number,
      ],
    };
  return { value: p.slice(1) };
}

/** [collection, name, type, values by mode, scopes, code (without var(--uikit-…)), description]: indexes into the tables. */
type Row = [
  number,
  string,
  number,
  PackedValue[],
  number,
  string | null,
  number,
];
/** The palette (the Primitives collection) when every color is `<family>/<step>`, opaque, unscoped and alike in all
 * else: each family's colors as one hex string, six digits per step. */
interface Palette {
  collection: number;
  steps: string[];
  description: number;
  families: Record<string, string>;
}
export interface PackedLibrary {
  collections: Bundle["collections"];
  palette?: Palette;
  scopes: string[];
  descriptions: string[];
  variables: Row[];
  textStyles: TextStyle[];
}

export function packLibrary(bundle: Bundle): PackedLibrary {
  const scopes: string[] = [];
  const descriptions: string[] = [];
  const at = (list: string[], s: string) => {
    const i = list.indexOf(s);
    return i === -1 ? list.push(s) - 1 : i;
  };
  const primitives = bundle.variables.filter(
    (v) => v.collection === "Primitives",
  );
  const steps = [...new Set(primitives.map((v) => v.name.split("/")[1]))];
  const families: Record<string, string> = {};
  for (const v of primitives) {
    const [family] = v.name.split("/");
    const color = "color" in v.values.Value ? v.values.Value.color : undefined;
    families[family] =
      (families[family] ?? "") +
      (color ? color.slice(0, 3).map(hex).join("") : "");
  }
  const palette: Palette | undefined =
    primitives.length &&
    primitives.every(
      (v) =>
        /^[a-z]+\/\w+$/.test(v.name) &&
        "color" in v.values.Value &&
        v.values.Value.color[3] === 1 &&
        !v.scopes.length &&
        !v.code &&
        v.description === primitives[0].description,
    ) &&
    Object.values(families).every((h) => h.length === steps.length * 6) &&
    primitives.every((v, i) => v.name.split("/")[1] === steps[i % steps.length])
      ? {
          collection: bundle.collections.findIndex(
            (c) => c.name === "Primitives",
          ),
          steps,
          description: at(descriptions, primitives[0].description ?? ""),
          families,
        }
      : undefined;
  const rows = palette
    ? bundle.variables.filter((v) => v.collection !== "Primitives")
    : bundle.variables;
  const variables = rows.map((v): Row => {
    const ci = bundle.collections.findIndex((c) => c.name === v.collection);
    const code = v.code ? CODE.exec(v.code)?.[1] : null;
    if (code === undefined)
      throw new Error(`${v.name}: code ${v.code} isn't var(--uikit-…)`);
    return [
      ci,
      v.name,
      TYPES.indexOf(v.type),
      bundle.collections[ci].modes.map((m) => packValue(v.values[m])),
      at(scopes, v.scopes.join(",")),
      code,
      at(descriptions, v.description ?? ""),
    ];
  });
  return {
    collections: bundle.collections,
    ...(palette && { palette }),
    scopes,
    descriptions,
    variables,
    textStyles: bundle.textStyles,
  };
}

export function unpackLibrary(p: PackedLibrary): Bundle {
  const palette = p.palette;
  const primitives: FigmaVariable[] = palette
    ? Object.entries(palette.families).flatMap(([family, colors]) =>
        palette.steps.map((step, i) => ({
          path: "",
          collection: p.collections[palette.collection].name,
          name: `${family}/${step}`,
          type: "COLOR" as const,
          values: {
            Value: unpackValue(`#${colors.slice(i * 6, i * 6 + 6)}ff`),
          },
          scopes: [],
          description: p.descriptions[palette.description],
        })),
      )
    : [];
  return {
    version: 1,
    collections: p.collections,
    textStyles: p.textStyles,
    variables: [
      ...primitives,
      ...p.variables.map(
        ([ci, name, type, values, si, code, di]): FigmaVariable => {
          const collection = p.collections[ci];
          return {
            path: "",
            collection: collection.name,
            name,
            type: TYPES[type],
            values: Object.fromEntries(
              collection.modes.map((m, i) => [m, unpackValue(values[i])]),
            ),
            scopes: p.scopes[si] ? p.scopes[si].split(",") : [],
            ...(code !== null && { code: `var(--uikit-${code})` }),
            ...(p.descriptions[di] && { description: p.descriptions[di] }),
          };
        },
      ),
    ],
  };
}

/** Any JSON with each string (or key) seen twice or more, 6+ characters, as `~<index>`; a string starting with ~ gets
 * another. Lossless. */
export function pack(value: unknown): [string[], unknown] {
  const count = new Map<string, number>();
  const seen = (s: string) => {
    if (s.length >= 6) count.set(s, (count.get(s) ?? 0) + 1);
  };
  const walk = (x: unknown): void => {
    if (typeof x === "string") seen(x);
    else if (Array.isArray(x)) x.forEach(walk);
    else if (x && typeof x === "object")
      for (const [k, v] of Object.entries(x)) {
        seen(k);
        walk(v);
      }
  };
  walk(value);
  const table = [...count].filter(([, n]) => n > 1).map(([s]) => s);
  const index = new Map(table.map((s, i) => [s, i]));
  const ref = (s: string) =>
    index.has(s)
      ? `~${index.get(s)!.toString(36)}`
      : s.startsWith("~")
        ? `~${s}`
        : s;
  const rep = (x: unknown): unknown =>
    typeof x === "string"
      ? ref(x)
      : Array.isArray(x)
        ? x.map(rep)
        : x && typeof x === "object"
          ? Object.fromEntries(
              Object.entries(x).map(([k, v]) => [ref(k), rep(v)]),
            )
          : x;
  return [table, rep(value)];
}

export function unpack([table, value]: [string[], unknown]): unknown {
  const deref = (s: string) =>
    s.startsWith("~~")
      ? s.slice(1)
      : s.startsWith("~")
        ? table[Number.parseInt(s.slice(1), 36)]
        : s;
  const rep = (x: unknown): unknown =>
    typeof x === "string"
      ? deref(x)
      : Array.isArray(x)
        ? x.map(rep)
        : x && typeof x === "object"
          ? Object.fromEntries(
              Object.entries(x).map(([k, v]) => [deref(k), rep(v)]),
            )
          : x;
  return rep(value);
}
