/// <reference types="vite/client" />
/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import unoCSS from "unocss/vite";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import tsconfigPaths from "vite-tsconfig-paths";
import { HvAppShellVitePlugin } from "@pentaho/app-shell-vite-plugin";
import { presetUikit } from "@pentaho/uikit-uno-preset";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tsconfigPaths(),
    unoCSS({
      mode: "per-module",
      presets: [presetUikit()],
    }),
    cssInjectedByJsPlugin({
      relativeCSSInjection: true,
    }),
    HvAppShellVitePlugin({
      mode,
      autoMenu: true,
      autoViewsAndRoutes: true,
    }),
  ],
}));
