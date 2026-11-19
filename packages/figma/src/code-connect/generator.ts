// The Code Connect templates (code-connect/generated/), one per component in the Figma library, so Dev Mode shows the
// code for an instance: an icon by its name, a UI Kit component by its mapping (rules.ts, then what overrides.json
// says, which wins). Pure: the library, the overrides and the UI Kit's facts in, the files out; it throws with every
// problem when a component or a property has no mapping, or two components share a file.
import { z } from "zod";

import type { Files } from "../emit.ts";
import type { Library, LibraryComponent } from "./library.ts";
import {
  figmaProps,
  JOIN,
  Mapping,
  mappingProblems,
  type FigmaProp,
} from "./map.ts";
import { ruled, type CodeProps } from "./rules.ts";
import { iconTemplate, template } from "./template.ts";

const Override = Mapping.extend({ skip: z.string().min(1).optional() });
export const Overrides = z.strictObject({
  $comment: z.string().optional(),
  components: z.record(z.string(), Override),
});
export type Overrides = z.infer<typeof Overrides>;

/** What the generator knows of the UI Kit: its components' props (undefined: no such component), where each
 *  source is, and the packages the components and the icons import from. */
export interface UiKit {
  module: string;
  iconModule: string;
  props: (name: string) => CodeProps | undefined;
  sources: Record<string, string>;
}

const fileName = (figma: string) =>
  `${figma.replace(/(?:^|\W+)(\w)/g, (_, c: string) => c.toUpperCase())}.figma.ts`;

/** The rules' mapping with the override on top: its properties replace the rules' (a combined one, its parts'), in the
 *  order Figma lists the properties (a combined one where its first part is). */
function withOverride(
  rules: Mapping,
  override: Mapping | undefined,
  props: FigmaProp[],
): Mapping {
  if (!override) return rules;
  const replaced = new Set(
    Object.keys(override.properties).flatMap((k) => k.split(JOIN)),
  );
  const kept = Object.entries(rules.properties).filter(
    ([k]) => !replaced.has(k),
  );
  const at = (key: string) =>
    props.findIndex((p) => p.name === key.split(JOIN)[0]);
  const entries = [...kept, ...Object.entries(override.properties)].toSorted(
    ([a], [b]) => at(a) - at(b),
  );
  return { ...rules, ...override, properties: Object.fromEntries(entries) };
}

type Made = { file?: [string, string]; problems: string[] };
type Context = { kit: UiKit; overrides: Overrides; url: string };

function iconFile(c: LibraryComponent, { kit, url }: Context): Made {
  const input = {
    id: c.name,
    nodeId: c.id,
    name: c.element,
    module: kit.iconModule,
    url,
  };
  return { file: [fileName(c.name), iconTemplate(input)], problems: [] };
}

function componentFile(
  c: LibraryComponent,
  { kit, overrides, url }: Context,
): Made {
  const override = overrides.components[c.name];
  if (override?.skip) return { problems: [] };

  const element = override?.element ?? c.element;
  const code = kit.props(element);
  if (!code)
    return { problems: [`${c.name}: ${element} is not a UI Kit component`] };

  const props = figmaProps(c);
  const mapping = withOverride(ruled(props, code), override, props);
  const problems = mappingProblems(mapping, props, c.name);
  if (problems.length) return { problems };

  const source = kit.sources[element] ?? kit.module;
  const input = {
    mapping,
    props,
    element,
    module: kit.module,
    id: c.name,
    nodeId: c.id,
    url,
    source,
  };
  return { file: [fileName(c.name), template(input)], problems: [] };
}

/** The problems no single component shows: an override for nothing, two components writing one file. */
function setProblems(
  library: Library,
  overrides: Overrides,
  made: Made[],
): string[] {
  const names = new Set(library.components.map((c) => c.name));
  const stale = Object.keys(overrides.components).filter((n) => !names.has(n));
  const files = made.flatMap((m) => (m.file ? [m.file[0]] : []));
  const twice = [...new Set(files.filter((f, i) => files.indexOf(f) !== i))];
  return [
    ...stale.map((n) => `${n}: in overrides, not in the library`),
    ...twice.map((f) => `${f}: made twice`),
  ];
}

/** Every template, by file name; throws with the problems when the mappings don't cover the library. */
export function codeConnectFiles(
  library: Library,
  overrides: Overrides,
  kit: UiKit,
): Files {
  const ctx = {
    kit,
    overrides,
    url: `https://www.figma.com/design/${library.file}`,
  };
  const made = library.components.map((c) =>
    c.icon ? iconFile(c, ctx) : componentFile(c, ctx),
  );

  const problems = [
    ...made.flatMap((m) => m.problems),
    ...setProblems(library, overrides, made),
  ];
  if (problems.length)
    throw new Error(
      `Code Connect mappings incomplete:\n  ${problems.join("\n  ")}`,
    );

  return Object.fromEntries(made.flatMap((m) => (m.file ? [m.file] : [])));
}
