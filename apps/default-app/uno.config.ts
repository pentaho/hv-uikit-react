import { defineConfig, presetIcons } from "unocss";
import { presetUikit } from "@pentaho/uikit-uno-preset";

export default defineConfig({
  presets: [presetUikit(), presetIcons()],
  content: {
    pipeline: {
      include: [/\.(tsx?|mdx?|html)($|\?)/],
    },
    filesystem: ["./app-shell.config.ts"],
  },
});
