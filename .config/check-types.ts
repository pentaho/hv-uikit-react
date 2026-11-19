/**
 * Checks the published type declarations the way apps consume them. Needs built packages (`npm run build`).
 *
 * 1. Every package's `dist`: each relative import in a `.d.ts` has its `.js` extension (see `dts.ts`).
 * 2. A fresh app outside the repo installs the packed styles, utils, shared and core, and type-checks a page
 *    under `moduleResolution` bundler and nodenext, with React 18 and 19 types, with `skipLibCheck` off (so the
 *    UI's own declarations are checked too). The page has `@ts-expect-error` lines that only hold when the types resolve (not `any`).
 *
 * Usage: node .config/check-types.ts [--keep]
 */
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const keep = process.argv.includes("--keep");
const PACKED = ["styles", "utils", "shared", "core"];
const PEERS = [
  "react@18.3.1",
  "react-dom@18.3.1",
  "@emotion/react@11.14.0",
  "@emotion/styled@11.14.0",
  "@mui/material@7.0.2",
  "@mui/utils@7.0.2",
];
const REACT_TYPES = ["18.3.12", "19.1.0"];
const RELATIVE =
  /(?:\bfrom\s+|\bimport\s*\(\s*)["'](\.{1,2}(?:\/[^"']*)?)["']/g;

const run = (cmd: string, args: string[], cwd: string) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

const failures: string[] = [];

/** The UI Kit's own type errors, and the page's, in the app; other libraries' are theirs. */
function typeCheck(tsc: string, app: string, resolution: string) {
  const args = [
    "--noEmit",
    "--strict",
    "--jsx",
    "react-jsx",
    "--target",
    "es2022",
    "--module",
    resolution === "bundler" ? "esnext" : "nodenext",
    "--moduleResolution",
    resolution,
    "--skipLibCheck",
    "false",
    "src/App.tsx",
  ];
  let out = "";
  try {
    run(tsc, args, app);
  } catch (error) {
    out = String((error as { stdout?: string }).stdout);
  }
  return out
    .split("\n")
    .filter(
      (l) =>
        /error TS/.test(l) && (l.startsWith("src/") || l.includes("@pentaho/")),
    );
}

// 1. extensions in every package's declarations
for (const pkg of readdirSync(path.join(repo, "packages"))) {
  const dist = path.join(repo, "packages", pkg, "dist");
  let files: string[] = [];
  try {
    files = readdirSync(dist, { recursive: true }).filter(
      (f): f is string => typeof f === "string" && f.endsWith(".d.ts"),
    );
  } catch {
    continue;
  }
  for (const file of files) {
    const text = readFileSync(path.join(dist, file), "utf8");
    for (const [, spec] of text.matchAll(RELATIVE)) {
      if (!spec.endsWith(".js"))
        failures.push(`${pkg}/dist/${file}: import "${spec}" has no .js`);
    }
  }
}
console.info(
  `${failures.length ? "✗" : "✓"} relative imports in every package's .d.ts end in .js`,
);

// 2. an app outside the repo
const app = mkdtempSync(path.join(tmpdir(), "uikit-types-"));
try {
  const packs = path.join(app, "packs");
  mkdirSync(packs);
  mkdirSync(path.join(app, "src"));
  const tarballs = PACKED.map(
    (p) =>
      JSON.parse(
        run(
          "npm",
          [
            "pack",
            "-w",
            `packages/${p}`,
            "--pack-destination",
            packs,
            "--json",
          ],
          repo,
        ),
      )[0].filename,
  ).map((f) => `./packs/${f}`);
  writeFileSync(
    path.join(app, "package.json"),
    JSON.stringify({ name: "types-app", private: true, type: "module" }),
  );
  writeFileSync(
    path.join(app, "src/App.tsx"),
    `import { HvButton, HvDialog, theme, type HvButtonProps } from "@pentaho/uikit-react-core";

export const variant: HvButtonProps["variant"] = "primary";
// @ts-expect-error not a Button variant: holds only when the types resolve
export const wrong: HvButtonProps["variant"] = "nope";
export const space: string = theme.space.md;

export const App = () => (
  <HvDialog open>
    <HvButton variant="primarySubtle">Save</HvButton>
    {/* @ts-expect-error not a Button variant */}
    <HvButton variant="nope">Save</HvButton>
  </HvDialog>
);
`,
  );
  const tsc = path.join(repo, "node_modules/.bin/tsc");

  for (const reactTypes of REACT_TYPES) {
    run(
      "npm",
      [
        "install",
        "--no-audit",
        "--no-fund",
        "--legacy-peer-deps",
        ...tarballs,
        ...PEERS,
        `@types/react@${reactTypes}`,
      ],
      app,
    );
    for (const resolution of ["bundler", "nodenext"]) {
      const label = `@types/react ${reactTypes}, ${resolution}`;
      const errors = typeCheck(tsc, app, resolution);
      console.info(`${errors.length ? "✗" : "✓"} an app type-checks: ${label}`);
      failures.push(...errors.map((l) => `${label}: ${l}`));
    }
  }
} finally {
  if (keep) console.info(`App kept in ${app}`);
  else rmSync(app, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`\n${failures.join("\n")}`);
  process.exitCode = 1;
}
