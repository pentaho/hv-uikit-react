import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { PluginOption } from "vite";

import {
  computeSupportedLocales,
  deepMerge,
  mergeDirs,
  readJsonFile,
  SUPPORTED_LOCALES_FILE,
} from "./locales-utils.js";

/**
 * Resolves the app-shell-ui's locales directory path via its `./locales/*` export.
 */
function resolveAppShellUiLocales(): string | undefined {
  const require = createRequire(import.meta.url);
  try {
    // Resolve a known locale file via the ./locales/* export, then derive the directory
    const sampleFile =
      require.resolve("@hitachivantara/app-shell-ui/locales/en/appShell.json");
    // Go up two levels: en/appShell.json -> en -> locales
    const localesDir = path.resolve(sampleFile, "../..");
    if (fs.existsSync(localesDir) && fs.statSync(localesDir).isDirectory()) {
      return localesDir;
    }
  } catch {
    // app-shell-ui not installed or locales not available
  }
  return undefined;
}

/**
 * Vite plugin that handles app-shell locale files:
 * - In dev mode: serves merged locale files via middleware
 * - In build mode: deep-merges app-shell-ui locales into the output dist/locales
 *
 * Local locale files (from the app's public/locales/) always take priority.
 *
 * `supported-locales.json` is merged by taking the union of both arrays and
 * adding any language directories discovered during the merge.
 */
export default function copyAppShellLocales(): PluginOption {
  let resolvedOutDir: string | undefined;
  let isBuild = false;

  return {
    name: "vite-plugin-appshell-copy-locales",

    // Capture the resolved output directory from Vite's config
    configResolved(config) {
      resolvedOutDir = path.resolve(config.root, config.build.outDir);
      isBuild = config.command === "build";
    },

    // --- DEV MODE: serve merged locales via middleware ---
    configureServer(server) {
      const appShellUiLocalesDir = resolveAppShellUiLocales();

      server.middlewares.use((req, res, next) => {
        // Parse the pathname, stripping the Vite base and any query string
        // so locale requests work under non-root base paths (e.g. /myapp/).
        const base = server.config.base || "/";
        let pathname: string | undefined;
        try {
          pathname = new URL(req.url ?? "", "http://localhost").pathname;
        } catch {
          return next();
        }

        if (!pathname.startsWith(base)) return next();

        const relativePath = pathname.slice(base.length);

        // Handle supported-locales.json separately — it's an array, not a
        // key/value bundle, and must reflect the union of both sources plus
        // any language directories that exist on disk.
        if (relativePath === `locales/${SUPPORTED_LOCALES_FILE}`) {
          const localLocalesDir = path.resolve(
            server.config.root,
            "public/locales",
          );

          const merged = computeSupportedLocales(
            appShellUiLocalesDir,
            localLocalesDir,
          );

          if (merged.length === 0) {
            res.statusCode = 404;
            res.end();
            return;
          }

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(merged));
          return;
        }

        const match = relativePath.match(/^locales\/([^/]+)\/([^/]+\.json)$/);
        if (!match) return next();

        const [, lng, nsFile] = match;

        // Guard against path traversal (e.g. `..` segments)
        if (lng.includes("..") || nsFile.includes("..")) return next();

        const localLocalesBase = path.resolve(
          server.config.root,
          "public/locales",
        );
        const localPath = path.join(localLocalesBase, lng, nsFile);
        if (!localPath.startsWith(localLocalesBase + path.sep)) return next();

        const shellPath = appShellUiLocalesDir
          ? path.join(appShellUiLocalesDir, lng, nsFile)
          : undefined;
        if (
          shellPath &&
          !shellPath.startsWith(appShellUiLocalesDir + path.sep)
        ) {
          return next();
        }

        const localContent = fs.existsSync(localPath)
          ? (readJsonFile(localPath) as Record<string, unknown>)
          : undefined;
        const shellContent =
          shellPath && fs.existsSync(shellPath)
            ? (readJsonFile(shellPath) as Record<string, unknown>)
            : undefined;

        if (!localContent && !shellContent) {
          res.statusCode = 404;
          res.end();
          return;
        }

        // Deep merge: local overrides shell
        const merged =
          shellContent && localContent
            ? deepMerge(shellContent, localContent)
            : (localContent ?? shellContent);

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(merged));
      });
    },

    // --- BUILD MODE: merge app-shell-ui locales into dist ---
    closeBundle() {
      // Only write locale files during an actual build, not during dev/test.
      // Vitest creates a Vite pipeline with outDir set to a dummy
      // "dummy-non-existing-folder" that triggers closeBundle — without this
      // guard, locale files would be written to that folder on disk.
      if (!isBuild || !resolvedOutDir) return;

      const appShellUiLocales = resolveAppShellUiLocales();
      if (!appShellUiLocales) return;

      const targetLocales = path.resolve(resolvedOutDir, "locales");

      // Recursive merge: app-shell-ui files are merged into target,
      // with existing (local) keys taking priority in JSON files.
      // supported-locales.json is skipped during this step.
      mergeDirs(appShellUiLocales, targetLocales);

      // Compute the union of supported locales from both sources and from
      // the language directories that now exist in the merged output.
      const merged = computeSupportedLocales(appShellUiLocales, targetLocales);
      if (merged.length > 0) {
        fs.writeFileSync(
          path.join(targetLocales, SUPPORTED_LOCALES_FILE),
          `${JSON.stringify(merged)}\n`,
        );
      }
    },
  };
}
