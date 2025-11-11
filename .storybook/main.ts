import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import react from "@vitejs/plugin-react";
import unoCSS from "unocss/vite";
import { mergeConfig } from "vite";

export default {
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  stories: [
    "../packages/*/src/**/*.mdx",
    "../packages/*/src/**/*.stories.@(ts|tsx)",
  ],
  core: {
    disableTelemetry: true,
  },
  docs: {},
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-vitest"),
  ],
  features: {},
  staticDirs: [
    "./assets",
    {
      from: "../packages/icons/sprites/icons.svg",
      to: "assets/icons.svg",
    },
    {
      from: "../packages/icons/sprites/pictograms.svg",
      to: "assets/pictograms.svg",
    },
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      optimizeDeps: {
        exclude: ["xmllint-wasm"],
      },
      plugins: [react(), unoCSS()],
    });
  },
  typescript: {
    reactDocgen: "react-docgen",
  },
  build: {
    test: {
      // https://storybook.js.org/docs/api/main-config-build#testdisableblocks
      disableBlocks: false,
    },
  },
} as StorybookConfig;

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
