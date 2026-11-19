// What a Figma component's properties become in code, as overrides.json writes it for the components rules
// can't map (rules.ts maps the rest): a property maps to props per value (`values`), to a text or a swapped instance
// read into a named value, gates named values (`shows`), picks the snippet (`examples`), or is drawn in Figma only,
// with the reason. `mappingProblems` is the coverage check: every property and every value mapped, nothing stale.
import { z } from "zod";

import type { LibraryComponent } from "./library.ts";

const Props = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
);
// a snippet, or its lines
const Lines = z.union([z.string(), z.array(z.string())]);
// a number read from a text: its last integer ("0 / 200" → 200), or that minus one (a page shown 1-based)
const As = z.enum(["number", "index"]).optional();

const FigmaOnly = z.strictObject({ figmaOnly: z.string().min(1) });
const Text = z.strictObject({ text: z.string(), as: As });
const Instance = z.strictObject({ instance: z.string() });
const Choice = z.strictObject({
  values: z.record(z.string(), Props).optional(),
  shows: z.record(z.string(), z.array(z.string())).optional(),
  examples: z.record(z.string(), Lines).optional(),
});
const PropertyMap = z.union([FigmaOnly, Text, Instance, Choice]);

const Find = {
  path: z.array(z.string()).optional(),
  nth: z.number().int().min(0).optional(),
};
const Layer = z.union([
  z.strictObject({ instance: z.string(), ...Find }),
  z.strictObject({ text: z.string(), as: As, ...Find }),
  z.strictObject({ code: Lines }),
]);

export const Mapping = z.strictObject({
  element: z.string().optional(),
  fixed: Props.optional(),
  properties: z.record(z.string(), PropertyMap).default({}),
  layers: z.record(z.string(), Layer).optional(),
  example: Lines.optional(),
});

export type Mapping = z.infer<typeof Mapping>;
export type PropertyMap = z.infer<typeof PropertyMap>;
export type Choice = z.infer<typeof Choice>;
export type Layer = z.infer<typeof Layer>;
export type Value = z.infer<typeof Props>[string];

/** A Figma property as a mapping reads it: its name, type, and the values it takes (a boolean's are "true" and
 *  "false"). */
export interface FigmaProp {
  name: string;
  type: string;
  options: string[];
}

/** A library component's properties as mappings read them. */
export const figmaProps = (c: LibraryComponent): FigmaProp[] =>
  Object.entries(c.properties).map(([name, p]) => {
    if (p.type === "VARIANT") return { name, type: p.type, options: p.values };
    return {
      name,
      type: p.type,
      options: p.type === "BOOLEAN" ? ["true", "false"] : [],
    };
  });

// a combined property's name and values join their parts: "Color + Style", "positive + contained"
export const JOIN = " + ";

/** Every combination of the parts' options, joined: the values a (combined) property takes. */
const combinations = (parts: FigmaProp[]): string[] =>
  parts.reduce<string[]>(
    (acc, p) =>
      acc.flatMap((a) => p.options.map((o) => (a ? `${a}${JOIN}${o}` : o))),
    [""],
  );

/** The values a mapping reads into the snippet (texts, instances, layers), by name. */
export function namedValues(m: Mapping): string[] {
  const own = Object.values(m.properties).flatMap((p) => {
    if ("text" in p) return [p.text];
    return "instance" in p ? [p.instance] : [];
  });
  return [...own, ...Object.keys(m.layers ?? {})];
}

/** A snippet written as one string or as its lines. */
export const snippetText = (lines: z.infer<typeof Lines>) =>
  Array.isArray(lines) ? lines.join("\n") : lines;

/** The snippets a mapping writes: its example, its examples by value, its code layers. */
export function snippets(m: Mapping): string[] {
  const examples = Object.values(m.properties).flatMap((p) =>
    "examples" in p ? Object.values(p.examples ?? {}) : [],
  );
  const codes = Object.values(m.layers ?? {}).flatMap((l) =>
    "code" in l ? [l.code] : [],
  );
  return [...(m.example ? [m.example] : []), ...examples, ...codes].map(
    snippetText,
  );
}

// a placeholder in a snippet: {{name}} the value, {{@name}} it as an attribute, {{attrs}} the element's props
export const PLACEHOLDER = /\{\{(@?)(\w+)\}\}/g;

type Check = (m: Mapping, props: FigmaProp[], at: string) => string[];

type Kind = "figmaOnly" | "text" | "instance" | "choice";

/** The Figma property types each kind of mapping reads. */
const KIND_TYPES: Record<Exclude<Kind, "figmaOnly">, string[]> = {
  text: ["TEXT"],
  instance: ["INSTANCE_SWAP"],
  choice: ["VARIANT", "BOOLEAN"],
};
const kindOf = (p: PropertyMap): Kind =>
  (["figmaOnly", "text", "instance"] as const).find((k) => k in p) ?? "choice";

