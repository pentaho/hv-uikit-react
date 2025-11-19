import path from "node:path";
import type { PluginOption } from "vite";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import { require } from "./nodeModule.js";

const prepareConfigForDevMode = (
  config: HvAppShellConfig,
  selfAppName: string,
) => {
  let configString = JSON.stringify(config);

  configString = configString.replaceAll(`"@self/`, `"${selfAppName}/`);

  return JSON.parse(configString) as HvAppShellConfig;
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
