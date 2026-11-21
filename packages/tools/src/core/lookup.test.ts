import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it, vi } from "vitest";

import { printLookup } from "../commands/lookup.js";
import { callTool, MCP_TOOLS } from "../commands/mcp.js";
import { answer, hookDeclaration, lookup, LookupError } from "./lookup.js";
import { checkSchema, MetadataError } from "./metadata.js";
import type { Component, Metadata } from "./metadata.js";

const dialog: Component = {
  name: "HvDialog",
  purpose: "A Dialog prompts for a response.",
  types: "dist/Dialog/Dialog.d.ts",
  props: [
    {
      name: "open",
      type: "boolean",
      required: false,
      description: "Current state.",
    },
  ],
  variantSemantics: [
    { name: "warning", description: "asks to review a risky step" },
    {
      name: "subtle",
      semanticMeaning: "secondary",
      description: "less weight",
    },
  ],
};
/** Twelve more components, so the list has more than one page. */
const others: Component[] = Array.from({ length: 12 }, (_, i) => ({
  name: `HvThing${String(i).padStart(2, "0")}`,
  purpose: `Thing ${i}.`,
}));
const metadata: Metadata = {
  schemaVersion: 1,
  version: "7.0.0",
  generatedAt: "",
  components: [dialog, ...others],
};

describe("lookup", () => {
  it("shows the designers' note, status and related components", () => {
    const tag: Component = {
      name: "HvTag",
      purpose: "A short label for a status or category.",
      note: {
        status: "beta",
        related: ["HvBadge"],
        rules: ["uikit/tag-label"],
        sections: [
          { title: "When to use", body: "- Categories people filter by." },
          { title: "Empty", body: "" },
        ],
      },
    };
    const text = lookup(
      { ...metadata, components: [tag] },
      { kind: "component", name: "tag" },
    );
    expect(text).toContain("Status: beta.");
    expect(text).toContain("## When to use\n\n- Categories people filter by.");
    expect(text).not.toContain("## Empty");
    expect(text).toContain("Related: HvBadge.");
    expect(text).toContain("Checked by lint: uikit/tag-label.");
    expect(
      lookup({ ...metadata, components: [tag] }, { kind: "components" }),
    ).toContain("- HvTag: A short label");
  });

  it("describes a component with its guidance", () => {
    const text = lookup(metadata, { kind: "component", name: "dialog" });
    expect(text).toContain("# HvDialog");
    expect(text).toContain(
      "Types: `node_modules/@pentaho/uikit-react-core/dist/Dialog/Dialog.d.ts`",
    );
    expect(text).toContain("- `open` (boolean): Current state.");
    expect(text).toContain('- "warning": asks to review a risky step');
    expect(text).toContain('- "subtle" (secondary): less weight');
  });

  it("lists every component, or a page of them", () => {
    const all = lookup(metadata, { kind: "components" });
    expect(all).toContain("(@pentaho/uikit-react-core@7.0.0): 13");
    expect(all).toContain("- HvDialog: A Dialog prompts");
    expect(all).not.toContain("More:");
    const first = lookup(metadata, { kind: "components", limit: 10 });
    expect(first).toContain(": 1-10 of 13");
    expect(first).toContain("More: offset 10.");
    const last = lookup(metadata, { kind: "components", offset: 10 });
    expect(last).toContain(": 11-13 of 13");
    expect(last).not.toContain("More:");
    expect(() => lookup(metadata, { kind: "components", limit: -1 })).toThrow(
      LookupError,
    );
  });

  it("finds a hook under the component whose guidance names it", () => {
    const withHook: Metadata = {
      ...metadata,
      components: [
        ...metadata.components,
        {
          name: "HvSnackbarProvider",
          purpose: "Call useHvSnackbar().",
        },
      ],
    };
    expect(
      lookup(withHook, { kind: "component", name: "useHvSnackbar" }),
    ).toMatch(
      /^> `useHvSnackbar` is a hook, not a component: its guidance is HvSnackbarProvider's/,
    );
  });

  it("suggests close names", () => {
    expect(() =>
      lookup(metadata, { kind: "component", name: "HvDialg" }),
    ).toThrow(/Did you mean: HvDialog/);
  });
});

