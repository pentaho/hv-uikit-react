import { defineConfig } from "vite";

// `vite build` bundles what an agent runs in Figma (src/agent/agent.ts) as dist/agent-core.js, readable rather than
// minified, since an agent copies it into each script; scripts/agent.ts writes the scripts around it.
export default defineConfig({
  build: {
    target: "es2022",
    minify: false,
    lib: {
      entry: "src/agent/agent.ts",
      formats: ["iife"],
      name: "pentahoFigma",
      fileName: () => "agent-core.js",
    },
  },
});
