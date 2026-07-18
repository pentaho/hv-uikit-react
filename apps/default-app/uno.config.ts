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
