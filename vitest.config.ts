/// <reference types="@vitest/browser/providers/playwright" />

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./.config/vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      silent: true,
      globals: true,

      maxWorkers: process.env.CI ? 2 : undefined,
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
              provider: "playwright",
              instances: [{ browser: "chromium" }],
            },
            setupFiles: [".storybook/vitest.setup.ts"],
          },
        },
      ],
    },
  }),
);
