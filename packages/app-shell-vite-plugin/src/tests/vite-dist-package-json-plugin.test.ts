import type { ResolvedConfig } from "vite";
import { beforeEach, describe, expect, it, vi } from "vitest";

const existsSyncMock = vi.fn();
const readFileSyncMock = vi.fn();
const writeFileSyncMock = vi.fn();

vi.mock("node:fs", () => ({
  default: {
    existsSync: (...args: unknown[]) => existsSyncMock(...args),
    readFileSync: (...args: unknown[]) => readFileSyncMock(...args),
    writeFileSync: (...args: unknown[]) => writeFileSyncMock(...args),
  },
  existsSync: (...args: unknown[]) => existsSyncMock(...args),
  readFileSync: (...args: unknown[]) => readFileSyncMock(...args),
  writeFileSync: (...args: unknown[]) => writeFileSyncMock(...args),
}));

vi.mock("node:path", () => ({
  default: {
    join: (...paths: string[]) => paths.join("/"),
    resolve: (...paths: string[]) => paths.join("/"),
  },
  join: (...paths: string[]) => paths.join("/"),
  resolve: (...paths: string[]) => paths.join("/"),
}));

// Must import after vi.mock calls
const { default: distPackageJsonPlugin } =
  await import("../vite-dist-package-json-plugin");

const consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createPlugin(root?: string, sourceCondition = SOURCE_CONDITION) {
  const plugin = distPackageJsonPlugin(root, sourceCondition);

  const config = {
    root: "/project",
    build: { outDir: "dist" },
  } as unknown as ResolvedConfig;

  (plugin as any).configResolved(config);

  return plugin;
}

function callCloseBundle(plugin: ReturnType<typeof distPackageJsonPlugin>) {
  (plugin as any).closeBundle();
}

function writtenPackageJson(): Record<string, unknown> {
  const [, content] = writeFileSyncMock.mock.calls[0];
  return JSON.parse(content as string);
}

// ─── Fixtures ────────────────────────────────────────────────────────────────

const SOURCE_CONDITION = "@acme:source";

/** Shared library package with full exports */
const SHARED_PKG = {
  name: "@acme/shared-lib",
  version: "1.2.3",
  type: "module",
  license: "MIT",
  description: "Shared library components",
  exports: {
    ".": {
      "@acme:source": "./src/index.ts",
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
    },
    "./*": {
      "@acme:source": "./src/*",
      default: "./dist/*",
    },
    "./hooks": {
      "@acme:source": "./src/hooks/index.ts",
      types: "./dist/hooks/index.d.ts",
      import: "./dist/hooks/index.js",
    },
  },
  dependencies: {
    "@acme/services": "^2.0.0",
    react: "^18.2.0",
  },
  peerDependencies: {
    "react-dom": "^18.2.0",
  },
  optionalDependencies: {
    "@acme/core-shared": "*",
  },
  devDependencies: {
    vitest: "^3.0.0",
  },
  scripts: {
    build: "vite build",
  },
  private: false,
};

