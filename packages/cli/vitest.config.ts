import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "cli",
    environment: "node",
    include: ["src/**/*.test.ts", "trials/**/*.test.ts"],
    testTimeout: 30_000,
  },
});
