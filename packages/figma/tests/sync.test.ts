// The sync file (figma-sync.json, which CI keeps current): the library's variables in its structure, and what the
// plugin plans from it.
import { expect, test } from "vitest";

import sync from "../figma-sync.json";
import { planSync } from "../src/plugin/diff.ts";
import { rgba, variables, type Tokens } from "../src/sync/bundle.ts";
import type { Bundle } from "../src/sync/types.ts";

const bundle = sync as unknown as Bundle;
const find = (path: string) => bundle.variables.find((v) => v.path === path)!;

test("the collections, colors pointing at primitives, hidden primitives, code syntax and notes", () => {
  const count = (c: string) =>
    bundle.variables.filter((v) => v.collection === c).length;
  expect(bundle.collections.map((c) => c.name)).toEqual([
    "Primitives",
    "Color",
    "Spacing",
    "Radius",
    "Typography",
  ]);
  expect(count("Primitives")).toBeGreaterThan(200);
  expect(
    bundle.variables
      .filter((v) => v.collection === "Primitives")
      .every((v) => !v.scopes.length),
  ).toBe(true);

  const primary = find("colors.primary");
  expect(primary.name).toBe("Primary/primary");
  expect(primary.values).toEqual({
    Light: { alias: "blue/600" },
    Dark: { alias: "blue/500" },
  });
  expect(primary.code).toBe("var(--uikit-colors-primary)");
  expect(primary.description).toMatch(/action color/);
  expect(
    find("colors.borderSubtle").scopes,
    "a border is a stroke, whatever its suffix",
  ).toEqual(["STROKE_COLOR"]);
  expect(find("colors.primarySubtle").scopes).toEqual([
    "FRAME_FILL",
    "SHAPE_FILL",
  ]);
  expect(
    find("colors.textDimmed").scopes,
    "an outline color, despite its name",
  ).toEqual(["STROKE_COLOR"]);
  expect(find("colors.cat1").scopes).toEqual(["SHAPE_FILL", "STROKE_COLOR"]);
  expect(find("colors.dimmer").scopes, "only feeds other colors").toEqual([]);
  expect(
    find("components.Avatar.blue.text"),
    "a component color: a theme color as an alias of its variable, a palette one of its primitive",
  ).toMatchObject({
    name: "Avatar/blue/text",
    values: {
      Light: { alias: "Primary/primaryStrong" },
      Dark: { alias: "blue/300" },
    },
  });
  expect(find("components.bgInput").name).toBe("Surfaces/bgInput");
  expect(find("space.xs")).toMatchObject({
    collection: "Spacing",
    type: "FLOAT",
    values: { Value: { value: 8 } },
  });
});

test("the text styles: px line heights, letter spacing as a percentage of the size", () => {
  expect(bundle.textStyles.find((s) => s.name === "Typography/title4")).toEqual(
    {
      name: "Typography/title4",
      family: "Inter",
      weight: 600,
      size: 16,
      lineHeight: 24,
      letterSpacing: 0.194,
    },
  );
});

test("an empty file: the plugin plans every variable as a create", () => {
  const plan = planSync(bundle, []);
  expect(plan.changes.length).toBe(bundle.variables.length);
  expect(plan.changes.every((c) => c.action === "create")).toBe(true);
});

test("a color with alpha, or one no single primitive has, is written as its value", () => {
  const color = (hex: string, alpha?: number) => ({
    $type: "color",
    $value: {
      colorSpace: "srgb",
      components: [],
      hex,
      ...(alpha !== undefined && { alpha }),
    },
  });
  const tokens: Tokens = {
    base: {},
    light: { a: color("#2563eb", 0.08), b: color("#ffffff") },
    dark: {},
    palette: {
      blue: { 600: "#2563EB" },
      white: { 0: "#FFFFFF" },
      neutral: { 0: "#FFFFFF" },
    },
    components: [],
  };
  const [, , , a, b] = variables(tokens);
  expect(a.values.Light).toEqual({ color: rgba("#2563eb", 0.08) });
  expect(b.values.Light, "two primitives have it: no alias").toEqual({
    color: [1, 1, 1, 1],
  });
});
