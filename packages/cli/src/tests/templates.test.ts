import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const templates = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../templates",
);

/** A bare import's package: `@scope/name` or `name`, without the subpath. */
const packageOf = (specifier: string) =>
  specifier
    .split("/")
    .slice(0, specifier.startsWith("@") ? 2 : 1)
    .join("/");

const IMPORT = /(?:\bfrom\s+|\bimport\s*\(?\s*)["']([^"'./][^"']*)["']/g;

/** The packages the template's code and configs import, outside Node's own. */
function importsOf(dir: string) {
  const files = fs
    .readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter(
      (file) =>
        /\.(ts|tsx)$/.test(file) &&
        !file
          .split(path.sep)
          .some((part) => ["node_modules", "dist"].includes(part)),
    );
  const packages = new Set<string>();
  for (const file of files)
    for (const [, specifier] of fs
      .readFileSync(path.join(dir, file), "utf8")
      .matchAll(IMPORT))
      if (!specifier.startsWith("node:") && !specifier.startsWith("virtual:"))
        packages.add(packageOf(specifier));
  return [...packages].toSorted();
}

describe.each(["app", "vite", "plugin"])("templates/%s", (template) => {
  const dir = path.join(templates, template);
  const pkg = JSON.parse(
    fs.readFileSync(path.join(dir, "package.json"), "utf8"),
  ) as Record<string, Record<string, string> | undefined>;
  const declared = { ...pkg.dependencies, ...pkg.devDependencies };

  // in the repo every package resolves from the root node_modules; a created app has only what it declares
  it("declares every package its code imports", () => {
    expect(importsOf(dir).filter((name) => !(name in declared))).toEqual([]);
  });

  it("takes the UI Kit packages at the released versions", () => {
    const pentaho = Object.entries(declared).filter(([name]) =>
      name.startsWith("@pentaho/"),
    );
    expect(pentaho.filter(([, range]) => range !== "*")).toEqual([]);
  });
});