describe("rule lookups read the UI Kit rule files as written", () => {
  it("lists every rule section", () => {
    const text = answer({ kind: "rules" });
    expect(text).toContain("- tokens/colors: Colors.");
    expect(text).toContain("- tokens/classes-and-css: Classes and css().");
    expect(text).toContain("- forms/fields-and-actions: Fields and actions.");
    expect(text).not.toContain("/introduction");
  });

  it("prints a section or a whole file as written", () => {
    const section = answer({ kind: "rule", id: "tokens/colors" });
    expect(section).toContain("# Colors");
    expect(section).toContain("Never raw hex, rgb, or named colors");
    expect(answer({ kind: "rule", id: "tokens" })).toMatch(/^# Token Rules/);
  });

  it("explains the lint rule a finding cites", () => {
    for (const id of ["uikit/raw-elements", "uikit(raw-elements)"])
      expect(answer({ kind: "rule", id })).toMatch(
        /^# uikit\/raw-elements\n[\s\S]*<button>/,
      );
  });

  it("suggests ids for an unknown rule", () => {
    expect(() => answer({ kind: "rule", id: "destructive" })).toThrow(
      /Did you mean: actions\/prevent-accidental-and-destructive-actions/,
    );
  });
});

describe("MCP", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "uikit-tools-mcp-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const metadataPath = path.join(dir, "metadata.json");
  writeFileSync(metadataPath, JSON.stringify(metadata));

  /** What the CLI prints for the same request. */
  function cli(request: Parameters<typeof printLookup>[0]) {
    const out: string[] = [];
    const spy = vi
      .spyOn(process.stdout, "write")
      .mockImplementation((chunk) => {
        out.push(String(chunk));
        return true;
      });
    printLookup(request, { metadata: metadataPath });
    spy.mockRestore();
    return out.join("").trimEnd();
  }

  it("offers one tool per lookup", () => {
    expect(MCP_TOOLS.map((t) => t.name)).toEqual([
      "list_components",
      "get_component",
      "list_rules",
      "get_rule",
      "find_tokens",
      "lint",
    ]);
  });

  it.each([
    [
      "get_component",
      { name: "HvDialog" },
      { kind: "component", name: "HvDialog" },
    ],
    ["list_components", {}, { kind: "components" }],
    [
      "list_components",
      { limit: 5, offset: 10 },
      { kind: "components", limit: 5, offset: 10 },
    ],
    ["list_rules", {}, { kind: "rules" }],
    [
      "get_rule",
      { id: "tokens/colors" },
      { kind: "rule", id: "tokens/colors" },
    ],
  ] as const)(
    "%s %o returns exactly what the CLI prints",
    (tool, args, request) => {
      const result = callTool(tool, args, { metadataPath });
      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toBe(cli(request));
    },
  );

  it("returns errors as tool results instead of throwing", () => {
    expect(
      callTool("get_component", { name: "HvNope" }, { metadataPath }).isError,
    ).toBe(true);
    expect(callTool("nope", {}, { metadataPath }).isError).toBe(true);
    expect(
      callTool("list_components", {}, { cwd: tmpdir() }).content[0].text,
    ).toMatch(/component metadata/);
  });
});

