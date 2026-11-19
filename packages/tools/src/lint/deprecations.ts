// What the installed UI Kit marks @deprecated in its type declarations (every .d.ts in dist, one per module):
// components and props, each with the UI Kit's own advice, so uikit/deprecated follows the installed version.
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { CORE } from "../core/metadata.js";

const PREFIX = "Hv";

/** The UI Kit installed for the code in `from` (a folder); undefined when it isn't installed there. */
function coreDir(from: string): string | undefined {
  try {
    const pkg = createRequire(
      path.join(path.resolve(from), "index.js"),
    ).resolve(`${CORE}/package.json`);
    return path.dirname(pkg);
  } catch {
    return undefined;
  }
}

type Deprecations = {
  components: Map<string, string>;
  props: Map<string, Map<string, string>>;
};

// what a component's name looks like in the declarations (the library's prefix)
const NAME = `${PREFIX}\\w+`;

/** The installed UI Kit's declaration files. */
function declarationFiles(dir: string | undefined): string[] {
  const dist = dir && path.join(dir, "dist");
  if (!dist || !fs.existsSync(dist)) return [];
  return fs
    .readdirSync(dist, { recursive: true })
    .filter((f): f is string => typeof f === "string" && f.endsWith(".d.ts"))
    .map((f) => path.join(dist, f));
}

/** Each installed UI Kit's deprecations, read once. */
const cache = new Map<string | undefined, Deprecations>();

/**
 * The deprecations of the UI Kit installed for the code in `from` (a folder), so a monorepo or an editor linting from
 * elsewhere still finds the right version. Props belong to `<Name>Props`, which is the component `<Name>`.
 */
export function readDeprecations(from: string): Deprecations {
  const dir = coreDir(from);
  let found = cache.get(dir);
  if (!found) {
    found = { components: new Map(), props: new Map() };
    for (const file of declarationFiles(dir))
      collect(fs.readFileSync(file, "utf8"), found);
    cache.set(dir, found);
  }
  return found;
}

const OWNER = new RegExp(
  `export (?:declare )?(?:interface|type) (${NAME})Props\\b`,
  "g",
);
const DECLARED = new RegExp(`^export declare const (${NAME})\\b`);

/** The deprecations in one declaration file. */
function collect(text: string, { components, props }: Deprecations) {
  if (!text.includes("@deprecated")) return;
  const owners = [...text.matchAll(OWNER)];
  for (const m of text.matchAll(DEPRECATED_DOC)) {
    const advice = adviceOf(m[2]);
    const component = m[3].match(DECLARED)?.[1];
    if (component) {
      components.set(component, advice);
      continue;
    }
    const prop = m[3].match(/^\s*(\w+)\??:/)?.[1];
    const owner = ownerBefore(owners, m.index);
    if (prop && owner) deprecatedProps(props, owner).set(prop, advice);
  }
}

/** The component whose Props type a declaration at `index` is in: the last one declared before it. */
const ownerBefore = (owners: RegExpExecArray[], index: number) =>
  owners.findLast((o) => o.index < index)?.[1];

// A doc comment holding @deprecated, and the declaration line after it: [, body, advice, declaration].
const DEPRECATED_DOC =
  /\/\*\*((?:(?!\*\/)[\s\S])*?@deprecated((?:(?!\*\/)[\s\S])*))\*\/\s*([^\n]+)/g;
/** The advice after @deprecated as one line: the leading dash and each line's `*` dropped. */
const adviceOf = (text: string) =>
  text
    .replace(/^\s*-?\s*/, "")
    .replace(/\s*\*\s*/g, " ")
    .trim();
/** A component's deprecated props, added the first time one is found. */
function deprecatedProps(props: Deprecations["props"], owner: string) {
  if (!props.has(owner)) props.set(owner, new Map());
  return props.get(owner)!;
}
