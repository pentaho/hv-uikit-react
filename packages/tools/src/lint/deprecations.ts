// What the installed UI Kit marks @deprecated in its type declarations (dist/index.d.ts): components and props, each
// with the UI Kit's own advice, so uikit/deprecated follows the installed version.
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { CORE } from "../core/metadata.js";

const PREFIX = "Hv";

/** The installed UI Kit's folder, resolved from the project being linted; undefined when it isn't installed. */
function coreDir(cwd = process.cwd()): string | undefined {
  try {
    const pkg = createRequire(
      path.join(path.resolve(cwd), "package.json"),
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

/** The installed UI Kit's deprecations. Props belong to `<Name>Props`, which is the component `<Name>`. */
export function readDeprecations(): Deprecations {
  const components = new Map<string, string>();
  const props = new Map<string, Map<string, string>>();

  const dir = coreDir();
  const file = dir && path.join(dir, "dist/index.d.ts");
  if (!file || !fs.existsSync(file)) return { components, props };
  const text = fs.readFileSync(file, "utf8");
  const owners = [
    ...text.matchAll(
      new RegExp(`export declare (?:interface|type) (${NAME})Props\\b`, "g"),
    ),
  ];
  const declared = new RegExp(`^export declare const (${NAME})\\b`);

  for (const m of text.matchAll(DEPRECATED_DOC)) {
    const advice = adviceOf(m[2]);
    const component = m[3].match(declared)?.[1];
    if (component) {
      components.set(component, advice);
      continue;
    }
    const prop = m[3].match(/^\s*(\w+)\??:/)?.[1];
    const owner = ownerBefore(owners, m.index);
    if (prop && owner) deprecatedProps(props, owner).set(prop, advice);
  }

  return { components, props };
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
