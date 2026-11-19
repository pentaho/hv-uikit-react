import { defineConfig } from "vite";

// `vite build` bundles the plugin, with the documentation pages, as dist/code.js (manifest.json's main).
export default defineConfig({
  build: {
    target: "es2022",
    lib: {
      entry: "src/plugin/code.ts",
      formats: ["iife"],
      name: "pentahoFigma",
      fileName: () => "code.js",
    },
  },
});
