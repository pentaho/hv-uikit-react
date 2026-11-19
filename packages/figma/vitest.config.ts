import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "figma",
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
