// Compares the Figma library's variables with the code's, read-only, through Figma's REST API (Enterprise): what a
// sync would create or update, what already matches, what differs and what only Figma has. Writes nothing.
// The code is the committed figma-sync.json. Needs FIGMA_TOKEN, a token with file_variables:read. In GitHub Actions
// each mismatch is also a ::warning:: annotation; `--strict` exits 1 when there is any.
// Usage: npm run compare [-- --file <key>] [-- --strict] (the library's file by default)
/* eslint-disable no-console -- command-line script */
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

import { planSync } from "../src/plugin/diff.ts";
import { currentOf, type LocalVariables } from "../src/plugin/rest.ts";
import type { Bundle } from "../src/sync/types.ts";

const ROOT = path.join(import.meta.dirname, "..");
const read = <T>(file: string) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8")) as T;
/** The UI Kit's Figma library. */
const LIBRARY = read<{ file: { key: string } }>("code-connect/library.json")
  .file.key;
const SHOWN = 15;

async function localVariables(file: string): Promise<LocalVariables> {
  const token = process.env.FIGMA_TOKEN;
  if (!token)
    throw new Error("Set FIGMA_TOKEN: a Figma token with file_variables:read.");

  const res = await fetch(
    `https://api.figma.com/v1/files/${file}/variables/local`,
    {
      headers: { "X-Figma-Token": token },
    },
  );
  if (!res.ok)
    throw new Error(
      `Figma answered ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  return (await res.json()) as LocalVariables;
}

const CI = !!process.env.GITHUB_ACTIONS;

const list = (title: string, lines: string[]) => {
  if (!lines.length) return;
  console.log(`\n${title} (${lines.length}):`);
  for (const l of lines.slice(0, SHOWN)) console.log(`  ${l}`);
  if (lines.length > SHOWN) console.log(`  … ${lines.length - SHOWN} more`);
  if (CI)
    for (const l of lines)
      console.log(`::warning title=Figma library: ${title}::${l}`);
};

async function main() {
  const { values } = parseArgs({
    options: {
      file: { type: "string", default: LIBRARY },
      strict: { type: "boolean", default: false },
    },
  });
  const bundle = read<Bundle>("figma-sync.json");
  const plan = planSync(bundle, currentOf(await localVariables(values.file!)));
  const of = (action: string) =>
    plan.changes.filter((c) => c.action === action);

  console.log(
    `${bundle.variables.length} variables in the code, compared with file ${values.file}:`,
  );
  console.log(
    `  ${of("unchanged").length} match, ${of("update").length} to update, ${of("conflict").length} differ, ${of("create").length} missing.`,
  );
  const fieldsOf = (c: (typeof plan.changes)[number]) =>
    c.fields
      .map(
        (f) =>
          `${f.field}: code ${f.code || "none"}, Figma ${f.figma || "none"}`,
      )
      .join("; ");
  list(
    "To update (the code's description, scopes or code syntax)",
    of("update").map((c) => `${c.path}: ${fieldsOf(c)}`),
  );
  list(
    "Differ",
    of("conflict").map((c) => `${c.path}: ${fieldsOf(c)}`),
  );
  list(
    "Missing in Figma",
    of("create").map((c) => c.path),
  );
  list("Only in Figma", plan.notInCode);

  const mismatches =
    plan.changes.length - of("unchanged").length + plan.notInCode.length;
  if (values.strict && mismatches) process.exitCode = 1;
}

await main();
