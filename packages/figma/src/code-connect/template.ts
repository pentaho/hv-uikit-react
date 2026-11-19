// One parserless Code Connect template (`.figma.ts`) from a Figma component's mapping (map.ts): the values
// it reads from the selected instance (`const x = instance…`), then the snippet with those values in place. What a
// template can call is Figma's (figma.selectedInstance, getEnum, getBoolean, findInstance…), so the helpers it needs
// are written into it.
import {
  JOIN,
  namedValues,
  PLACEHOLDER,
  snippets,
  snippetText,
  type Choice,
  type FigmaProp,
  type Layer,
  type Mapping,
  type PropertyMap,
  type Value,
} from "./map.ts";

const q = JSON.stringify;

/** A value the template reads: its JS (several, merged: the first that has a value wins), whether it is code (an
 *  instance's snippet) rather than text, and whether a `shows` may hide it (a read, not a prop a value sets). */
interface Read {
  name: string;
  js: string[];
  isCode: boolean;
  isShown: boolean;
}

interface TemplateInput {
  mapping: Mapping;
  props: FigmaProp[];
  element: string; // the code component the snippet's root is
  module: string; // where the snippet's components are imported from
  id: string; // the Figma component's name: the template's id
  nodeId: string; // its node
  url: string; // the Figma component's URL
  source: string; // where its code is read
}

const HELPERS = {
  attr: [
    "const attr = (name, value) => {",
    '  if (value === undefined || value === false) return "";',
    "  if (value === true) return ` ${name}`;",
    '  if (typeof value === "number") return ` ${name}={${value}}`;',
    '  return value.startsWith("{") ? ` ${name}=${value}` : ` ${name}="${value}"`;',
    "};",
  ],
  codeOf: [
    'const codeOf = (node) => (node && node.type === "INSTANCE" ? node.executeTemplate().example : undefined);',
  ],
  textOf: [
    'const textOf = (node) => (node && node.type === "TEXT" ? node.textContent : undefined);',
  ],
  numberOf: [
    "const numberOf = (text) => Number((String(text).match(/\\d+/g) ?? []).pop());",
  ],
};

/** JS that picks by the instance's properties, nested for a combined one: getEnum for a variant, getBoolean for a
 *  boolean, each value's result from `leaf` (given the value, joined for a combined property). */
function pick(
  parts: FigmaProp[],
  leaf: (combo: string) => string,
  at = "",
): string {
  const [part, ...rest] = parts;
  const entries = part.options.map((o) => {
    const combo = at ? `${at}${JOIN}${o}` : o;
    return `${q(o)}: ${rest.length ? pick(rest, leaf, combo) : leaf(combo)}`;
  });
  const call = part.type === "BOOLEAN" ? "getBoolean" : "getEnum";
  return `instance.${call}(${q(part.name)}, { ${entries.join(", ")} })`;
}

const literal = (v: Value | undefined) =>
  v === undefined ? "undefined" : q(v);

/** `as`: a number read from the text (its last integer), or that minus one. */
function asNumber(js: string, as?: "number" | "index") {
  if (!as) return js;
  return as === "index" ? `numberOf(${js}) - 1` : `numberOf(${js})`;
}

/** A layer found in the instance by name (not a code layer). */
type Found = Exclude<Layer, { code: unknown }>;

/** JS that finds a layer: by name, under a path, or the nth of that name. */
function findJs(layer: Found): string {
  const name = "instance" in layer ? layer.instance : layer.text;
  const opts = layer.path
    ? `, { path: ${q(layer.path)}, traverseInstances: true }`
    : "";
  if (layer.nth !== undefined)
    return `instance.findLayers((node) => node.name === ${q(name)}${opts})[${layer.nth}]`;
  return `instance.${"instance" in layer ? "findInstance" : "findText"}(${q(name)}${opts})`;
}

/** A read of a text, or of an instance's snippet; a `shows` may hide either. */
const textRead = (name: string, js: string): Read => ({
  name,
  js: [js],
  isCode: false,
  isShown: true,
});
const codeRead = (name: string, js: string): Read => ({
  name,
  js: [js],
  isCode: true,
  isShown: true,
});

