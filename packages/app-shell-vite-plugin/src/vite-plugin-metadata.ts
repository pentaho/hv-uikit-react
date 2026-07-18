/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import type { PluginOption } from "vite";

import { resolveModule } from "./nodeModule.js";
import { readJsonFile } from "./utils.js";

const extractVersion = (packageJsonFile: string): string => {
  return readJsonFile(packageJsonFile).version;
};

/**
 * This plugin injects metadata into the index.html file.
 * The metadata is used to help any troubleshoot activity by referencing
 * the version of the app-shell-vite-plugin and app-shell-ui packages used by the app.
 */
export default function injectMetadata(): PluginOption {
  const appShellUIVersion = extractVersion(
    resolveModule("@hitachivantara/app-shell-ui/package.json"),
  );

  const appShellVitePluginVersion = extractVersion(
    resolveModule("@hitachivantara/app-shell-vite-plugin/package.json"),
  );

  return {
    name: "vite-plugin-metadata",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: {
            name: "app-shell-ui-version",
            content: appShellUIVersion,
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "app-shell-vite-plugin-version",
            content: appShellVitePluginVersion,
          },
        },
      ];
    },
  };
}
