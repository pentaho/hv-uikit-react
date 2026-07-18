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
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import tsconfigPaths from "vite-tsconfig-paths";
import { HvAppShellVitePlugin } from "@hitachivantara/app-shell-vite-plugin";
import { presetHv } from "@hitachivantara/uikit-uno-preset";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tsconfigPaths(),
    unoCSS({
      mode: "per-module",
      presets: [presetHv()],
    }),
    cssInjectedByJsPlugin({
      relativeCSSInjection: true,
    }),
    HvAppShellVitePlugin({
      mode,
      autoMenu: true,
      autoViewsAndRoutes: true,
    }),
  ],
}));