/** What one mapped property reads: a text, a swapped instance, or a prop per value (one read per prop it sets). */
function propertyReads(
  key: string,
  map: PropertyMap,
  parts: FigmaProp[],
): Read[] {
  if ("text" in map)
    return [
      textRead(map.text, asNumber(`instance.getString(${q(key)})`, map.as)),
    ];
  if ("instance" in map)
    return [
      codeRead(map.instance, `codeOf(instance.getInstanceSwap(${q(key)}))`),
    ];
  if (!("values" in map) || !map.values) return [];

  const values = map.values;
  const props = [
    ...new Set(Object.values(values).flatMap((v) => Object.keys(v))),
  ];
  const js = (prop: string) =>
    pick(parts, (combo) => literal(values[combo]?.[prop]));
  return props.map((prop) => ({
    name: prop,
    js: [js(prop)],
    isCode: false,
    isShown: false,
  }));
}

function layerRead(name: string, layer: Found): Read {
  if ("instance" in layer) return codeRead(name, `codeOf(${findJs(layer)})`);
  return textRead(name, asNumber(`textOf(${findJs(layer)})`, layer.as));
}

/** The condition one `shows` puts on a value: a boolean read as itself (or negated), else picked per value. */
function gateJs(
  parts: FigmaProp[],
  shows: Record<string, string[]>,
  name: string,
): string {
  const isShownBy = (value: string) => !!shows[value]?.includes(name);
  const [only] = parts;
  if (
    parts.length === 1 &&
    only.type === "BOOLEAN" &&
    isShownBy("true") !== isShownBy("false")
  )
    return `${isShownBy("true") ? "" : "!"}instance.getBoolean(${q(only.name)})`;
  return pick(parts, (value) => q(isShownBy(value)));
}

/** The conditions `shows` puts on the values it names. */
function gatesOf(
  m: Mapping,
  partsOf: (key: string) => FigmaProp[],
): Map<string, string[]> {
  const gates = new Map<string, string[]>();
  for (const [key, map] of Object.entries(m.properties)) {
    if (!("shows" in map) || !map.shows) continue;
    const shows = map.shows;
    for (const name of new Set(Object.values(shows).flat()))
      gates.set(name, [
        ...(gates.get(name) ?? []),
        gateJs(partsOf(key), shows, name),
      ]);
  }
  return gates;
}

/** A read its `shows` may hide, with those conditions on it. */
function gated(r: Read, gates: Map<string, string[]>): Read {
  const conditions = r.isShown ? (gates.get(r.name) ?? []) : [];
  if (!conditions.length) return r;
  return {
    ...r,
    js: r.js.map((js) => `${conditions.join(" && ")} ? ${js} : undefined`),
  };
}

/** Reads with one name merge (the first that has a value wins), in the order the map lists them. */
function merged(reads: Read[]): Read[] {
  const byName = new Map<string, Read>();
  for (const r of reads) {
    const seen = byName.get(r.name);
    byName.set(r.name, seen ? { ...seen, js: [...seen.js, ...r.js] } : r);
  }
  return [...byName.values()];
}

const constLine = (r: Read) => {
  const js =
    r.js.length > 1
      ? r.js.map((x) => (x.includes(" ? ") ? `(${x})` : x))
      : r.js;
  return `const ${r.name} = ${js.join(" ?? ")};`;
};

/** A fixed prop as JSX writes it. */
function fixedAttr(name: string, v: Value): string {
  if (v === true) return ` ${name}`;
  if (v === false) return "";
  if (typeof v === "number") return ` ${name}={${v}}`;
  return v.startsWith("{") ? ` ${name}=${v}` : ` ${name}=${q(v)}`;
}

type Named = Pick<Read, "name" | "isCode">;

