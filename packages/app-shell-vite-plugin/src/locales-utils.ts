import fs from "node:fs";
import path from "node:path";

export const SUPPORTED_LOCALES_FILE = "supported-locales.json";

/**
 * Deep merge two objects. `override` keys take priority over `base`.
 */
export function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      value != null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      result[key] != null &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Reads a `supported-locales.json` file and returns its contents as an array
 * of locale strings. Returns an empty array if the file doesn't exist or
 * contains invalid data.
 */
export function readSupportedLocales(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data: unknown = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (Array.isArray(data) && data.every((item) => typeof item === "string")) {
      return data;
    }
  } catch {
    // malformed JSON — treat as empty
  }
  return [];
}

/**
 * Returns the sorted, deduplicated list of language directory names found
 * directly inside `localesDir`.
 */
export function discoverLanguageDirs(localesDir: string): string[] {
  if (!fs.existsSync(localesDir)) return [];
  return fs
    .readdirSync(localesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .toSorted();
}

/**
 * Computes the merged supported-locales list respecting ordering:
 *
 * 1. Entries from the **app's** `supported-locales.json` (in their original order).
 * 2. Entries from the **shell's** `supported-locales.json` not already listed
 *    (in their original order).
 * 3. Any language directories discovered on disk that are not in either
 *    manifest (alphabetical order).
 *
 * @param shellLocalesDir - The app-shell-ui locales directory (lower priority).
 * @param appLocalesDir   - The app's locales directory (higher priority).
 */
export function computeSupportedLocales(
  shellLocalesDir: string | undefined,
  appLocalesDir: string | undefined,
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  const addUnique = (lng: string) => {
    if (!seen.has(lng)) {
      seen.add(lng);
      result.push(lng);
    }
  };

  // 1. App manifest entries first (highest priority order)
  if (appLocalesDir) {
    for (const lng of readSupportedLocales(
      path.join(appLocalesDir, SUPPORTED_LOCALES_FILE),
    )) {
      addUnique(lng);
    }
  }

  // 2. Shell manifest entries that weren't already listed
  if (shellLocalesDir) {
    for (const lng of readSupportedLocales(
      path.join(shellLocalesDir, SUPPORTED_LOCALES_FILE),
    )) {
      addUnique(lng);
    }
  }

  // 3. Discovered language directories not in either manifest (alphabetical)
  const discoveredDirs: string[] = [];
  for (const dir of [shellLocalesDir, appLocalesDir]) {
    if (dir) {
      for (const lng of discoverLanguageDirs(dir)) {
        if (!seen.has(lng)) discoveredDirs.push(lng);
      }
    }
  }
  // deduplicate and sort before appending
  for (const lng of [...new Set(discoveredDirs)].toSorted()) {
    addUnique(lng);
  }

  // Validate: warn and drop manifest entries without a matching language directory
  const allDirs = new Set<string>();
  for (const dir of [shellLocalesDir, appLocalesDir]) {
    if (dir) {
      for (const lng of discoverLanguageDirs(dir)) {
        allDirs.add(lng);
      }
    }
  }

  return result.filter((lng) => {
    if (allDirs.has(lng)) return true;
    console.warn(
      `[app-shell-locales] Locale "${lng}" is listed in ${SUPPORTED_LOCALES_FILE} but has no corresponding language directory — ignoring.`,
    );
    return false;
  });
}

/**
 * Parses a JSON file, wrapping parse errors with the file path for
 * actionable diagnostics.
 */
export function readJsonFile(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (cause) {
    throw new Error(
      `[app-shell-locales] Failed to parse ${filePath}: ${cause instanceof Error ? cause.message : cause}`,
      { cause },
    );
  }
}

/**
 * Recursively merges source directory into destination.
 * JSON files are deep-merged with destination keys taking priority.
 * Non-JSON files are skipped (locale bundles are always JSON).
 *
 * `supported-locales.json` is skipped — it is handled separately after the
 * merge so it can reflect the union of both sources plus any discovered
 * language directories.
 */
export function mergeDirs(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      mergeDirs(srcPath, destPath);
    } else if (entry.name === SUPPORTED_LOCALES_FILE) {
      // Handled after the full merge — skip here.
    } else if (!entry.name.endsWith(".json")) {
      // Skip non-JSON files (e.g. .json.js build artifacts)
    } else if (fs.existsSync(destPath)) {
      // Deep merge: local (dest) keys win over app-shell-ui (src) keys
      const srcContent = readJsonFile(srcPath) as Record<string, unknown>;
      const destContent = readJsonFile(destPath) as Record<string, unknown>;
      const merged = deepMerge(srcContent, destContent);
      fs.writeFileSync(destPath, JSON.stringify(merged, null, 2));
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
