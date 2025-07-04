import { mergeConfig } from "tsdown";

import { baseConfig } from "../../.config/tsdown.config.ts";

export default [
  baseConfig,
  mergeConfig(baseConfig, {
    // TODO(major): rename this to something simpler
    entry: { "app-shell-shared.esm": "src/index.ts" },
    outDir: "dist/bundles",
    unbundle: false,
    clean: false,
    dts: false,
  }),
];
