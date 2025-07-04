import { resolve } from "node:path";
import { defineConfig, mergeConfig } from "tsdown";

export const baseConfig = defineConfig({
  entry: resolve("src/index.ts"),
  platform: "browser",
  fixedExtension: false,
  tsconfig: resolve("../../tsconfig.build.json"),
  outDir: "dist",
  clean: ["dist", "package"],
  inlineOnly: false, // TODO: review warnings
  unbundle: true,
  dts: true,
});

// extend baseConfig with options that are hard/impossible to override
export const defaultConfig = mergeConfig(baseConfig, {
  exports: { enabled: true, devExports: true },
});

export default defaultConfig;