// what a template literal would read as its own syntax: a backtick, a backslash, a `${`
const TEMPLATE_SYNTAX = /[`\\]|\$\{/g;

/** How a snippet renders: {{attrs}} the root's fixed props and the values no snippet places, {{@x}} x as an
 *  attribute, {{x}} x itself. `named` lists every value and whether it is code. */
function renderer(m: Mapping, named: Named[]) {
  const placed = new Set(
    snippets(m).flatMap((s) => [...s.matchAll(PLACEHOLDER)].map((x) => x[2])),
  );
  const attrOf = ({ name, isCode }: Named) =>
    isCode
      ? `\${${name} ? figma.code\` ${name}={\${${name}}}\` : ""}`
      : `\${attr(${q(name)}, ${name})}`;
  const fixed = Object.entries(m.fixed ?? {}).map(([k, v]) => fixedAttr(k, v));
  const unplaced = named.filter(
    (r) => !placed.has(r.name) && r.name !== "children",
  );
  const attrs = [...fixed, ...unplaced.map(attrOf)].join("");

  const fill = (_: string, at: string, name: string) => {
    if (name === "attrs") return attrs;
    return at
      ? attrOf(named.find((r) => r.name === name)!)
      : `\${${name} ?? ""}`;
  };
  return (snippet: string) =>
    "figma.code`" +
    snippet
      .replace(TEMPLATE_SYNTAX, (c) => `\\${c}`)
      .replace(PLACEHOLDER, fill) +
    "`";
}

/** The pieces of a template: its reads (code layers last, as they place the others), and how a snippet renders. */
function piecesOf(input: TemplateInput) {
  const { mapping: m, props } = input;
  const partsOf = (key: string) =>
    key.split(JOIN).map((n) => props.find((p) => p.name === n)!);
  const layers = Object.entries(m.layers ?? {});
  const own = Object.entries(m.properties).flatMap(([key, map]) =>
    propertyReads(key, map, partsOf(key)),
  );
  const found = layers.flatMap(([name, layer]) =>
    "code" in layer ? [] : [layerRead(name, layer)],
  );
  const gates = gatesOf(m, partsOf);
  const plain = merged([...own, ...found].map((r) => gated(r, gates)));

  const codes = layers.flatMap(([name, layer]) =>
    "code" in layer ? [{ name, code: snippetText(layer.code) }] : [],
  );
  const render = renderer(m, [
    ...plain,
    ...codes.map(({ name }) => ({ name, isCode: true })),
  ]);
  const coded = codes.map(({ name, code }) =>
    gated(codeRead(name, render(code)), gates),
  );
  return { reads: [...plain, ...coded], render, partsOf };
}

/** The snippet: the example, the one picked by a property's value, or the element with its props and words. */
function exampleJs(
  input: TemplateInput,
  render: (s: string) => string,
  partsOf: (k: string) => FigmaProp[],
) {
  const { mapping: m, element } = input;
  const chooser = Object.entries(m.properties).find(
    ([, p]) => "examples" in p,
  ) as [string, Choice] | undefined;
  if (chooser)
    return pick(partsOf(chooser[0]), (c) =>
      render(snippetText(chooser[1].examples![c])),
    );
  if (m.example) return render(snippetText(m.example));
  const words = namedValues(m).includes("children");
  return render(
    words
      ? `<${element}{{attrs}}>{{children}}</${element}>`
      : `<${element}{{attrs}} />`,
  );
}

/** The lines every template starts with: where its Figma component and its code are, and that it's generated. */
const header = (
  url: string,
  nodeId: string,
  source: string,
  element: string,
) => [
  `// url=${url}?node-id=${nodeId.replace(":", "-")}`,
  `// source=${source}`,
  `// component=${element}`,
  "// Generated by `npm run generate -w packages/figma`: don't edit (from overrides.json, properties.json and library.json).",
  'import figma from "figma";',
];

/** An icon's template: the component of its name, from the icon package. */
type Icon = {
  id: string;
  nodeId: string;
  name: string;
  module: string;
  url: string;
};

export const iconTemplate = ({ id, nodeId, name, module, url }: Icon) =>
  [
    ...header(url, nodeId, module, name),
    "",
    "export default {",
    `  id: ${q(id)},`,
    `  example: figma.code\`<${name} />\`,`,
    `  imports: [${q(`import { ${name} } from "${module}";`)}],`,
    "  metadata: { nestable: true },",
    "};",
    "",
  ].join("\n");

/** The template file's text. */
export function template(input: TemplateInput): string {
  const { reads, render, partsOf } = piecesOf(input);
  const example = exampleJs(input, render, partsOf);
  const lines = reads.map(constLine);

  const body = [...lines, example].join("\n");
  const helpers = Object.entries(HELPERS).flatMap(([name, js]) =>
    body.includes(`${name}(`) ? js : [],
  );
  // every component the snippet writes, the root included: JSX tags start with a capital
  const tags = [
    ...new Set([
      input.element,
      ...[...body.matchAll(/<([A-Z]\w*)/g)].map((x) => x[1]),
    ]),
  ].toSorted();
  return [
    ...header(input.url, input.nodeId, input.source, input.element),
    // the selected instance, when the template reads from it
    ...(body.includes("instance.")
      ? ["const instance = figma.selectedInstance;"]
      : []),
    ...(helpers.length ? ["", ...helpers] : []),
    ...(lines.length ? ["", ...lines] : []),
    "",
    "export default {",
    `  id: ${q(input.id)},`,
    `  example: ${example},`,
    `  imports: [${q(`import { ${tags.join(", ")} } from "${input.module}";`)}],`,
    "  metadata: { nestable: true },",
    "};",
    "",
  ].join("\n");
}
