// The agent scripts' data round-trips: the library to what the core writes (colors to 8 bits, as Figma keeps them),
// each page exactly.
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

import template from "../../content/page-template.json";
import sync from "../../figma-sync.json";
import type { Bundle } from "../sync/types.ts";
import { pack, packLibrary, unpack, unpackLibrary } from "./pack.ts";

const bundle = sync as unknown as Bundle;
/** A color rounded to what 8 bits per channel hold. */
const eightBit = (x: unknown): unknown =>
  Array.isArray(x)
    ? x.map(eightBit)
    : typeof x === "number" && x > 0 && x < 1
      ? Math.round(x * 255)
      : x && typeof x === "object"
        ? Object.fromEntries(
            Object.entries(x).map(([k, v]) => [k, eightBit(v)]),
          )
        : x;

test("the library packs small and unpacks to the same variables and text styles", () => {
  const packed = packLibrary(bundle);
  expect(packed.palette?.steps).toHaveLength(11);
  expect(JSON.stringify(packed).length).toBeLessThan(
    JSON.stringify(bundle).length / 3,
  );
  const back = unpackLibrary(JSON.parse(JSON.stringify(packed)));
  const withoutPath = (b: Bundle) =>
    b.variables.map(({ path: _path, ...v }) => eightBit(v));
  expect(withoutPath(back)).toEqual(withoutPath(bundle));
  expect(back.collections).toEqual(bundle.collections);
  expect(back.textStyles).toEqual(bundle.textStyles);
});

test("a page packs without loss, strings that look like references included", () => {
  const dir = path.join(import.meta.dirname, "../../content/pages");
  for (const file of fs.readdirSync(dir)) {
    const values = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    const packed = JSON.parse(JSON.stringify(pack([template, values])));
    expect(unpack(packed)).toEqual([template, values]);
  }
  const odd = { "~0": ["~", "~~x", "~1", "repeat me", "repeat me"] };
  expect(unpack(pack(odd))).toEqual(odd);
});
