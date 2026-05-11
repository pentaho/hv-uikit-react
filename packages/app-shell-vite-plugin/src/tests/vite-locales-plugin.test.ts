import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  computeSupportedLocales,
  mergeDirs,
  SUPPORTED_LOCALES_FILE,
} from "../locales-utils";

// #region test setup

let tmpDir: string;

function mkLocalesDir(
  base: string,
  structure: Record<string, string | Record<string, unknown>>,
) {
  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = path.join(base, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(
      fullPath,
      typeof content === "string" ? content : JSON.stringify(content),
    );
  }
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "locales-plugin-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// #endregion

describe("vite-locales-plugin helpers", () => {
  describe("computeSupportedLocales", () => {
    it("should use app manifest as a filter over upstream locales", () => {
      const shellDir = path.join(tmpDir, "shell");
      const appDir = path.join(tmpDir, "app");

      mkLocalesDir(shellDir, {
        "supported-locales.json": JSON.stringify(["en", "fr", "de"]),
        "en/appShell.json": JSON.stringify({}),
        "fr/appShell.json": JSON.stringify({}),
        "de/appShell.json": JSON.stringify({}),
      });
      mkLocalesDir(appDir, {
        "supported-locales.json": JSON.stringify(["pt", "en"]),
        "pt/app.json": JSON.stringify({}),
        "en/app.json": JSON.stringify({}),
      });

      // App manifest acts as filter: only pt and en are included (sorted)
      const result = computeSupportedLocales(shellDir, appDir);
      expect(result).toEqual(["en", "pt"]);
    });

    it("should use shell order when app has no manifest", () => {
      const shellDir = path.join(tmpDir, "shell");
      const appDir = path.join(tmpDir, "app");

      mkLocalesDir(shellDir, {
        "supported-locales.json": JSON.stringify(["fr", "en", "de"]),
        "fr/appShell.json": JSON.stringify({}),
        "en/appShell.json": JSON.stringify({}),
        "de/appShell.json": JSON.stringify({}),
      });
      fs.mkdirSync(appDir, { recursive: true });

      const result = computeSupportedLocales(shellDir, appDir);
      expect(result).toEqual(["de", "en", "fr"]);
    });

    it("should append discovered dirs alphabetically after manifest entries", () => {
      const shellDir = path.join(tmpDir, "shell");
      mkLocalesDir(shellDir, {
        "supported-locales.json": JSON.stringify(["en"]),
        "en/common.json": JSON.stringify({ hello: "Hello" }),
        "ja/common.json": JSON.stringify({ hello: "こんにちは" }),
      });

      // en from manifest, then ja discovered alphabetically
      const result = computeSupportedLocales(shellDir, undefined);
      expect(result).toEqual(["en", "ja"]);
    });

    it("should discover dirs from both sources alphabetically", () => {
      const shellDir = path.join(tmpDir, "shell");
      const appDir = path.join(tmpDir, "app");

      mkLocalesDir(shellDir, {
        "supported-locales.json": JSON.stringify(["en"]),
        "en/common.json": JSON.stringify({}),
        "zh-CN/common.json": JSON.stringify({}),
      });
      mkLocalesDir(appDir, {
        "fr/common.json": JSON.stringify({}),
        "de/common.json": JSON.stringify({}),
      });

      // No app manifest → all discovered dirs, sorted alphabetically
      const result = computeSupportedLocales(shellDir, appDir);
      expect(result).toEqual(["de", "en", "fr", "zh-CN"]);
    });

    it("should handle missing manifests gracefully", () => {
      const dir = path.join(tmpDir, "no-manifest");
      mkLocalesDir(dir, {
        "en/common.json": JSON.stringify({}),
        "pt/common.json": JSON.stringify({}),
      });

      const result = computeSupportedLocales(undefined, dir);
      expect(result).toEqual(["en", "pt"]);
    });

    it("should handle both dirs undefined", () => {
      const result = computeSupportedLocales(undefined, undefined);
      expect(result).toEqual([]);
    });

    it("should handle malformed manifest JSON", () => {
      const dir = path.join(tmpDir, "bad");
      mkLocalesDir(dir, {
        "supported-locales.json": "not valid json{",
        "en/common.json": JSON.stringify({}),
      });

      const result = computeSupportedLocales(dir, undefined);
      expect(result).toEqual(["en"]);
    });

    it("should handle manifest with non-string entries", () => {
      const dir = path.join(tmpDir, "bad-entries");
      mkLocalesDir(dir, {
        "supported-locales.json": JSON.stringify(["en", 42, null]),
        "fr/common.json": JSON.stringify({}),
      });

      // Array has non-string elements → treated as invalid, only dirs used
      const result = computeSupportedLocales(dir, undefined);
      expect(result).toEqual(["fr"]);
    });

    it("should warn and drop manifest entries without a language directory", () => {
      const shellDir = path.join(tmpDir, "shell");
      const appDir = path.join(tmpDir, "app");

      mkLocalesDir(shellDir, {
        "supported-locales.json": JSON.stringify(["en", "fr", "de"]),
        "en/appShell.json": JSON.stringify({}),
        // fr and de have no directories
      });
      mkLocalesDir(appDir, {
        "supported-locales.json": JSON.stringify(["pt", "en"]),
        "en/app.json": JSON.stringify({}),
        // pt has no directory
      });

      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = computeSupportedLocales(shellDir, appDir);

      // pt has no directory — only en passes the filter
      expect(result).toEqual(["en"]);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('"pt"'));

      warnSpy.mockRestore();
    });
  });

  describe("mergeDirs with supported-locales.json", () => {
    it("should skip supported-locales.json during merge", () => {
      const src = path.join(tmpDir, "src");
      const dest = path.join(tmpDir, "dest");

      mkLocalesDir(src, {
        "supported-locales.json": JSON.stringify(["en", "fr"]),
        "en/common.json": JSON.stringify({ shell: "Shell" }),
      });
      mkLocalesDir(dest, {
        "supported-locales.json": JSON.stringify(["en"]),
        "en/common.json": JSON.stringify({ app: "App" }),
      });

      mergeDirs(src, dest);

      // supported-locales.json should be untouched (still the app's version)
      const manifest = JSON.parse(
        fs.readFileSync(path.join(dest, "supported-locales.json"), "utf-8"),
      );
      expect(manifest).toEqual(["en"]);

      // But regular JSON files should be deep-merged
      const bundle = JSON.parse(
        fs.readFileSync(path.join(dest, "en/common.json"), "utf-8"),
      );
      expect(bundle).toEqual({ shell: "Shell", app: "App" });
    });

    it("should not copy supported-locales.json when only in source", () => {
      const src = path.join(tmpDir, "src");
      const dest = path.join(tmpDir, "dest");

      mkLocalesDir(src, {
        "supported-locales.json": JSON.stringify(["en", "fr"]),
        "en/common.json": JSON.stringify({ shell: "Shell" }),
      });
      fs.mkdirSync(dest, { recursive: true });

      mergeDirs(src, dest);

      // supported-locales.json should NOT have been copied
      expect(fs.existsSync(path.join(dest, "supported-locales.json"))).toBe(
        false,
      );

      // But the bundle should have been copied
      expect(fs.existsSync(path.join(dest, "en/common.json"))).toBe(true);
    });

    it("should throw an actionable error for malformed locale JSON", () => {
      const src = path.join(tmpDir, "src");
      const dest = path.join(tmpDir, "dest");

      mkLocalesDir(src, {
        "en/common.json": "{ broken json",
      });
      mkLocalesDir(dest, {
        "en/common.json": JSON.stringify({ app: "App" }),
      });

      expect(() => mergeDirs(src, dest)).toThrow(
        /Failed to parse.*en\/common\.json/,
      );
    });
  });

  describe("full build flow", () => {
    it("should produce correct supported-locales.json after merge (with filter)", () => {
      const shellLocales = path.join(tmpDir, "shell-locales");
      const targetLocales = path.join(tmpDir, "dist/locales");

      // Shell has en, fr, de (in that order)
      mkLocalesDir(shellLocales, {
        "supported-locales.json": JSON.stringify(["en", "fr", "de"]),
        "en/appShell.json": JSON.stringify({ title: "Shell" }),
        "fr/appShell.json": JSON.stringify({ title: "Coquille" }),
        "de/appShell.json": JSON.stringify({ title: "Schale" }),
      });

      // App has pt, en (in that order — app controls the filter)
      mkLocalesDir(targetLocales, {
        "supported-locales.json": JSON.stringify(["pt", "en"]),
        "en/common.json": JSON.stringify({ hello: "Hello" }),
        "pt/common.json": JSON.stringify({ hello: "Olá" }),
      });

      // Simulate closeBundle logic: compute filter, merge, re-compute
      const supportedLocales = computeSupportedLocales(
        shellLocales,
        targetLocales,
      );
      const allowedLocales = new Set(supportedLocales);
      mergeDirs(shellLocales, targetLocales, allowedLocales);
      const finalLocales = computeSupportedLocales(shellLocales, targetLocales);
      fs.writeFileSync(
        path.join(targetLocales, SUPPORTED_LOCALES_FILE),
        `${JSON.stringify(finalLocales)}\n`,
      );

      // Verify the manifest: only the locales listed in the app's filter (sorted)
      const result = JSON.parse(
        fs.readFileSync(
          path.join(targetLocales, SUPPORTED_LOCALES_FILE),
          "utf-8",
        ),
      );
      expect(result).toEqual(["en", "pt"]);

      // Verify only filtered locale bundles were merged
      expect(fs.existsSync(path.join(targetLocales, "en/appShell.json"))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(targetLocales, "en/common.json"))).toBe(
        true,
      );
      // fr and de should NOT be merged (filtered out)
      expect(fs.existsSync(path.join(targetLocales, "fr/appShell.json"))).toBe(
        false,
      );
      expect(fs.existsSync(path.join(targetLocales, "de/appShell.json"))).toBe(
        false,
      );
    });

    it("should work when neither source has a manifest", () => {
      const shellLocales = path.join(tmpDir, "shell-locales");
      const targetLocales = path.join(tmpDir, "dist/locales");

      mkLocalesDir(shellLocales, {
        "en/appShell.json": JSON.stringify({ title: "Shell" }),
      });
      mkLocalesDir(targetLocales, {
        "en/common.json": JSON.stringify({ hello: "Hello" }),
        "pt/common.json": JSON.stringify({ hello: "Olá" }),
      });

      mergeDirs(shellLocales, targetLocales);
      const merged = computeSupportedLocales(shellLocales, targetLocales);

      // No manifests → all discovered directories, alphabetical
      expect(merged).toEqual(["en", "pt"]);
    });

    it("should filter upstream dirs when app has manifest", () => {
      const shellLocales = path.join(tmpDir, "shell-locales");
      const targetLocales = path.join(tmpDir, "dist/locales");

      mkLocalesDir(shellLocales, {
        "supported-locales.json": JSON.stringify(["en"]),
        "en/appShell.json": JSON.stringify({ title: "Shell" }),
        "ja/appShell.json": JSON.stringify({ title: "シェル" }),
      });
      mkLocalesDir(targetLocales, {
        "supported-locales.json": JSON.stringify(["pt", "en"]),
        "pt/common.json": JSON.stringify({}),
        "en/common.json": JSON.stringify({}),
      });

      // App manifest filters to pt and en — ja is not included
      const supportedLocales = computeSupportedLocales(
        shellLocales,
        targetLocales,
      );
      const allowedLocales = new Set(supportedLocales);
      mergeDirs(shellLocales, targetLocales, allowedLocales);
      const finalLocales = computeSupportedLocales(shellLocales, targetLocales);

      expect(finalLocales).toEqual(["en", "pt"]);
      // ja should NOT have been merged
      expect(fs.existsSync(path.join(targetLocales, "ja"))).toBe(false);
    });
  });
});
