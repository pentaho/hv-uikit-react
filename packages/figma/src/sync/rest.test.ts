// Figma's REST variables read as the plugin reads them, so a comparison from outside Figma plans like the plugin does.
import { expect, test } from "vitest";

import { planSync } from "../src/plugin/diff.ts";
import { currentOf, type LocalVariables } from "../src/plugin/rest.ts";
import type { Bundle } from "../src/sync/types.ts";

const LOCAL: LocalVariables = {
  meta: {
    variableCollections: {
      c1: {
        id: "c1",
        name: "Primitives",
        modes: [{ modeId: "m1", name: "Value" }],
      },
      c2: {
        id: "c2",
        name: "Color",
        modes: [
          { modeId: "l", name: "Light" },
          { modeId: "d", name: "Dark" },
        ],
      },
    },
    variables: {
      v1: {
        id: "v1",
        name: "blue/600",
        variableCollectionId: "c1",
        valuesByMode: { m1: { r: 0, g: 0, b: 1, a: 1 } },
        description: "",
        scopes: [],
        codeSyntax: {},
        remote: false,
      },
      v2: {
        id: "v2",
        name: "Primary/primary",
        variableCollectionId: "c2",
        valuesByMode: {
          l: { type: "VARIABLE_ALIAS", id: "v1" },
          d: { r: 1, g: 1, b: 1 },
        },
        description: "The &quot;action&quot; color.",
        scopes: ["SHAPE_FILL", "FRAME_FILL"],
        codeSyntax: { WEB: "var(--uikit-colors-primary)" },
        remote: false,
      },
      w1: {
        id: "w1",
        name: "fontWeights/bold",
        variableCollectionId: "c1",
        valuesByMode: { m1: 700 },
        description: "",
        resolvedType: "FLOAT",
        scopes: ["FONT_STYLE"],
        codeSyntax: {},
        remote: false,
      },
      v3: {
        id: "v3",
        name: "Other/remote",
        variableCollectionId: "c2",
        valuesByMode: {},
        description: "",
        scopes: [],
        codeSyntax: {},
        remote: true,
      },
    },
  },
};

const bundle = (light: string): Bundle => ({
  version: 1,
  collections: [],
  textStyles: [],
  variables: [
    {
      path: "colors.primary",
      collection: "Color",
      name: "Primary/primary",
      type: "COLOR",
      values: { Light: { alias: light }, Dark: { color: [1, 1, 1, 1] } },
      scopes: ["FRAME_FILL", "SHAPE_FILL"],
      code: "var(--uikit-colors-primary)",
      description: 'The "action" color.',
    },
  ],
});

test("REST variables: aliases by name, colors as the plugin writes them, scopes in any order, descriptions unescaped, remote ones left out", () => {
  const current = currentOf(LOCAL);
  expect(current.map((c) => `${c.collection}/${c.name}`)).toEqual([
    "Primitives/blue/600",
    "Color/Primary/primary",
    "Primitives/fontWeights/bold",
  ]);
  expect(
    current[2].fields.scopes,
    "REST's name for a number's weight scope",
  ).toBe("FONT_WEIGHT");

  expect(planSync(bundle("blue/600"), current).changes[0].action).toBe(
    "unchanged",
  );
  const differ = planSync(bundle("blue/700"), current).changes[0];
  expect(
    differ.action,
    "no baseline from REST: a difference, whoever made it",
  ).toBe("conflict");
  expect(differ.fields).toEqual([
    { field: "Light", code: "alias:blue/700", figma: "alias:blue/600" },
  ]);
});
