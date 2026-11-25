import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "tools",
    environment: "node",
    include: ["src/**/*.test.ts"],
    // lint, the guides' compile and the rule scan run real tools: slow on a busy machine, not wrong
    testTimeout: 180_000,
  },
});
