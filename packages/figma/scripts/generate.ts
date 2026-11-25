// Writes figma-sync.json (the variables and text styles the agent writes) and code-connect/generated/ (the Code
// Connect templates) from the repository's own data: the theme's DTCG tokens and palette (@pentaho/uikit-styles,
// built), the components' props (@pentaho/uikit-react-core's dist/component-metadata.json, built) and this package's
// code-connect/ (library.json, properties.json, overrides.json). `--check` writes nothing and exits 1 when a committed
// file isn't what the inputs make (CI runs it). Usage: npm run generate [-- --check]
/* eslint-disable no-console -- command-line script */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { palette } from "@pentaho/uikit-styles";

import { avatarColors, inputBg } from "../../core/src/utils/componentColors.ts";
import {
  codeConnectFiles,
  Overrides,
  type UiKit,
} from "../src/code-connect/generator.ts";
import {
  libraryOf,
  type LibraryJson,
  type Properties,
} from "../src/code-connect/library.ts";
import type { CodeProps } from "../src/code-connect/rules.ts";
import { emit, json } from "../src/emit.ts";
import {
  COLLECTIONS,
  textStyles,
  variables,
  type Group,
  type Tokens,
} from "../src/sync/bundle.ts";
import type { Bundle } from "../src/sync/types.ts";

const ROOT = path.join(import.meta.dirname, "..");
const CORE = path.dirname(
  fileURLToPath(import.meta.resolve("@pentaho/uikit-react-core/package.json")),
);
const SOURCE_URL =
  "https://github.com/pentaho/hv-uikit-react/blob/master/packages/core";

const read = <T>(file: string): T =>
  JSON.parse(fs.readFileSync(file, "utf8")) as T;
const token = <T>(name: string) =>
  read<T>(
    fileURLToPath(import.meta.resolve(`@pentaho/uikit-styles/tokens/${name}`)),
  );

function tokens(): Tokens {
  const base = token<Record<string, Group>>("base.tokens.json");
  const light = token<{ colors: Group }>("color.light.tokens.json").colors;
  const dark = token<{ colors: Group }>("color.dark.tokens.json").colors;
  return {
    base,
    light,
    dark,
    palette: palette as Tokens["palette"],
    components: componentColors(),
  };
}

/** The colors components use that aren't theme tokens (core's utils/componentColors). */
function componentColors(): Tokens["components"] {
  const NOTE = "A component color, not a theme token.";
  return [
    {
      key: "bgInput",
      values: inputBg,
      scopes: ["FRAME_FILL", "SHAPE_FILL"],
      description: `HvBaseInput's field fill. ${NOTE}`,
    },
    ...Object.entries(avatarColors).flatMap(([color, { text, bg }]) => [
      {
        key: `Avatar/${color}/text`,
        values: text,
        scopes: ["SHAPE_FILL", "TEXT_FILL"],
        description: `HvAvatar color="${color}" text. ${NOTE}`,
      },
      {
        key: `Avatar/${color}/bg`,
        values: bg,
        scopes: ["FRAME_FILL", "SHAPE_FILL"],
        description: `HvAvatar color="${color}" fill. ${NOTE}`,
      },
    ]),
  ];
}

function syncFile(): Bundle {
  const t = tokens();
  return {
    version: 1,
    collections: COLLECTIONS,
    variables: variables(t),
    textStyles: textStyles(t),
  };
}

/** The UI Kit as the Code Connect generator knows it: each component's props and source, from its metadata. */
function uiKit(): UiKit {
  type Meta = {
    name: string;
    types?: string;
    props?: { name: string; type: string }[];
  };
  const { components } = read<{ components: Meta[] }>(
    path.join(CORE, "dist/component-metadata.json"),
  );
  const byName = new Map(components.map((c) => [c.name, c]));
  const props = (name: string): CodeProps | undefined => {
    const c = byName.get(name);
    return c && new Map((c.props ?? []).map((p) => [p.name, p.type]));
  };
  const sources = components.flatMap((c) => {
    const source = c.types?.replace(/^dist\/(.*)\.d\.ts$/, "src/$1.tsx");
    return source ? [[c.name, `${SOURCE_URL}/${source}`]] : [];
  });
  const module = read<{ name: string }>(path.join(CORE, "package.json")).name;
  return {
    module,
    iconModule: "@phosphor-icons/react",
    props,
    sources: Object.fromEntries(sources),
  };
}

async function main() {
  const check = process.argv.includes("--check");
  const library = read<LibraryJson>(
    path.join(ROOT, "code-connect/library.json"),
  );
  const properties = read<Properties>(
    path.join(ROOT, "code-connect/properties.json"),
  );
  const overrides = Overrides.parse(
    read(path.join(ROOT, "code-connect/overrides.json")),
  );

  const templates = codeConnectFiles(
    libraryOf(library, properties),
    overrides,
    uiKit(),
  );
  const changed = [
    ...(await emit(ROOT, { "figma-sync.json": json(syncFile()) }, { check })),
    ...(
      await emit(path.join(ROOT, "code-connect/generated"), templates, {
        check,
        prune: true,
      })
    ).map((f) => `code-connect/generated/${f}`),
  ];

  if (!changed.length)
    return console.log(
      `figma-sync.json and ${Object.keys(templates).length} templates are current.`,
    );
  console.log(
    `${check ? "Stale (run npm run generate -w packages/figma)" : "Wrote"}: ${changed.join(", ")}`,
  );
  if (check) process.exitCode = 1;
}

await main();
