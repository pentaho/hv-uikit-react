import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { OutputOptions } from "rollup";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(resolve(process.cwd(), "package.json"));

// dependencies that should not be bundled.
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
].map((ext) => new RegExp(`^${ext.split("/")[0]}`));

const esmOutput: OutputOptions = {
  format: "esm",
  preserveModules: true,
  preserveModulesRoot: "src",
  dir: "dist",
  entryFileNames: "[name].js",
  exports: "named",
  interop: "auto",
};

export default defineConfig({
  plugins: [
    dts({
      outDir: "dist",
      rollupTypes: true,
      tsconfigPath: resolve(__dirname, "../tsconfig.build.json"),
    }),
    react(),
  ],
  build: {
    target: "ES2022",
    minify: false,
    emptyOutDir: true,
    lib: {
      name: pkg.name,
      entry: resolve(process.cwd(), "src/index.ts"),
    },
    rollupOptions: {
      output: [esmOutput],
      external,
    },
  },
  test: {
    globals: true,
    silent: true,
    testTimeout: 10000,
    reporters: "default",
    coverage: {
      enabled: false,
      provider: "v8",
      reporter: "lcov",
      include: ["src/**/*.ts?(x)"],
      exclude: ["src/**/stories/*", "src/**/*{test,stories,spec}.ts?(x)"],
    },

    projects: [
      {
        // DOM package tests
        extends: true,
        test: {
          name: { label: "dom", color: "yellow" },
          environment: "happy-dom",
          setupFiles: resolve(__dirname, "test.setup.tsx"),
          include: ["**/*.test.tsx"],
        },
      },
      {
        // Node package tests
        extends: true,
        test: {
          name: { label: "node", color: "green" },
          environment: "node",
          include: ["**/*.test.ts"],
        },
      },
    ],
  },
});
