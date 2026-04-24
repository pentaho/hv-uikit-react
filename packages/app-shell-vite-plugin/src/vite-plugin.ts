import fs from "node:fs";
import path from "node:path";
import virtual from "@rollup/plugin-virtual";
import { loadEnv, type PluginOption } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import {
  applyAutomaticMenu,
  applyAutomaticViewsAndRoutes,
} from "./automatic-utils.js";
import {
  findAppShellConfigFile,
  getFinalModuleName,
  loadConfigFile,
  type ConfigReplacement,
} from "./config-utils.js";
import { resolveModule } from "./nodeModule.js";
import SHARED_DEPENDENCIES from "./shared-dependencies.js";
import getVirtualEntrypoints from "./virtual-entrypoints.js";
import processConfiguration from "./vite-configuration-processor-plugin.js";
import fixCrossOrigin from "./vite-crossorigin-fix-plugin.js";
import generateBaseTag from "./vite-generate-base-plugin.js";
import generateBashScript from "./vite-generate-bash-script-plugin.js";
import generateImportmap, {
  extraDependencies,
} from "./vite-importmap-plugin.js";
import copyAppShellLocales from "./vite-locales-plugin.js";
import injectMetadata from "./vite-metadata-plugin.js";
import serveAppShellConfig from "./vite-watch-config-plugin.js";

const ViteBuildMode = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
} as const;

export type ApplicationBundleType = "app" | "bundle";

export interface AppShellVitePluginOptions {
  /**
   * Project root directory. Most likely the location of the vite config file.
   *
   * @default process.cwd()
   */
  root?: string;
  /**
   * Execution mode.
   */
  mode?: string;

  /**
   * Type of application bundle being built. Can be "app" or "bundle".
   *
   * - "app": The application bundle includes both the index.html entry point and the exported modules.
   * - "bundle": The application bundle will not include the index.html entry point.
   *
   * @default "app"
   */
  type?: ApplicationBundleType;

  /** Array of tokens that are replaced at app-shell.config.json during the build of the solution.
   * e.g.
   * {
   *    token: "USER_NOTIFICATIONS_URL",
   *    value: "http://localhost:8080"
   * }
   * Tokens used at config file must be wrapped (at the beginning and at the end) by `@@` sequence
   * e.g.
   * {
   *   "@hv/user-notifications-client": "@@USER_NOTIFICATIONS_URL@@"
   * }
   */
  configReplacements?: ConfigReplacement[];

  /**
   * The folder containing Views to be shared as Shared Modules. Defaults to "src/pages".
   *
   * The folder path must be relative to the project root (e.g. "src/pages").
   */
  viewsFolder?: string;
  /**
   * If set, the plugin will search for Views at the folder specified by `viewsFolder` and will add them to the App Shell configuration as views.
   * The views' modules will be exported accordingly, and a route will be created from the folder structure.
   * Dynamic route parameters are supported by prefixing the folder name with a $ (e.g. "src/pages/List/$id/index.tsx" will be configured as "/list/:id").
   */
  autoViewsAndRoutes?: boolean;
  /**
   * If true, the plugin will try to automatically add the views to the menu.
   * Any menu defined in the App Shell config file will be overwritten.
   */
  autoMenu?: boolean;

  /**
   * If true, the plugin will generate the importmap with an external js file instead of inline in the html.
   * The map will be saved at the root of the application destination dir and named as "importmap.js".
   *
   * This option is not for general use. It is only intended to be used for easing the automated testing of the App Shell.
   *
   * @default false
   * @private
   */
  externalImportMap?: boolean;
  /**
   * If true, the plugin will inline the app-shell.config.json file in a script tag of the index html.
   *
   * This option is not for general use. Its value will be automatically managed by the App Shell build process.
   *
   * @default false, true if generateEmptyShell is true
   * @private
   */
  inlineConfig?: boolean;
  /**
   * If true, the config file is ignored, only the App Shell is built and the generated index.html will contain a placeholders
   * for importmap (if externalImportMap is false), app shell config (if inlineConfig is true) and title.
   *
   * A bash script will also be added to the dist folder to replace the placeholders with the actual content,
   * when provided with a concrete configuration.
   *
   * This option is not for general use. It is used for generating the App Shell container image.
   *
   * @default false
   * @private
   */
  generateEmptyShell?: boolean;
  /**
   * The modules to be exported by the application.
   *
   * All the modules that the application need to export should be declared here in order to have them built properly.
   *
   */
  modules?: string[];
  /**
   * If true, the keys of the `apps` property in the configuration file will be used as-is in the importmap,
   * without enforcing a trailing slash. If false, a trailing slash will be appended to each key.
   *
   * @default false
   */
  disableAppsKeyNormalization?: boolean;
}

/**
 * Vite plugin to support App Shell apps setup
 * @param opts Plugin options
 * @param env Environment variable
 */
