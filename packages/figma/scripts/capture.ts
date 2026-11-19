// Captures each Figma library component's properties into code-connect/properties.json, what the Code Connect
// generator maps. Reads the library, never writes to it. Needs a Figma token with file_content:read in FIGMA_TOKEN;
// CI runs it when that secret is set and fails when properties.json changes (a component's properties drifted).
// Usage: npm run capture
/* eslint-disable no-console -- command-line script */
import fs from "node:fs";
import path from "node:path";

import {
  propertiesOf,
  type FigmaFile,
  type LibraryJson,
} from "../src/code-connect/library.ts";
import { emit, json } from "../src/emit.ts";

const DIR = path.join(import.meta.dirname, "../code-connect");
const library = JSON.parse(
  fs.readFileSync(path.join(DIR, "library.json"), "utf8"),
) as LibraryJson;

async function figmaFile(key: string): Promise<FigmaFile> {
  const token = process.env.FIGMA_TOKEN;
  if (!token)
    throw new Error("Set FIGMA_TOKEN: a Figma token with file_content:read.");

  const res = await fetch(`https://api.figma.com/v1/files/${key}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok)
    throw new Error(
      `Figma answered ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  return (await res.json()) as FigmaFile;
}

const changed = await emit(DIR, {
  "properties.json": json(propertiesOf(await figmaFile(library.file.key))),
});
console.log(
  changed.length ? `Wrote: ${changed.join(", ")}` : "The capture is current.",
);
