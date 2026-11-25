import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import library from "../../code-connect/library.json";

const src = path.resolve(import.meta.dirname, "../../../core/src");

/** The `Hv*` components @pentaho/uikit-react-core's sources export. */
const exported = new Set(
  readdirSync(src, { recursive: true })
    .filter((f): f is string => typeof f === "string" && f.endsWith(".tsx"))
    .flatMap((f) => [
      ...readFileSync(path.join(src, f), "utf8").matchAll(
        /export\s+(?:const|function)\s+(Hv\w+)/g,
      ),
    ])
    .map((m) => m[1]),
);

const entries = [
  ...Object.values(library.components).flat(),
  ...Object.values(library.icons),
];

describe("the Figma library map", () => {
  it("names only components the package exports", () => {
    expect(
      Object.keys(library.components).filter((name) => !exported.has(name)),
    ).toEqual([]);
  });

  it("holds each Figma key and node once, in Figma's format", () => {
    const keys = entries.map((e) => e.key);
    const nodes = entries.map((e) => e.node);
    expect(keys.filter((k) => !/^[\da-f]{40}$/.test(k))).toEqual([]);
    expect(nodes.filter((n) => !/^\d+:\d+$/.test(n))).toEqual([]);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(nodes).size).toBe(nodes.length);
  });
});
