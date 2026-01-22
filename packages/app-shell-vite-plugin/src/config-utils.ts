import fs from "node:fs";
import path from "node:path";
import { createJiti } from "jiti";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import type { AppShellVitePluginOptions } from "./vite-plugin.js";

const jiti = createJiti(import.meta.url, { debug: true, tryNative: true });

export interface ConfigReplacement {
  token: string;
  value: string;
}

export type AppShellConfigFunction = (
  pluginOptions: AppShellVitePluginOptions,
  env: Record<string, string>,
) => HvAppShellConfig;

export const DEFAULT_CONFIG_FILES = [
  "app-shell.config.ts",
  "app-shell.config.js",
  "app-shell.config.json",
];

export function findAppShellConfigFile(root: string): string | undefined {
  const filename = DEFAULT_CONFIG_FILES.find((file) =>
    fs.existsSync(path.resolve(root, file)),
  );

  if (filename) {
    return path.resolve(root, filename);
  }

  return undefined;
}

export function loadConfigFile(
  appShellConfigFile: string | undefined,
  opts: AppShellVitePluginOptions,
  env: Record<string, string> = {},
): HvAppShellConfig {
  if (!appShellConfigFile) {
    // an empty configuration is actually valid
    // and with the automatic views option, it can even make sense
    return {};
  }

  if (appShellConfigFile.endsWith(".json")) {
    let appShellConfigRaw = fs.readFileSync(appShellConfigFile, "utf-8");

    // token replacement is only supported for json files
    opts.configReplacements?.forEach((item) => {
      appShellConfigRaw = appShellConfigRaw.replaceAll(
        `@@${item.token}@@`,
        item.value,
      );
    });

    return JSON.parse(appShellConfigRaw) as HvAppShellConfig;
  }

  const loadedAppShellConfig = jiti(appShellConfigFile).default;

  if (typeof loadedAppShellConfig === "function") {
    return loadedAppShellConfig(opts, env);
  }

  return loadedAppShellConfig;
}

/**
 * Returns the extensionless module name of the output bundle
 * for a given entry point module name.
 *
 * @param module The entry point module name.
 * @returns The final module name of the output bundle.
 */
export function getFinalModuleName(module: string) {
  return module
    .replace(/^\//, "")
    .replace(/^src\//, "") // TODO: remove custom hard-coded `src` behavior (in favour of `root` or `modulesRoot`?)
    .replace(/\.[tj]sx?$/, "")
    .replaceAll("$", "_");
}

/**
 *  Returns the modules to be created by the build of the app.
 *  The list of modules is provided via parameter as one of the options used to initialize AppShellVitePlugin. {@link AppShellVitePluginOptions}
 *
 * @param root Project root directory.
 * @param modules The list of modules to be exported by the application bundle.
 */
export function getAppModules(root: string, modules: string[] = []) {
  return modules.reduce<Record<string, string>>((acc, modulePath) => {
    const bundleName = getFinalModuleName(modulePath);
    acc[bundleName] = path.resolve(root, modulePath);

    return acc;
  }, {});
}

export function getBasePath(configBaseUrl?: string, viteConfigBase?: string) {
  return viteConfigBase ?? configBaseUrl ?? "/";
}
