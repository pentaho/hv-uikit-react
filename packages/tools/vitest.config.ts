import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "tools",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