/** App package — no exports field */
const APP_PKG = {
  name: "@acme/my-app",
  version: "0.1.0",
  type: "module",
  description: "My Application",
  dependencies: {
    "@acme/shared-lib": "*",
    react: "^18.2.0",
  },
  peerDependencies: {
    "react-dom": "^18.2.0",
  },
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("vite-dist-package-json-plugin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // region Plugin metadata
  describe("plugin metadata", () => {
    it("should have correct plugin name", () => {
      const plugin = distPackageJsonPlugin();

      expect(plugin.name).toBe("app-shell:vite-dist-package-json-plugin");
    });

    it("should only apply to build", () => {
      const plugin = distPackageJsonPlugin();

      expect(plugin.apply).toBe("build");
    });
  });
  // endregion

  // region No-op scenarios
  describe("no-op scenarios", () => {
    it("should skip when source package.json does not exist", () => {
      readFileSyncMock.mockImplementation(() => {
        throw new Error("ENOENT: no such file or directory");
      });

      const plugin = createPlugin();

      callCloseBundle(plugin);

      expect(writeFileSyncMock).not.toHaveBeenCalled();
    });

    it("should skip when output directory does not exist", () => {
      existsSyncMock.mockReturnValue(false);
      readFileSyncMock.mockReturnValue(JSON.stringify(APP_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      expect(writeFileSyncMock).not.toHaveBeenCalled();
    });
  });
  // endregion

  // region Identity fields
  describe("identity fields", () => {
    it("should include name, version, type, license, and description", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      expect(result.name).toBe(SHARED_PKG.name);
      expect(result.version).toBe(SHARED_PKG.version);
      expect(result.type).toBe(SHARED_PKG.type);
      expect(result.license).toBe(SHARED_PKG.license);
      expect(result.description).toBe(SHARED_PKG.description);
    });

    it("should omit identity fields that are absent in source", () => {
      const minimalPkg = {
        name: "minimal",
        version: "1.0.0",
        exports: {
          ".": "./dist/index.js",
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(minimalPkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      expect(result.name).toBe("minimal");
      expect(result.version).toBe("1.0.0");

      expect(result).not.toHaveProperty("type");
      expect(result).not.toHaveProperty("license");
      expect(result).not.toHaveProperty("description");
    });
  });
  // endregion

  // region Excluded fields
  describe("excluded fields", () => {
    it("should exclude dev-time fields", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      expect(result).not.toHaveProperty("scripts");
      expect(result).not.toHaveProperty("devDependencies");
      expect(result).not.toHaveProperty("publishConfig");
      expect(result).not.toHaveProperty("private");
      expect(result).not.toHaveProperty("files");
      expect(result).not.toHaveProperty("workspaces");
      expect(result).not.toHaveProperty("sideEffects");
      expect(result).not.toHaveProperty("main");
      expect(result).not.toHaveProperty("types");
      expect(result).not.toHaveProperty("typings");
    });
  });
  // endregion

  // region Exports transformation
  describe("exports transformation", () => {
    it("should strip build.outDir prefix from export paths", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      const dotExport = exports["."] as Record<string, string>;

      expect(dotExport.import).toBe("./index.js");
      expect(dotExport.types).toBe("./index.d.ts");
    });

    it("should strip source condition from exports", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      const dotExport = exports["."] as Record<string, string>;

      expect(dotExport).not.toHaveProperty("@acme:source");
    });

    it("should strip custom source condition when provided", () => {
      const pkg = {
        ...APP_PKG,
        exports: {
          ".": {
            "custom:source": "./src/index.ts",
            import: "./dist/index.js",
          },
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin(undefined, "custom:source");

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      const dotExport = exports["."] as Record<string, string>;

      expect(dotExport).not.toHaveProperty("custom:source");
      expect(dotExport.import).toBe("./index.js");
    });

    it("should always include package.json export", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["./package.json"]).toBe("./package.json");
    });

    it("should always include app-shell.config.json export", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["./app-shell.config.json"]).toBe(
        "./app-shell.config.json",
      );
    });

    it("should include locales export when locales directory exists", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["./locales/*"]).toBe("./locales/*");
    });

    it("should omit locales export when locales directory does not exist", () => {
      existsSyncMock.mockImplementation((p: string) => !p.endsWith("locales"));
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports).not.toHaveProperty("./locales/*");
    });

    it("should handle string export values with prefix stripping", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          "./utils": "./dist/utils.js",
          "./styles": "./dist/styles.css",
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["./utils"]).toBe("./utils.js");
      expect(exports["./styles"]).toBe("./styles.css");
    });

    it("should handle wildcard exports with prefix stripping", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      const wildcardExport = exports["./*"] as Record<string, string>;

      expect(wildcardExport.default).toBe("./*");
    });

    it("should throw when package has no exports field", () => {
      const pkg = {
        name: "@acme/my-app",
        version: "0.1.0",
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      expect(() => callCloseBundle(plugin)).toThrow(/missing "exports"/);
    });

    it("should throw when all exports resolve to empty after transformation", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          ".": {
            [SOURCE_CONDITION]: "./src/index.ts",
          },
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      expect(() => callCloseBundle(plugin)).toThrow(
        /exports resolved to empty/,
      );
    });

    it("should handle string shorthand exports (sugar for root export)", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: "./dist/index.js",
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["."]).toBe("./index.js");
    });

    it("should flatten array fallback exports to first valid dist target", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          ".": ["./src/index.ts", "./dist/index.mjs", "./dist/index.js"],
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["."]).toBe("./index.mjs");
    });

    it("should handle conditions-only object (sugar for root export)", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          import: "./dist/index.js",
          require: "./dist/index.cjs",
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      const rootExport = exports["."] as Record<string, string>;

      expect(rootExport.import).toBe("./index.js");
      expect(rootExport.require).toBe("./index.cjs");
    });

    it("should preserve explicit null targets (excluded subpaths)", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          ".": { import: "./dist/index.js" },
          "./internal": null,
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["./internal"]).toBeNull();
    });

    it("should filter conditions object where all values resolve to null", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          ".": { import: "./dist/index.js" },
          "./excluded": {
            "@acme:source": "./src/excluded.ts",
          },
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      // Entry omitted because all conditions became invalid after transformation
      expect(exports["./excluded"]).toBeUndefined();
    });

    it("should preserve nested conditional exports", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          ".": {
            node: {
              import: "./dist/node.mjs",
              require: "./dist/node.cjs",
            },
            default: "./dist/index.js",
          },
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["."]).toEqual({
        node: {
          import: "./node.mjs",
          require: "./node.cjs",
        },
        default: "./index.js",
      });
    });

    it("should strip nested source conditions", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          ".": {
            node: {
              "@acme:source": "./src/node.ts",
              import: "./dist/node.mjs",
            },
          },
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["."]).toEqual({
        node: {
          import: "./node.mjs",
        },
      });
    });

    it("should omit nested condition objects that become empty", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          ".": {
            node: {
              [SOURCE_CONDITION]: "./src/node.ts",
            },
          },
          "./utils": "./dist/utils.js",
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports).not.toHaveProperty(["."]);
    });

    it("should preserve explicit nested null conditions", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          ".": {
            browser: null,
            import: "./dist/index.js",
          },
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["."]).toEqual({
        browser: null,
        import: "./index.js",
      });
    });

    it("should not overwrite existing explicit wildcard exports", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          "./*": "./dist/custom/*",
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports["./*"]).toBe("./custom/*");
    });
  });
  // endregion

  // region Dependency fields
  describe("dependency fields", () => {
    it("should include dependencies and peerDependencies", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      expect(result.dependencies).toEqual(SHARED_PKG.dependencies);
      expect(result.peerDependencies).toEqual(SHARED_PKG.peerDependencies);
    });

    it("should include optionalDependencies when present", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      expect(result.optionalDependencies).toEqual(
        SHARED_PKG.optionalDependencies,
      );
    });

    it("should omit dependency fields when absent in source", () => {
      const minimalPkg = {
        name: "minimal",
        version: "1.0.0",
        exports: {
          ".": "./dist/index.js",
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(minimalPkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      expect(result).not.toHaveProperty("dependencies");
      expect(result).not.toHaveProperty("peerDependencies");
      expect(result).not.toHaveProperty("peerDependenciesMeta");
      expect(result).not.toHaveProperty("optionalDependencies");
    });
  });
  // endregion

  // region Output file
  describe("output file", () => {
    it("should write to outDir/package.json", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      expect(writeFileSyncMock).toHaveBeenCalledWith(
        "/project/dist/package.json",
        expect.any(String),
      );
    });

    it("should write formatted JSON with trailing newline", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const [, content] = writeFileSyncMock.mock.calls[0];

      expect(content).toMatch(/^\{[\s\S]*\}\n$/);
      expect(content).toContain('  "name"');
    });

    it("should log the generated file path", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining("dist/package.json"),
      );
    });
  });
  // endregion

  // region Custom root
  describe("custom root override", () => {
    it("should use provided root instead of config.root", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(
        JSON.stringify({
          name: "custom",
          version: "1.0.0",
          exports: {
            ".": "./dist/index.js",
          },
        }),
      );

      const plugin = createPlugin("/custom/root");

      callCloseBundle(plugin);

      expect(writeFileSyncMock).toHaveBeenCalledWith(
        "/custom/root/dist/package.json",
        expect.any(String),
      );
    });
  });
  // endregion

  // region Prefix normalization
  describe("prefix normalization", () => {
    it("should not strip paths without leading './' (per Node.js exports spec)", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          ".": {
            import: "dist/index.js",
            types: "dist/index.d.ts",
          },
          "./valid": "./dist/valid.js",
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports).not.toHaveProperty(["."]);
    });

    it("should filter out string export values not under the dist prefix", () => {
      const pkg = {
        name: "test-pkg",
        version: "1.0.0",
        exports: {
          "./utils": "dist/utils.js",
          "./source": "./src/source.ts",
          "./valid": "./dist/valid.js",
        },
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      const exports = result.exports as Record<string, unknown>;

      expect(exports).not.toHaveProperty("./utils");
      expect(exports).not.toHaveProperty("./source");

      expect(exports["./valid"]).toBe("./valid.js");
    });
  });
  // endregion

  // region sideEffects field
  describe("sideEffects field", () => {
    it("should exclude sideEffects: false from dist package.json", () => {
      const pkg = {
        ...SHARED_PKG,
        sideEffects: false,
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      expect(result).not.toHaveProperty("sideEffects");
    });

    it("should exclude sideEffects array from dist package.json", () => {
      const pkg = {
        ...SHARED_PKG,
        sideEffects: ["./dist/styles.css", "./dist/global.css"],
      };

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(pkg));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      expect(result).not.toHaveProperty("sideEffects");
    });

    it("should omit sideEffects when not present in source", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(SHARED_PKG));

      const plugin = createPlugin();

      callCloseBundle(plugin);

      const result = writtenPackageJson();

      expect(result).not.toHaveProperty("sideEffects");
    });
  });
  // endregion
});
