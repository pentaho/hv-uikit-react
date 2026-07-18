/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import fs from "node:fs";
import path from "node:path";

import { deepMerge, readJsonFile } from "./utils.js";

export const SUPPORTED_LOCALES_FILE = "supported-locales.json";

/**
 * Reads a `supported-locales.json` file and returns its contents as an array
 * of locale strings. Returns an empty array if the file doesn't exist or
 * contains invalid data.
 */
export function readSupportedLocales(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = readJsonFile(filePath);
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
 * Computes the effective supported-locales list.
 *
 * Discovers all language directories from both sources (upstream shell and
 * local app). If the app provides a `supported-locales.json`, it acts as a
 * **filter**: only locales listed there are kept. Otherwise all discovered
 * locales are included.
 *
 * The result is always sorted alphabetically.
 *
 * Locales listed in the local manifest but without a matching language
 * directory are warned about and dropped.
 *
 * @param shellLocalesDir - The app-shell-ui locales directory (upstream).
 * @param appLocalesDir   - The app's locales directory (downstream / local).
 */
export function computeSupportedLocales(
  shellLocalesDir: string | undefined,
  appLocalesDir: string | undefined,
): string[] {
  // Collect all language directories that actually exist on disk
  const allDirs = new Set<string>();
  for (const dir of [shellLocalesDir, appLocalesDir]) {
    if (dir) {
      for (const lng of discoverLanguageDirs(dir)) {
        allDirs.add(lng);
      }
    }
  }

  // Determine if the app provides a supported-locales.json file.
  // Physical existence of the file is what matters — even if it's empty,
  // malformed, or contains no valid entries, it still acts as a filter
  // (resulting in an empty effective locale list).
  const manifestPath = appLocalesDir
    ? path.join(appLocalesDir, SUPPORTED_LOCALES_FILE)
    : undefined;
  const hasLocalManifest = manifestPath ? fs.existsSync(manifestPath) : false;

  // Read the manifest entries (empty if file is missing/invalid)
  const localManifest = manifestPath ? readSupportedLocales(manifestPath) : [];

  // Determine the effective set of locales
  let result: string[];

  if (hasLocalManifest) {
    // Filter: only keep unique locales from the manifest that have a directory.
    // If the manifest is empty/malformed, this correctly yields an empty list.
    result = [...new Set(localManifest)].filter((lng) => {
      if (allDirs.has(lng)) return true;
      console.warn(
        `[app-shell-locales] Locale "${lng}" is listed in ${SUPPORTED_LOCALES_FILE} but has no corresponding language directory — ignoring.`,
      );
      return false;
    });
  } else {
    // No local manifest → include everything discovered
    result = [...allDirs];
  }

  return result.toSorted();
}

/**
 * Recursively merges source directory into destination.
 * JSON files are deep-merged with destination keys taking priority.
 * Non-JSON files are skipped (locale bundles are always JSON).
 *
 * `supported-locales.json` is skipped — it is handled separately after the
 * merge so it can reflect the computed list.
 *
 * When `allowedLocales` is provided, only top-level directories whose name
 * is in the set are merged; all others are skipped. This allows the app's
 * `supported-locales.json` to act as a filter over upstream locale dirs.
 * Sub-directories (namespace folders) are always merged recursively.
 */
export function mergeDirs(
  src: string,
  dest: string,
  allowedLocales?: Set<string>,
) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // At the top level, skip locale dirs not in the allowed set
      if (allowedLocales && !allowedLocales.has(entry.name)) continue;
      // Sub-directories are always merged (no further filtering)
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
