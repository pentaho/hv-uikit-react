import { defineConfig, presetIcons } from "unocss";
import { presetHv } from "@hitachivantara/uikit-uno-preset";

export default defineConfig({
  presets: [presetHv(), presetIcons()],
  content: {
    pipeline: {
      include: [/\.(tsx?|mdx?|html)($|\?)/],
    },
    filesystem: ["./app-shell.config.ts"],
  },
});
