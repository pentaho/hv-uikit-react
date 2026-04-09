import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./.config/vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      silent: true,
      globals: true,

      slowTestThreshold: process.env.CI ? 800 : 400,
      projects: [
        // storybook tests
        {
          extends: true,
          plugins: [
            storybookTest({
              tags: { skip: ["skipTestRunner"] },
            }),
          ],
          test: {
            name: { label: "storybook", color: "magenta" },
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: "chromium" }],
            },
            setupFiles: [".storybook/vitest.setup.ts"],
          },
        },
      ],
    },
  }),
);
