import fs from "node:fs";
import path from "node:path";
import type { PluginOption } from "vite";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import { getAppModules, getBasePath } from "./config-utils.js";
import sharedDependencies from "./shared-dependencies.js";

/**
 * Options for the configuration processor plugin.
 */
export interface ProcessConfigurationOptions {
  /** Project root directory. */
  root: string;
  /** The original App Shell configuration json. */
  appShellConfig: HvAppShellConfig;
  /** The name of the application bundle being built. */
  selfAppName: string;
  /** The set of modules to be created by the rollup. */
  modules: string[];
  /** If true, the index.html entry point will be added to the bundle. */
  buildEntryPoint: boolean;
  /** Flag to control if config is included at index.html. */
  inlineConfig: boolean;
  /** Flag to control if we are creating an empty AppShell instance. */
  generateEmptyShell: boolean;
  /** If true, always writes app-shell.config.json to dist for dual-use packages. */
  experimentalNewPackageLayout: boolean;
}

/**
 * Process configuration, executing several tasks:
 *  - Create rollup configuration to support module creation
 *  - Generates final transformed configuration json
 *  - "base" value is always "./" for build, and main app baseUrl for preview or dev
 */
export default function processConfiguration(
  options: ProcessConfigurationOptions,
): PluginOption {
  const {
    root,
    appShellConfig,
    selfAppName,
    modules,
    buildEntryPoint,
    inlineConfig,
    generateEmptyShell,
    experimentalNewPackageLayout,
  } = options;
  let finalAppShellConfig: HvAppShellConfig;
  let basePath: string;

  return {
    name: "vite-plugin-appShell-configuration-processor",

    config(config, { command }) {
      const projectRoot = root ?? config.root;

      let appModules: Record<string, string> = {};
      if (!generateEmptyShell) {
        appModules = getAppModules(projectRoot, modules);
        console.info(
          "Modules exported by the application bundle:",
          Object.entries(appModules).reduce(
            (acc, [key, value]) => {
              acc[`${selfAppName}/${key}.js`] = value;
              return acc;
            },
            {} as Record<string, string>,
          ),
        );
      }

      basePath = getBasePath(appShellConfig.baseUrl, config.base);

      return {
        build: {
          rollupOptions: {
            preserveEntrySignatures: "strict",
            input: {
              ...(buildEntryPoint &&
              fs.existsSync(path.resolve(projectRoot, "index.html"))
                ? { main: path.resolve(projectRoot, "index.html") }
                : {}),
              ...appModules,
            },
            output: {
              entryFileNames: "[name].js",
            },
          },
        },
        // if serve (preview/dev) it uses the basePath. Otherwise(build), use ./
        base: command === "serve" ? basePath : "./",
      };
    },

    /**
     * Rollup hook with the info for bundle generation
     * It will be used to create a new configuration with:
     *  - bundles replace with the final location (e.g. -> "bundle": "src/pages/Main" transformed to "bundle": "pages/Main.js",
     * @param options build options
     */
    async generateBundle(options) {
      if (generateEmptyShell) {
        return;
      }

      // obtain the directory (dist) where the new config file will be placed
      let targetDir: string | undefined;
      if (options.dir) {
        targetDir = options.dir;
      } else if (options.file) {
        targetDir = path.dirname(options.file);
      }

      if (!targetDir) {
        throw new Error(
          "Please set outputPath, so we can know where to place the json file",
        );
      }

      // create the targetDir if it does not exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      finalAppShellConfig = { ...appShellConfig };

      // if no baseUrl is present on the configuration, then assume the calculated basePath
      if (!finalAppShellConfig.baseUrl) {
        finalAppShellConfig.baseUrl = basePath;
      }

      finalAppShellConfig.apps = undefined;

      // Replace all $app and @self (deprecated) references using simple string replacement.
      let configString = JSON.stringify(finalAppShellConfig);

      configString = configString.replaceAll(`"$app/`, `"${selfAppName}/`);
      // TODO(major): remove @self/ support in favour of $app/
      configString = configString.replaceAll(`"@self/`, `"${selfAppName}/`);

      finalAppShellConfig = JSON.parse(configString);

      // Write app-shell.config.json to dist when:
      // - inlineConfig is false (standard flow), OR
      // - experimentalNewPackageLayout is true (ensures dual-use: app shell or app bundle)
      if (!inlineConfig || experimentalNewPackageLayout) {
        fs.writeFileSync(
          path.resolve(targetDir, "app-shell.config.json"),
          JSON.stringify(finalAppShellConfig),
        );
      }
    },

    transformIndexHtml: {
      order: "post",
      handler: (html) => {
        const processedHtml = stripSharedDependencies(html);

        if (!inlineConfig) return processedHtml;

        return {
          html: processedHtml,
          tags: [
            {
              tag: "script",
              injectTo: "head-prepend",
              children: `globalThis.__appshell_config__ = ${
                generateEmptyShell
                  ? "%%APPSHELL_CONFIG%%"
                  : JSON.stringify(finalAppShellConfig ?? appShellConfig)
              };`,
            },
          ],
        };
      },
    },
  };
}

/** strips the `<script>` tags with bare `sharedDependencies` modules from the `html` string */
function stripSharedDependencies(html: string) {
  const sharedDeps = sharedDependencies
    .map((dep) => dep.moduleId)
    // escape the dependencies
    .map((dep) => dep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  const sharedDepsRegex = new RegExp(
    `<script type="module"[^>]+src="(${sharedDeps})"[^>]*><\\/script>`,
    "g",
  );

  return (
    html
      .replaceAll(sharedDepsRegex, "")
      // remove any empty lines that may have been left
      .replaceAll(/\n\s*\n/g, "\n")
  );
}
