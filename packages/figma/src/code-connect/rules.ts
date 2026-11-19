// The mappings rules can make without being told: what each Figma property becomes when its name, values and the
// prop's type say so. A text goes to the prop of its name, else (once per component) to children; a variant to the prop of its name, its values as they are
// ("default" sets nothing); State's values to the boolean prop they name (Disabled → disabled), its pointer and focus
// states to nothing; a boolean to the boolean prop of its name, or, with an "<name> instance" swap, to showing that
// slot; "Show x" to showing the part read as x. overrides.json writes the rest.
import type { FigmaProp, Mapping, PropertyMap } from "./map.ts";

/** A component's props: each name and its type, as the UI Kit declares it. */
export type CodeProps = Map<string, string>;
type Props = Record<string, string | boolean>;

/** "Start icon" → startIcon. */
const camel = (name: string) =>
  name.toLowerCase().replace(/\W+(\w)/g, (_, c: string) => c.toUpperCase());
const isBoolean = (code: CodeProps, prop: string) =>
  /^boolean\b/.test(code.get(prop) ?? "");

/** State values that set no prop: the default look, and what a pointer or focus draws. */
const INTERACTION = new Set([
  "default",
  "Default",
  "Hover",
  "Pressed",
  "Focus",
  "Active",
]);
const SHOW = /^Show (.+)$/;

/** Each value as the props it sets (`nothing`: the values that set none); undefined when a value is unmapped. */
function valuesOf(
  p: FigmaProp,
  nothing: Set<string>,
  set: (value: string) => Props | undefined,
) {
  const entries = p.options.map(
    (v) => [v, nothing.has(v) ? {} : set(v)] as const,
  );
  const isMapped = (
    e: (typeof entries)[number],
  ): e is readonly [string, Props] => e[1] !== undefined;
  return entries.every(isMapped)
    ? { values: Object.fromEntries(entries) }
    : undefined;
}

function variant(p: FigmaProp, code: CodeProps): PropertyMap | undefined {
  if (p.name === "State") {
    return valuesOf(p, INTERACTION, (v) =>
      isBoolean(code, camel(v)) ? { [camel(v)]: true } : undefined,
    );
  }
  const prop = camel(p.name);
  return code.has(prop)
    ? valuesOf(p, new Set(["default"]), (v) => ({ [prop]: v }))
    : undefined;
}

function boolean(
  p: FigmaProp,
  all: FigmaProp[],
  code: CodeProps,
): PropertyMap | undefined {
  const prop = camel(p.name);
  const slot = all.some(
    (q) => q.type === "INSTANCE_SWAP" && q.name === `${p.name} instance`,
  );
  if (slot && code.has(prop)) return { shows: { true: [prop], false: [] } };
  if (isBoolean(code, prop))
    return { values: { true: { [prop]: true }, false: {} } };

  const part = SHOW.exec(p.name);
  return part ? { shows: { true: [camel(part[1])], false: [] } } : undefined;
}

function propertyMap(
  p: FigmaProp,
  all: FigmaProp[],
  code: CodeProps,
): PropertyMap | undefined {
  if (p.type === "TEXT")
    return code.has(camel(p.name)) ? { text: camel(p.name) } : undefined;
  if (p.type === "INSTANCE_SWAP") {
    const prop = camel(p.name.replace(/ instance$/, ""));
    return code.has(prop) ? { instance: prop } : undefined;
  }
  return p.type === "BOOLEAN" ? boolean(p, all, code) : variant(p, code);
}

/** The mapping rules make for a component with Figma properties `props` and code props `code`. A text no prop is
 *  named for goes to children only when it is the component's one such text. */
export function ruled(props: FigmaProp[], code: CodeProps): Mapping {
  const unnamed = props.filter(
    (p) => p.type === "TEXT" && !code.has(camel(p.name)),
  );
  const children = unnamed.length === 1 ? unnamed[0] : undefined;
  const properties = props.flatMap((p) => {
    const map =
      propertyMap(p, props, code) ??
      (p === children ? { text: "children" } : undefined);
    return map ? [[p.name, map] as const] : [];
  });
  return { properties: Object.fromEntries(properties) };
}
