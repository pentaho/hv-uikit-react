import type { PluginOption } from "vite";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import { getBasePath } from "./config-utils.js";

/**
 * Calculate the App title,  It applies the following rules to calculate the final value
 *  - If we are generating an empty App Shell, it returns the value “%%APPSHELL_TITLE%%.”
 *  - Otherwise, it returns the value of the configuration name property.
 * @param generateEmptyShell flag to control if we are generating an empty App Shell instance
 * @param appShellConfig App shell config values
 * @returns The app title
 */
export const getAppTitle = (
  generateEmptyShell: boolean,
  appShellConfig: HvAppShellConfig,
) => {
  return generateEmptyShell ? "%%APPSHELL_TITLE%%" : appShellConfig.name;
};

/**
 * Add the <BASE> tag and icons preload in the index.html file.
 * @param appShellConfig The app shell configuration.
 * @param generateEmptyShell Flag that controls if an empty app shell application is created with tags instead of final values
 */
export default function generateBaseTag(
  appShellConfig: HvAppShellConfig,
  generateEmptyShell: boolean,
): PluginOption {
  let basePath: string;
  return {
    name: "vite-plugin-generate-base",
    config(config) {
      basePath = getBasePath(appShellConfig.baseUrl, config.base);
    },
    transformIndexHtml: {
      order: "post",
      handler: (html: string) => ({
        html:
          generateEmptyShell || appShellConfig.name != null
            ? html.replace(
                /<title>(.*?)<\/title>/,
                `<title>${getAppTitle(
                  generateEmptyShell,
                  appShellConfig,
                )}</title>`,
              )
            : html,
        tags: [
          {
            tag: "base",
            attrs: {
              href: generateEmptyShell ? "%%APPSHELL_BASE%%" : basePath,
            },
            injectTo: "head-prepend",
          },
        ],
      }),
    },
  };
}