/** A mapping kind's Figma properties have a type it reads, and only a choice combines several. */
function typeProblems(
  key: string,
  kind: keyof typeof KIND_TYPES,
  parts: FigmaProp[],
  at: string,
): string[] {
  const types = KIND_TYPES[kind];
  const wrong = parts.find((p) => !types.includes(p.type));
  if (wrong)
    return [
      `${at}: "${wrong.name}" is ${wrong.type}, which a ${kind} mapping can't read`,
    ];
  return kind !== "choice" && parts.length > 1
    ? [`${at}: "${key}" combines a ${kind}`]
    : [];
}

/** One mapped property: the Figma properties it names exist, have a type its kind reads, and (a choice) are covered. */
function propertyProblems(
  key: string,
  map: PropertyMap,
  props: FigmaProp[],
  at: string,
): string[] {
  const parts = key.split(JOIN).map((n) => props.find((p) => p.name === n));
  if (parts.some((p) => !p))
    return [`${at}: "${key}" is not a Figma property of it (stale)`];
  const kind = kindOf(map);
  if (kind === "figmaOnly") return [];

  const found = parts as FigmaProp[];
  const wrong = typeProblems(key, kind, found, at);
  return wrong.length || kind !== "choice"
    ? wrong
    : choiceProblems(map as Choice, found, at);
}

const propertyCheck: Check = (m, props, at) =>
  Object.entries(m.properties).flatMap(([key, map]) =>
    propertyProblems(key, map, props, at),
  );

/** A choice covers every value of its property (every combination, for a combined one), and no value it lacks. */
function choiceProblems(map: Choice, parts: FigmaProp[], at: string): string[] {
  const options = combinations(parts);
  const keys = new Set(
    [map.values, map.shows, map.examples].flatMap((r) => Object.keys(r ?? {})),
  );
  const name = parts.map((p) => p.name).join(JOIN);

  const missing = options
    .filter((o) => !keys.has(o))
    .map((o) => `${at}: ${name}=${o} has no mapping`);
  const extra = [...keys]
    .filter((k) => !options.includes(k))
    .map((k) => `${at}: ${name} has no value "${k}"`);
  const partial = map.examples && options.some((o) => !(o in map.examples!));
  return [
    ...missing,
    ...extra,
    ...(partial ? [`${at}: ${name}'s examples miss a value`] : []),
  ];
}

const coverageCheck: Check = (m, props, at) => {
  const covered = new Set(
    Object.keys(m.properties).flatMap((k) => k.split(JOIN)),
  );
  return props
    .filter((p) => !covered.has(p.name))
    .map((p) => `${at}: Figma property "${p.name}" is not mapped`);
};

const exampleCheck: Check = (m, _props, at) => {
  const choosers = Object.entries(m.properties).filter(
    ([, p]) => "examples" in p,
  );
  if (choosers.length > 1)
    return [
      `${at}: only one property may pick the example (${choosers.map(([k]) => k)})`,
    ];
  return choosers.length && m.example
    ? [`${at}: both an example and examples by value`]
    : [];
};

/** The props a choice's values set. */
const propsOf = (c: Choice) =>
  Object.values(c.values ?? {}).flatMap((v) => Object.keys(v));

/** Every value a snippet or a `shows` names is one the mapping reads. */
const namesCheck: Check = (m, _props, at) => {
  const known = new Set(namedValues(m));
  const shown = Object.values(m.properties).flatMap((p) =>
    "shows" in p ? Object.values(p.shows ?? {}).flat() : [],
  );
  const placed = snippets(m).flatMap((s) =>
    [...s.matchAll(PLACEHOLDER)].map((x) => x[2]),
  );
  const valueProps = new Set(
    Object.values(m.properties).flatMap((p) =>
      "values" in p ? propsOf(p) : [],
    ),
  );

  const unknownShown = shown
    .filter((n) => !known.has(n))
    .map((n) => `${at}: shows "${n}", which it doesn't read`);
  const unknownPlaced = placed
    .filter((n) => n !== "attrs" && !known.has(n) && !valueProps.has(n))
    .map((n) => `${at}: its snippet places "${n}", which it doesn't read`);
  return [...unknownShown, ...unknownPlaced];
};

const CHECKS: Check[] = [
  propertyCheck,
  coverageCheck,
  exampleCheck,
  namesCheck,
];

/** What the map gets wrong for one Figma component: every property mapped or Figma-only, every value mapped. */
export const mappingProblems = (m: Mapping, props: FigmaProp[], at: string) =>
  CHECKS.flatMap((check) => check(m, props, at));
