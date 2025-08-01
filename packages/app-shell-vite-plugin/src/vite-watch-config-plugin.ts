import path from "node:path";
import type { PluginOption } from "vite";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import { replaceSelf } from "./config-utils.js";
import { require } from "./nodeModule.js";
import { replaceReferencesToSelf } from "./vite-configuration-processor-plugin.js";

const prepareConfigForDevMode = (
  config: HvAppShellConfig,
  selfAppName: string,
) => {
  const { mainPanel, header, theming, providers } = config;
  const replacedConfig: HvAppShellConfig = {
    ...config,
  };
  const self = `${selfAppName}/`;
  // Main panel - Views
  if (mainPanel?.views && replacedConfig.mainPanel) {
    replacedConfig.mainPanel.views = replaceReferencesToSelf(
      mainPanel.views,
      selfAppName,
    );
  }
  // Header - Actions
  if (header?.actions && replacedConfig.header) {
    replacedConfig.header.actions = replaceReferencesToSelf(
      header.actions,
      selfAppName,
    );
  }
  // Theming
  if (theming?.theme && replacedConfig.theming) {
    replacedConfig.theming.theme = replaceSelf(theming.theme, self);
  }
  // Providers
  if (providers) {
    replacedConfig.providers = replaceReferencesToSelf(providers, selfAppName);
  }

  return replacedConfig;
};

export default function serveAppShellConfig(
  appShellConfig: HvAppShellConfig,
  root: string,
  selfAppName: string,
  appShellConfigFile?: string,
  automaticViewsFolder?: string,
): PluginOption {
  return {
    name: "vite-plugin-watch-app-shell-config",
    apply: "serve",

    configureServer(server) {
      const restartServer = (file: string) => {
        if (appShellConfigFile != null && file.endsWith(appShellConfigFile)) {
          console.info("App Shell configuration file changed. Reloading...");
          delete require.cache[require.resolve(appShellConfigFile)];
          server
            .restart()
            .catch((e) => console.error(`Restart failed with: ${e}`));
        }
      };

      const restartServer2 = (file: string) => {
        if (automaticViewsFolder != null && /\/index\.[tj]sx?$/.exec(file)) {
          console.info("Automatic views folder changed. Reloading...");
          server
            .restart()
            .catch((e) => console.error(`Restart failed with: ${e}`));
        }
      };

      if (appShellConfigFile != null) {
        server.watcher.add(appShellConfigFile);
        server.watcher.on("change", restartServer);
      }

      if (automaticViewsFolder != null) {
        server.watcher.add(path.resolve(root, automaticViewsFolder));
        server.watcher.on("unlink", restartServer2);
        server.watcher.on("add", restartServer2);
      }

      server.middlewares.use(
        `${server.config.base}app-shell.config.json`,
        (req, res) => {
          res.end(
            JSON.stringify(
              prepareConfigForDevMode(appShellConfig, selfAppName),
            ),
          );
        },
      );
    },
  };
}
