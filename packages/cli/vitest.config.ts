import { defineConfig } from "vitest/config";

// `cli`: the fast tests, `npm test` (it builds the CLI first); `apps`: each template's app built and checked, slow,
// `npm run test:apps` (CI runs it after building every package)
export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 30_000,
    projects: [
      {
        extends: true,
        test: {
          name: "cli",
          include: ["src/**/*.test.ts"],
          exclude: ["src/apps.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "apps",
          include: ["src/apps.test.ts"],
          testTimeout: 300_000,
        },
      },
    ],
  },
});
