import * as fs from "node:fs";
import * as path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";

// ─── Constants ───────────────────────────────────────────────────────────────

/**
 * Default custom export condition used internally by workspace packages
 * to resolve TypeScript source during development.
 *
 * This condition must never leak into published artifacts because external
 * consumers would not be able to resolve it.
 */
const DEFAULT_SOURCE_CONDITION = "@pentaho-apps:source";

/**
 * Runtime-relevant package.json fields copied into dist output.
 *
 * All other fields are intentionally excluded.
 */
const INCLUDED_FIELDS = [
  "name",
  "version",
  "type",
  "license",
  "description",
  "dependencies",
  "peerDependencies",
  "peerDependenciesMeta",
  "optionalDependencies",
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Node.js PACKAGE_TARGET_RESOLVE-compatible export target.
 *
 * https://nodejs.org/api/packages.html#exports
 */
type ExportTarget = string | null | ExportTarget[] | ExportConditions;

interface ExportConditions {
  [condition: string]: ExportTarget;
}

/**
 * Canonical subpath exports map.
 */
type ExportMap = Record<string, ExportTarget>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Reads and parses a JSON file.
 *
 * Returns `undefined` if the file does not exist or cannot be parsed.
 */
function readJsonFile(filePath: string): Record<string, unknown> | undefined {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return undefined;
  }
}

/**
 * Removes the build output prefix from an export path.
 *
 * Example:
 *   ./dist/index.js → ./index.js
 */
function stripDistPrefix(prefix: string, value: string): string {
  return value.startsWith(prefix) ? `./${value.slice(prefix.length)}` : value;
}

/**
 * Transforms a package export target for dist/package.json.
 *
 * Processing rules:
 *
 * Strings:
 * - Must resolve inside build.outDir
 * - build.outDir prefix is stripped
 *
 * Objects:
 * - Removes dev-only source condition
 * - Recursively transforms nested targets
 * - Removed if empty after transformation
 *
 * Arrays:
 * - Node fallback arrays are eagerly collapsed to the first
 *   valid non-null target because import maps do not support
 *   Node conditional fallback resolution semantics.
 *
 * null:
 * - Preserved as explicit export exclusion
 *
 * undefined:
 * - Internal sentinel meaning "omit this entry"
 */
function transformExportTargetForDist(
  target: ExportTarget,
  distPrefix: string,
  sourceCondition: string,
): ExportTarget | undefined {
  // Explicit export exclusion must be preserved
  if (target === null) {
    return null;
  }

  // Direct export path
  if (typeof target === "string") {
    const stripped = stripDistPrefix(distPrefix, target);

    // Ignore paths outside dist output
    return stripped === target ? undefined : stripped;
  }

  // Fallback array
  if (Array.isArray(target)) {
    for (const entry of target) {
      const resolved = transformExportTargetForDist(
        entry,
        distPrefix,
        sourceCondition,
      );

      if (resolved !== undefined && resolved !== null) {
        return resolved;
      }
    }

    return undefined;
  }

  // Conditional exports object
  const result: ExportMap = {};

  for (const [condition, value] of Object.entries(target)) {
    // Remove workspace-only source condition
    if (condition === sourceCondition) {
      continue;
    }

    const transformed = transformExportTargetForDist(
      value,
      distPrefix,
      sourceCondition,
    );

    // Omitted targets disappear entirely
    if (transformed === undefined) {
      continue;
    }

    result[condition] = transformed;
  }

  return Object.keys(result).length === 0 ? undefined : result;
}

/**
 * Normalizes package exports into canonical subpath map form.
 *
 * Converts:
 *
 *   "exports": "./index.js"
 *   → { ".": "./index.js" }
 *
 *   "exports": { "import": "./index.js" }
 *   → { ".": { "import": "./index.js" } }
 *
 * Leaves already-normalized subpath maps untouched.
 */
function normalizeExportsToSubpathMap(exportsField?: ExportTarget): ExportMap {
  if (exportsField == null) {
    throw new Error(`[App Shell]: package.json is missing "exports".`);
  }

  // Sugar form:
  // "exports": "./index.js"
  // "exports": ["./a.js", "./b.js"]
  if (typeof exportsField === "string" || Array.isArray(exportsField)) {
    return { ".": exportsField };
  }

  const keys = Object.keys(exportsField);

  // Already a subpath map
  if (keys.every((key) => key.startsWith("."))) {
    return exportsField;
  }

  // Root conditional exports sugar
  return { ".": exportsField };
}

/**
 * Appends standard metadata exports required at runtime.
 */
function appendStandardExports(exportsMap: ExportMap, outDir: string): void {
  exportsMap["./package.json"] = "./package.json";
  exportsMap["./app-shell.config.json"] = "./app-shell.config.json";

  if (fs.existsSync(path.join(outDir, "locales"))) {
    exportsMap["./locales/*"] = "./locales/*";
  }
}

// ─── Dist package.json generation ────────────────────────────────────────────

/**
 * Generates dist/package.json from the source package.
 *
 * The generated package:
 * - strips dev-only export conditions
 * - rewrites export paths relative to dist/
 * - preserves explicit null exclusions
 * - supports nested conditional exports
 */
function generateDistPackageJson(
  root: string,
  outDir: string,
  buildOutDir: string,
  sourceCondition: string,
): boolean {
  const pkgPath = path.join(root, "package.json");

  const pkg = readJsonFile(pkgPath);

  if (!pkg || !fs.existsSync(outDir)) {
    return false;
  }

  const rawExports = pkg.exports as ExportTarget | undefined;

  const distPrefix = `./${buildOutDir}/`;

  const transformedExports = transformExportTargetForDist(
    normalizeExportsToSubpathMap(rawExports),
    distPrefix,
    sourceCondition,
  );

  /**
   * The entire exports tree may collapse after removing dev-only
   * conditions and invalid dist targets.
   */
  if (transformedExports === undefined) {
    throw new Error(
      `[App Shell] ${pkg.name}: exports resolved to empty after transformation.`,
    );
  }

  appendStandardExports(transformedExports as ExportMap, outDir);

  const distPkg: Record<string, unknown> = {};

  // Copy runtime-relevant fields
  for (const field of INCLUDED_FIELDS) {
    if (pkg[field] != null) {
      distPkg[field] = pkg[field];
    }
  }

  distPkg.exports = transformedExports;

  fs.writeFileSync(
    path.join(outDir, "package.json"),
    JSON.stringify(distPkg, null, 2) + "\n",
  );

  console.info(
    `[App Shell] Generated ${buildOutDir}/package.json for ${pkg.name}`,
  );

  return true;
}

// ─── Plugin ──────────────────────────────────────────────────────────────────

/**
 * Generates a cleaned dist/package.json during Vite builds.
 */
export default function distPackageJsonPlugin(
  root?: string,
  sourceCondition = DEFAULT_SOURCE_CONDITION,
): Plugin {
  let config: ResolvedConfig;

  return {
    name: "app-shell:vite-dist-package-json-plugin",

    apply: "build",

    configResolved(resolved) {
      config = resolved;
    },

    closeBundle() {
      const packageRoot = root ?? config.root;

      const outDir = path.resolve(packageRoot, config.build.outDir);

      generateDistPackageJson(
        packageRoot,
        outDir,
        config.build.outDir,
        sourceCondition,
      );
    },
  };
}
