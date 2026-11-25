// The Code Connect generator: the library it reads, the rules, and what it refuses.
import { expect, test } from "vitest";

import { codeConnectFiles, Overrides, type UiKit } from "./generator.ts";
import {
  libraryOf,
  type Library,
  type LibraryJson,
  type Properties,
} from "./library.ts";
import { figmaProps } from "./map.ts";
import { ruled } from "./rules.ts";

const PROPERTIES: Properties = {
  Tag: {
    Label: { type: "TEXT" },
    Color: { type: "VARIANT", values: ["default", "positive"] },
    State: { type: "VARIANT", values: ["Default", "Hover", "Disabled"] },
    Icon: { type: "INSTANCE_SWAP" },
  },
};

const LIBRARY: LibraryJson = {
  file: { key: "FILE", name: "Library" },
  components: {
    HvTag: [{ name: "Tag", type: "set", key: "k1", node: "2:1" }],
    HvBadge: [{ name: "Badge", type: "component", key: "k2", node: "5:2" }],
  },
  icons: { Plus: { key: "k3", node: "4:1" } },
};
const library: Library = libraryOf(LIBRARY, PROPERTIES);

test("the library: every component library.json lists, with its UI Kit component, sorted by name", () => {
  expect(library.components.map((c) => [c.name, c.element])).toEqual([
    ["Badge", "HvBadge"],
    ["Icon/Plus", "Plus"],
    ["Tag", "HvTag"],
  ]);
  expect(library.components[2].properties).toBe(PROPERTIES.Tag);
});

const CODE = new Map([
  ["label", "string"],
  ["color", "string"],
  ["disabled", "boolean"],
]);
const KIT: UiKit = {
  module: "@pentaho/uikit-react-core",
  iconModule: "@phosphor-icons/react",
  props: (name) => (["HvTag", "HvBadge"].includes(name) ? CODE : undefined),
  sources: {},
};

test("the rules: a property by its name and values; what they can't read is left out", () => {
  const tag = library.components.find((c) => c.name === "Tag")!;
  expect(ruled(figmaProps(tag), CODE).properties).toEqual({
    Label: { text: "label" },
    Color: { values: { default: {}, positive: { color: "positive" } } },
    State: { values: { Default: {}, Hover: {}, Disabled: { disabled: true } } },
  });
});

test("the rules: a boolean only for a boolean prop; Show x shows x; one unnamed text goes to children", () => {
  const props = [
    { name: "Selected", type: "BOOLEAN", options: ["true", "false"] },
    { name: "Icon", type: "BOOLEAN", options: ["true", "false"] },
    { name: "Show title", type: "BOOLEAN", options: ["true", "false"] },
    { name: "Text", type: "TEXT", options: [] },
  ];
  const code = new Map([
    ["selected", "boolean"],
    ["icon", "ReactNode"],
  ]);
  expect(ruled(props, code).properties).toEqual({
    Selected: { values: { true: { selected: true }, false: {} } },
    "Show title": { shows: { true: ["title"], false: [] } },
    Text: { text: "children" },
  });
  const two = [...props, { name: "Caption", type: "TEXT", options: [] }];
  expect(
    ruled(two, code).properties.Text,
    "two unnamed texts: neither goes to children",
  ).toBeUndefined();
});

test("the generator: an icon by its name; a property no rule or override maps stops it, named", () => {
  expect(() => codeConnectFiles(library, { components: {} }, KIT)).toThrow(
    /Tag: Figma property "Icon" is not mapped/,
  );

  const overrides = {
    components: {
      Tag: { properties: { Icon: { figmaOnly: "drawn in Figma only" } } },
    },
  };
  const files = codeConnectFiles(library, overrides, KIT);
  expect(Object.keys(files).toSorted()).toEqual([
    "Badge.figma.ts",
    "IconPlus.figma.ts",
    "Tag.figma.ts",
  ]);
  expect(files["IconPlus.figma.ts"]).toMatch(
    /import \{ Plus \} from \\"@phosphor-icons\/react\\"/,
  );
  expect(files["Tag.figma.ts"]).toMatch(
    /\/\/ url=https:\/\/www\.figma\.com\/design\/FILE\?node-id=2-1/,
  );
  expect(files["Tag.figma.ts"]).toMatch(/<HvTag\$\{attr\("label", label\)\}/);
});

test("the generator: an override over the rules (a combined property replaces its parts); what it refuses", () => {
  const combined = {
    values: Object.fromEntries(
      ["default", "positive"].flatMap((c) =>
        ["Default", "Hover", "Disabled"].map((s) => [
          `${c} + ${s}`,
          s === "Disabled" ? { disabled: true } : {},
        ]),
      ),
    ),
  };
  const overrides = Overrides.parse({
    components: {
      Tag: {
        properties: {
          "Color + State": combined,
          Icon: { figmaOnly: "drawn only" },
        },
      },
    },
  });
  expect(codeConnectFiles(library, overrides, KIT)["Tag.figma.ts"]).not.toMatch(
    /"positive": "positive"/,
  );

  const stale = Overrides.parse({
    components: { ...overrides.components, Gone: { properties: {} } },
  });
  expect(() => codeConnectFiles(library, stale, KIT)).toThrow(
    /Gone: in overrides, not in the library/,
  );
  const elsewhere = Overrides.parse({
    components: { ...overrides.components, Badge: { element: "HvChip" } },
  });
  expect(() => codeConnectFiles(library, elsewhere, KIT)).toThrow(
    /Badge: HvChip is not a UI Kit component/,
  );
  const twice: Library = {
    ...library,
    components: [
      ...library.components,
      { ...library.components[0], id: "9:9" },
    ],
  };
  expect(() => codeConnectFiles(twice, overrides, KIT)).toThrow(
    /Badge.figma.ts: made twice/,
  );
});
