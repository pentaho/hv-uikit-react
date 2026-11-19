// The documentation pages the plugin carries: content/page-template.json filled with each content/pages/*.json, and
// the library keys of the components they name. Bundled at build time (vite), so a content change is a plugin build.
import library from "../../code-connect/library.json";
import template from "../../content/page-template.json";
import { keysOf, type LibraryJson } from "../code-connect/library.ts";
import { componentsIn, expand, type Values } from "../sync/pages.ts";

const contents = import.meta.glob<Values>("../../content/pages/*.json", {
  eager: true,
  import: "default",
});

export const pages = Object.keys(contents)
  .toSorted()
  .map((file) => expand(template, contents[file]));

const named = new Set(componentsIn(pages));
export const components = Object.fromEntries(
  Object.entries(keysOf(library as LibraryJson)).filter(([name]) =>
    named.has(name),
  ),
);
