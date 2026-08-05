/// <reference types="vite/client" />
/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import unoCSS from "unocss/vite";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import tsconfigPaths from "vite-tsconfig-paths";
import { HvAppShellVitePlugin } from "@pentaho/app-shell-vite-plugin";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tsconfigPaths(),
    unoCSS({ mode: "per-module" }),
    cssInjectedByJsPlugin({
      relativeCSSInjection: true,
    }),
    HvAppShellVitePlugin({
      mode,
      autoViewsAndRoutes: true,
    }),
  ],

  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["src/tests/setupTests.ts"],
    reporters: "default",
    coverage: {
      enabled: false, // disabled by default. run vitest with --coverage
      provider: "v8",
      reporter: "lcov",
      include: ["src/**/*.ts?(x)"],
      exclude: [
        "src/**/mocks/*",
        "src/**/tests/*",
        "src/**/*.test.ts?(x)",
        "src/**/styles.[jt]s?(x)",
        "src/**/*.d.ts",
        "src/*.tsx",
      ],
    },
  },
}));
