/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
/// <reference types="vite/client" />
/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import unoCSS from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), unoCSS()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["src/tests/setupTests.ts"],
    reporters: "default",
    coverage: {
      enabled: false, // disabled by default. run vitest with --coverage
      provider: "v8",
      reporter: "lcov",
      include: ["src/**/*.ts?(x)"],
      exclude: [
        "src/**/mocks/*",
        "src/**/tests/*",
        "src/**/*.test.ts?(x)",
        "src/**/styles.[jt]s?(x)",
        "src/**/*.d.ts",
        "src/*.tsx",
      ],
    },
  },
});
