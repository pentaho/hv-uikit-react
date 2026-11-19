// The documentation pages: the template filled with each page's content, naming only components, variants and
// colors the library has.
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

import library from "../code-connect/library.json";
import properties from "../code-connect/properties.json";
import template from "../content/page-template.json";
import sync from "../figma-sync.json";
import {
  libraryOf,
  type LibraryJson,
  type Properties,
} from "../src/code-connect/library.ts";
import { expand, type Values } from "../src/sync/pages.ts";
import type { Bundle } from "../src/sync/types.ts";

const dir = path.join(import.meta.dirname, "../content/pages");
const pages = fs
  .readdirSync(dir)
  .toSorted()
  .map((f) =>
    expand(
      template,
      JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Values,
    ),
  );

const components = new Map(
  libraryOf(library as LibraryJson, properties as Properties).components.map(
    (c) => [c.name, c],
  ),
);
const colors = new Set(
  (sync as unknown as Bundle).variables
    .filter((v) => v.collection === "Color")
    .map((v) => v.name),
);

type Named = {
  component?: string;
  variant?: Record<string, string>;
  variable?: string;
  rgb?: unknown;
};

function problemsIn(x: unknown): string[] {
  if (Array.isArray(x)) return x.flatMap(problemsIn);
  if (!x || typeof x !== "object") return [];

  const { component, variant = {}, variable, rgb } = x as Named;
  const c = component ? components.get(component) : undefined;
  const variants = Object.entries(variant).flatMap(([prop, value]) => {
    const known = c?.properties[prop];
    return known?.type === "VARIANT" && known.values.includes(value)
      ? []
      : [`${component} ${prop}=${value}`];
  });
  return [
    ...(variable && !rgb && !colors.has(variable) ? [`color ${variable}`] : []),
    ...(component && !c ? [`component ${component}`] : []),
    ...variants,
    ...Object.values(x).flatMap(problemsIn),
  ];
}

test("every page is drawn from the template, Button's among them", () => {
  expect(pages.length).toBeGreaterThanOrEqual(47);
  expect(pages.find((p) => p.name === "Button")?.page.name).toBe(
    "Button — documentation",
  );
});

test("every component, variant and color a page names exists", () => {
  expect(problemsIn(pages)).toEqual([]);
});

test("a template fills values and slots, repeats items, drops what has no value, and names a missing value", () => {
  const t = {
    name: "{{name}} page",
    gap: "{{gap}}",
    children: [
      { slot: "body" },
      { if: "absent", name: "gone" },
      { each: "rows", name: "row {{item}}" },
    ],
  };
  const content = {
    name: "A",
    gap: 8,
    body: [{ name: "x" }],
    rows: ["1", "2"],
  };

  expect(expand(t, content).page).toEqual({
    name: "A page",
    gap: 8,
    children: [{ name: "x" }, { name: "row 1" }, { name: "row 2" }],
  });
  expect(() => expand(t, { ...content, gap: undefined })).toThrow(/gap/);
});