export async function HvAppShellVitePlugin(
  opts: AppShellVitePluginOptions = {},
  env: Record<string, string> = {},
): Promise<PluginOption[]> {
  const {
    root = process.cwd(),
    mode = ViteBuildMode.PRODUCTION,
    externalImportMap = false,
    viewsFolder = "src/pages",
    autoViewsAndRoutes = false,
    autoMenu = false,
    inlineConfig = opts.generateEmptyShell ?? false,
    generateEmptyShell = false,
    modules = [],
    disableAppsKeyNormalization = false,
  } = opts;

  const globalEnv = loadEnv(mode, process.cwd(), "");

  const { type = globalEnv.CI ? "bundle" : "app" } = opts;

  console.info(`Vite running in mode: ${mode}`);
  console.info(`AppShell Vite plugin running with type: ${type}`);

  const devMode = mode === ViteBuildMode.DEVELOPMENT;
  const buildEntryPoint = type !== "bundle";

  const packageJsonRaw = fs.readFileSync(
    path.resolve(root, "package.json"),
    "utf-8",
  );
  const packageJson = JSON.parse(packageJsonRaw);

  const appShellConfigFile = !generateEmptyShell
    ? findAppShellConfigFile(root)
    : undefined;
  const appShellConfiguration: HvAppShellConfig = await loadConfigFile(
    appShellConfigFile,
    opts,
    env,
  );

  let autoViewsBundles: string[] = [];

  if (!generateEmptyShell) {
    if (autoViewsAndRoutes) {
      autoViewsBundles = applyAutomaticViewsAndRoutes(
        appShellConfiguration,
        packageJson.name,
        root,
        viewsFolder,
      );
    }

    if (autoMenu) {
      applyAutomaticMenu(appShellConfiguration);
    }
  }

  return [
    // copy the shared dependencies js bundles to the "bundles" folder
    (buildEntryPoint || devMode) &&
      viteStaticCopy({
        targets: [
          {
            src: resolveModule("es-module-shims"),
            dest: "bundles",
          },
          ...(!devMode && buildEntryPoint
            ? [
                {
                  src: SHARED_DEPENDENCIES.flatMap((dep) => {
                    const module = resolveModule(dep.bundleSrc);
                    try {
                      return [module, resolveModule(`${dep.bundleSrc}.map`)];
                    } catch {
                      return [module];
                    }
                  }),
                  dest: "bundles",
                },
              ]
            : []),
        ],
      }),

    // create virtual endpoints for shell code and for shared dependencies
    virtual({
      ...getVirtualEntrypoints(inlineConfig),

      ...SHARED_DEPENDENCIES.reduce(
        (acc, dep) => {
          acc[`/bundles/${dep.bundle}`] = dep.virtualSrc;
          return acc;
        },
        {} as Record<string, string>,
      ),
    }),

    // generate the importmap for shared dependencies and for apps referenced in the config file
    generateImportmap(
      {
        ...SHARED_DEPENDENCIES.reduce(
          (acc, dep) => {
            acc[dep.moduleId] = `./bundles/${dep.bundle}`;
            return acc;
          },
          {} as Record<string, string>,
        ),

        ...extraDependencies,

        ...Object.entries(appShellConfiguration?.apps ?? {}).reduce(
          (acc, [key, value]) => {
            const normalizedKey = disableAppsKeyNormalization ? key : `${key}/`;
            acc[normalizedKey] = value;
            return acc;
          },
          {} as Record<string, string>,
        ),

        [`${packageJson.name}/`]: "./",

        ...(devMode
          ? modules.concat(autoViewsBundles).reduce(
              (acc, module) => {
                const finalModule = getFinalModuleName(module);
                acc[`${packageJson.name}/${finalModule}.js`] = `./${module}`;
                return acc;
              },
              {} as Record<string, string>,
            )
          : {}),
      },
      [...SHARED_DEPENDENCIES.map((dep) => dep.moduleId), packageJson.name],
      externalImportMap && buildEntryPoint,
      generateEmptyShell,
    ),

    // inject version metadata in the index.html
    buildEntryPoint && injectMetadata(),

    // set the base tag and replace the title in the index.html
    buildEntryPoint &&
      generateBaseTag(appShellConfiguration, generateEmptyShell),

    // configure the build process based on the config file
    processConfiguration(
      root,
      appShellConfiguration,
      packageJson.name,
      buildEntryPoint,
      inlineConfig,
      generateEmptyShell,
      modules.concat(autoViewsBundles),
    ),

    // allow crossorigin="use-credentials" in the index.html
    fixCrossOrigin(),

    // serve the app shell config file as json and watch for changes
    serveAppShellConfig(
      appShellConfiguration,
      root,
      packageJson.name,
      appShellConfigFile,
      autoViewsAndRoutes ? viewsFolder : undefined,
    ),

    // generate the shell script to replace the placeholders in the index.html
    generateEmptyShell && generateBashScript(externalImportMap, inlineConfig),

    // copy/merge app-shell-ui locales into dist (build) or serve via middleware (dev)
    (buildEntryPoint || devMode) && copyAppShellLocales(),
  ];
}
