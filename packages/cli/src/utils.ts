import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { styleText } from "node:util";

const here = path.dirname(fileURLToPath(import.meta.url));

/** The package's folder: `src/..` when run from source, `dist/..` once built. */
export const PACKAGE_DIR = path.resolve(here, "..");

/** Running from the repository (its sources are here), not from a published package. */
const IN_REPO = fs.existsSync(path.join(PACKAGE_DIR, "src"));

/** The templates: the repository's `templates/` workspaces, or the copy `prepack` puts in the package. */
const TEMPLATES_DIR = IN_REPO
  ? path.resolve(PACKAGE_DIR, "../../templates")
  : path.join(PACKAGE_DIR, "templates");

/** `help link` → `HelpLink` */
export const toPascalCase = (text: string) =>
  (text.match(/[a-zA-Z0-9]+/g) ?? [])
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join("");

/** `AssetInventory` → `asset-inventory` */
export const toKebabCase = (text: string) =>
  text
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

/** `My App` or `myApp` → `my-app`: an app's folder and package name. */
export const toPackageName = (name: string) =>
  toKebabCase(name)
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/** `AssetInventory` → `Asset Inventory` */
export const toWords = (text: string) =>
  text.replace(/([a-z])([A-Z])/g, "$1 $2");

/** The package manager running this CLI (`npm create`, `pnpm dlx`…), npm when unknown. */
export const packageManager = () =>
  process.env.npm_config_user_agent?.split("/")[0] || "npm";

/** A command that runs a package's installed binary with `pm`, never downloading it. */
export const runBin = (pm: string, command: string) =>
  ({
    npm: `npx --no-install ${command}`,
    pnpm: `pnpm exec ${command}`,
    yarn: `yarn ${command}`,
    bun: `bunx --no-install ${command}`,
  })[pm] ?? `npx --no-install ${command}`;

/** Whether to color output: a terminal, without NO_COLOR, and not a dumb one. */
const COLOR =
  Boolean(process.stdout.isTTY) &&
  !process.env.NO_COLOR &&
  process.env.TERM !== "dumb";

/** Text in a color for the terminal; plain otherwise. */
export const styled = (
  format: Parameters<typeof styleText>[0],
  text: string,
) => (COLOR ? styleText(format, text) : text);

/** What an install, build or package leaves in a template's folder, never copied into an app. */
const NOT_COPIED = new Set(["node_modules", "dist"]);
const notCopied = (file: string) =>
  NOT_COPIED.has(path.basename(file)) || /\.(tsbuildinfo|zip)$/.test(file);

/** The `@pentaho/*` packages' versions: from the repository's packages, or as `prepack` recorded them. */
function pentahoVersions(): Record<string, string> {
  if (!IN_REPO)
    return JSON.parse(
      fs.readFileSync(path.join(TEMPLATES_DIR, "versions.json"), "utf8"),
    ) as Record<string, string>;
  const packages = path.resolve(PACKAGE_DIR, "..");
  return Object.fromEntries(
    fs
      .readdirSync(packages)
      .map((dir) => path.join(packages, dir, "package.json"))
      .filter((file) => fs.existsSync(file))
      .map((file) => JSON.parse(fs.readFileSync(file, "utf8")))
      .map((pkg: { name: string; version: string }) => [pkg.name, pkg.version]),
  );
}

/**
 * Copies a template into `target`: its `.gitignore` back from `_gitignore` (npm drops .gitignore files from
 * packages), and its `@pentaho/*` dependencies, `*` in the repository, set to the released versions.
 */
export function copyTemplate(template: string, target: string, name: string) {
  fs.cpSync(path.join(TEMPLATES_DIR, template), target, {
    recursive: true,
    filter: (source) => !notCopied(source),
  });
  const ignore = path.join(target, "_gitignore");
  if (fs.existsSync(ignore))
    fs.renameSync(ignore, path.join(target, ".gitignore"));

  // in the repository, a template's lint config reaches the root's node_modules; in an app, its own
  editFile(target, ".oxlintrc.json", (text) =>
    text.replaceAll("../../node_modules/", "./node_modules/"),
  );

  const versions = pentahoVersions();
  editFile(target, "package.json", (text) => {
    const pkg = JSON.parse(text) as Record<string, any>;
    pkg.name = name;
    for (const deps of [pkg.dependencies, pkg.devDependencies])
      for (const dep of Object.keys(deps ?? {}))
        if (deps[dep] === "*" && dep.startsWith("@pentaho/")) {
          if (!versions[dep]) throw new Error(`No version for ${dep}`);
          deps[dep] = `^${versions[dep]}`;
        }
    return `${JSON.stringify(pkg, null, 2)}\n`;
  });
}

/** Rewrites a file in `dir` through `edit`. */
export function editFile(
  dir: string,
  file: string,
  edit: (text: string) => string,
) {
  const target = path.join(dir, file);
  fs.writeFileSync(target, edit(fs.readFileSync(target, "utf8")));
}

/** A value as TypeScript source: object keys unquoted where they can be, two-space indents. */
export function toSource(value: unknown, indent = ""): string {
  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return `[\n${value.map((item) => `${inner}${toSource(item, inner)},`).join("\n")}\n${indent}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const key = (k: string) =>
      /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
    return `{\n${entries.map(([k, v]) => `${inner}${key(k)}: ${toSource(v, inner)},`).join("\n")}\n${indent}}`;
  }
  return JSON.stringify(value);
}

/** A JS string literal, quoted as Prettier writes it: double quotes, or single ones when that escapes fewer quotes. */
export const jsString = (value: string) =>
  value.split('"').length > value.split("'").length
    ? `'${value.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`
    : JSON.stringify(value);

/** Text for an HTML page, with its markup characters escaped. */
export const htmlText = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