describe("token lookups read the installed theme's DTCG files", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "uikit-tools-tokens-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const color = (hex: string, note: object) => ({
    $type: "color",
    $value: { colorSpace: "srgb", components: [0, 0, 0], hex },
    ...note,
  });
  const primary = {
    $description: "The action color.",
    $extensions: {
      "pentaho.uikit": {
        code: "theme.colors.primary",
        use: ["field border on hover"],
        avoid: ["status meaning"],
      },
    },
  };
  writeFileSync(
    path.join(dir, "color.light.tokens.json"),
    JSON.stringify({ colors: { primary: color("#2563eb", primary) } }),
  );
  writeFileSync(
    path.join(dir, "color.dark.tokens.json"),
    JSON.stringify({ colors: { primary: color("#3b82f6", primary) } }),
  );
  writeFileSync(
    path.join(dir, "base.tokens.json"),
    JSON.stringify({
      space: {
        sm: {
          $type: "dimension",
          $value: { value: 16, unit: "px" },
          $description: "Gap between related items.",
        },
      },
    }),
  );
  const tokens = (query?: string) =>
    answer({ kind: "tokens", query }, { tokensPath: dir });

  it("shows a token's code, both modes, and what it is for", () => {
    const text = tokens("border");
    expect(text).toContain(
      "- `theme.colors.primary` (light #2563eb, dark #3b82f6): The action color.",
    );
    expect(text).toContain("Use for: field border on hover.");
    expect(text).toContain("Avoid: status meaning.");
    expect(text).not.toContain("space.sm");
  });

  it("lists every token without words, and fails on no match", () => {
    expect(tokens()).toContain("- `theme.space.sm` (16px): Gap between");
    expect(tokens("spacing")).toContain("theme.space.sm");
    expect(() => tokens("zzz")).toThrow(LookupError);
  });
});

describe("metadata format", () => {
  it("reads its own format, and says which package to upgrade otherwise", () => {
    expect(checkSchema(metadata, "m.json")).toBe(metadata);
    const older = { ...metadata, schemaVersion: undefined } as never;
    expect(() => checkSchema(older, "m.json")).toThrow(MetadataError);
    expect(() => checkSchema(older, "m.json")).toThrow(
      /Upgrade @pentaho\/uikit-react-core/,
    );
    expect(() =>
      checkSchema({ ...metadata, schemaVersion: 2 }, "m.json"),
    ).toThrow(/Upgrade @pentaho\/uikit-tools/);
  });
});

describe("hookDeclaration", () => {
  it("returns a hook's whole declaration from the declaration files under a folder", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "hooks-"));
    mkdirSync(path.join(dir, "hooks"));
    writeFileSync(
      path.join(dir, "hooks/useThing.d.ts"),
      "import x from 'y';\nexport declare const useThing: () => {\n    run: (a?: Map<string, number>) => void;\n};\nexport declare const other: 1;\n",
    );
    expect(hookDeclaration(dir, "useThing")).toEqual({
      text: "export declare const useThing: () => {\n    run: (a?: Map<string, number>) => void;\n};",
      file: "hooks/useThing.d.ts",
    });
    expect(hookDeclaration(dir, "useNone")).toBeUndefined();
    expect(
      hookDeclaration(path.join(dir, "missing"), "useThing"),
    ).toBeUndefined();
  });
});

describe("info on several components", () => {
  it("lists each one's props by name, pointing at the full lookup for their types", () => {
    const text = lookup(metadata, {
      kind: "component",
      name: "HvDialog",
      brief: true,
    });
    expect(text).toContain(
      "Props: `open` (types: `uikit-tools info HvDialog`).",
    );
    expect(text).not.toContain("## Props");
    expect(text).toContain("asks to review a risky step");
  });
});

describe("info leaves out what's said elsewhere, and points the way for names that aren't components", () => {
  it("says what to use for a name agents reach for that isn't a component", () => {
    expect(() =>
      lookup(metadata, { kind: "component", name: "HvKpi" }),
    ).toThrow("A KPI is a card, not a component");
    expect(() =>
      lookup(metadata, { kind: "component", name: "useHvData" }),
    ).toThrow("`useHvData` is `useHvTable`'s old name");
  });

  it("skips a state or variant the designers' note already names", () => {
    const noted: Component = {
      ...dialog,
      note: {
        related: [],
        sections: [
          { title: "Don't", body: "- Don't use `warning` for a routine step." },
        ],
      },
    };
    const text = lookup(
      { ...metadata, components: [noted] },
      { kind: "component", name: "HvDialog" },
    );
    expect(text).not.toContain('- "warning"');
    expect(text).toContain('- "subtle"');
  });
});
