import fs from "node:fs";
import path from "node:path";
import type { NormalizedOutputOptions } from "rollup";
import type { PluginOption, UserConfig } from "vite";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import { getAppModules, getBasePath } from "./config-utils.js";

/**
 * Process configuration, executing several tasks:
 *  - Create rollup configuration to support module creation
 *  - Generates final transformed configuration json
 *  - "base" value is always "./" for build, and main app baseUrl for preview or dev
 * @param root Project root directory.
 * @param appShellConfig The original App Shell configuration json.
 * @param selfAppName The name of the application bundle being built.
 * @param buildEntryPoint If true, the index.html entry point will be added to the bundle.
 * @param inlineConfig flag to control if config is included at index.html
 * @param generateEmptyShell flag to control if we are creating an empty AppShell instance
 * @param modules the set of modules to be created by the rollup
 */
export default function processConfiguration(
  root: string,
  appShellConfig: HvAppShellConfig,
  selfAppName: string,
  buildEntryPoint: boolean,
  inlineConfig: boolean,
  generateEmptyShell: boolean,
  modules: string[] = [],
): PluginOption {
  let finalAppShellConfig: HvAppShellConfig;
  let basePath: string;

  return {
    name: "vite-plugin-appShell-configuration-processor",

    config(config: UserConfig, { command }) {
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
    async generateBundle(options: NormalizedOutputOptions) {
      if (generateEmptyShell || !buildEntryPoint) {
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

      // Replace all @self references using simple string replacement
      let configString = JSON.stringify(finalAppShellConfig);

      configString = configString.replaceAll(`"@self/`, `"${selfAppName}/`);

      finalAppShellConfig = JSON.parse(configString);

      if (!inlineConfig) {
        fs.writeFileSync(
          path.resolve(targetDir, "app-shell.config.json"),
          JSON.stringify(finalAppShellConfig),
        );
      }
    },

    transformIndexHtml: {
      order: "post",
      handler: (html) => {
        // Removes bare <script type="module" src="..."></script> tags with a "src" pointing to a
        // bare module specifiers from index.html.
        // Tried other approaches that should work to no effect, such as:
        // - config.build.modulePreload = { polyfill: false }
        // - config.build.polyfillModulePreload = false
        const processedHtml = html.replaceAll(
          /<script type="module"[^>]+src="((?!^\/|\.)([^"']+))"[^>]*><\/script>/g,
          "",
        );

        if (inlineConfig) {
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
        }

        return processedHtml;
      },
    },
  };
}
