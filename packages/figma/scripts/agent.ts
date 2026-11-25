// Writes the scripts an agent runs through Figma's MCP server (use_figma), after `vite build` bundled src/agent/agent.ts
// as dist/agent-core.js. use_figma takes at most 50,000 characters of code, so dist/agent/core.js stores the core in
// the file once (shared plugin data), and each task is a folder of numbered scripts, run in order: the first ones
// store the task's data, in slices; the last one runs the stored core on it, after checking both arrived unchanged,
// and returns the report. dist/agent/library/ makes the variables and text styles; dist/agent/pages/<page>/ draws one
// documentation page.
// Part of `npm run build`.
/* eslint-disable no-console -- command-line script */
import fs from "node:fs";
import path from "node:path";

import { pack, packLibrary } from "../src/agent/pack.ts";
import { keysOf, type LibraryJson } from "../src/code-connect/library.ts";
import { componentsIn, expand, type Values } from "../src/sync/pages.ts";
import type { Bundle } from "../src/sync/types.ts";

const ROOT = path.join(import.meta.dirname, "..");
const read = <T>(file: string) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8")) as T;
/** The core as one function's source: core.js declares it as plain code and stores its source (Function#toString
 * gives it back as written), so nothing in it needs escaping. */
const core = `function pentahoFigmaCore(figma) {\n${fs.readFileSync(path.join(ROOT, "dist/agent-core.js"), "utf8")}\nreturn pentahoFigma;\n}`;
const out = path.join(ROOT, "dist/agent");

/** use_figma's limit on a script's length, and the most of the data one script stores. */
const LIMIT = 50_000;
const SLICE = 20_000;
const NS = "pentaho_uikit";

/** FNV-1a over the data's characters: the last script checks the slices came through unchanged. */
const HASH = `(s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0; return h; }`;
// eslint-disable-next-line no-eval -- the same function the script runs, so the two can't disagree
const hash = (0, eval)(HASH) as (s: string) => number;

/** The scripts for one task: `call` names the core's function, `args` its arguments. */
function task(dir: string, call: string, args: unknown[]) {
  const data = JSON.stringify(args);
  const slices = Array.from(
    { length: Math.ceil(data.length / SLICE) },
    (_, i) => data.slice(i * SLICE, (i + 1) * SLICE),
  );
  const n = slices.length;
  const scripts = [
    ...slices.map(
      (slice, i) =>
        `figma.root.setSharedPluginData(${JSON.stringify(NS)}, "agent:${i + 1}", ${JSON.stringify(slice)});\nreturn "Stored ${i + 1} of ${n}: run the next script.";\n`,
    ),
    `const core = figma.root.getSharedPluginData(${JSON.stringify(NS)}, "core");
if ((${HASH})(core) !== ${hash(core)})
  throw new Error(core ? "The file has another build's core: run dist/agent/core.js again." : "Run dist/agent/core.js in this file first.");
const pentahoFigma = new Function("figma", "return (" + core + ")(figma)")(figma);
let data = "";
for (let i = 1; i <= ${n}; i++) {
  data += figma.root.getSharedPluginData(${JSON.stringify(NS)}, "agent:" + i);
  figma.root.setSharedPluginData(${JSON.stringify(NS)}, "agent:" + i, "");
}
if (!data) throw new Error("No data stored: run this task's scripts in order, from 1.");
if ((${HASH})(data) !== ${hash(data)})
  throw new Error("The stored data isn't what the scripts carry: run them again, unchanged, from 1.");
return await pentahoFigma.${call}(...JSON.parse(data));
`,
  ];
  fs.mkdirSync(dir, { recursive: true });
  scripts.forEach((script, i) => {
    if (script.length > LIMIT)
      throw new Error(
        `${dir} script ${i + 1}: ${script.length} characters, over use_figma's ${LIMIT}`,
      );
    fs.writeFileSync(
      path.join(dir, `${String(i + 1).padStart(2, "0")}.js`),
      script,
    );
  });
  return scripts.length;
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
// the core, stored once per file (and again after a rebuild): each task's last script runs it from there
const install = `${core}\nfigma.root.setSharedPluginData(${JSON.stringify(NS)}, "core", pentahoFigmaCore.toString());\nreturn "The core is stored: run the tasks' scripts.";\n`;
if (install.length > LIMIT)
  throw new Error(
    `core.js: ${install.length} characters, over use_figma's ${LIMIT}`,
  );
fs.writeFileSync(path.join(out, "core.js"), install);
const library = task(path.join(out, "library"), "library", [
  packLibrary(read<Bundle>("figma-sync.json")),
]);

const template = read<unknown>("content/page-template.json");
const keys = keysOf(read<LibraryJson>("code-connect/library.json"));
const names = fs
  .readdirSync(path.join(ROOT, "content/pages"))
  .filter((file) => file.endsWith(".json"))
  .toSorted();
for (const file of names) {
  const values = read<Values>(`content/pages/${file}`);
  const components = Object.fromEntries(
    componentsIn(expand(template, values)).map((name) => [name, keys[name]]),
  );
  task(path.join(out, "pages", file.replace(/\.json$/, "")), "page", [
    pack([template, values]),
    components,
  ]);
}
console.log(
  `Agent scripts: dist/agent/library/ (${library} scripts) and ${names.length} pages in dist/agent/pages/.`,
);
