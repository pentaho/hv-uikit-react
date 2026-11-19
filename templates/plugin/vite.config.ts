// `npm run dev` runs the plugin in a local App Shell, its server calls answered from samples.json. `npm run build`
// builds the bundles a Pentaho server's App Shell loads (one per view, and the provider) into dist/, which
// `uikit-cli package` puts in the plugin's webclient folder.
/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { HvAppShellVitePlugin } from "@pentaho/app-shell-vite-plugin";

import { MODULES } from "./plugin.ts";
import { samples } from "./samples.ts";

export default defineConfig(({ mode, command }) => ({
  plugins: [
    UnoCSS({ mode: "per-module" }),
    cssInjectedByJsPlugin({ relativeCSSInjection: true }),
    react(),
    HvAppShellVitePlugin({
      mode,
      modules: MODULES,
      type: command === "build" ? "bundle" : "app",
    }),
    samples("samples.json"),
  ],

  test: {
    unstubGlobals: true,
    globals: true,
    environment: "happy-dom",
    setupFiles: ["src/tests/setupTests.ts"],
    reporters: "default",
    coverage: {
      enabled: false, // disabled by default. run vitest with --coverage
      provider: "v8",
      reporter: "lcov",
      include: ["src/**/*.ts?(x)"],
      exclude: ["src/**/tests/*", "src/**/*.test.ts?(x)", "src/**/*.d.ts"],
    },
  },
}));
