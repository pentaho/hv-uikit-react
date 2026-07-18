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
import { mergeConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

import viteConfig from "../../.config/vite.config";

export default mergeConfig(viteConfig, {
  plugins: [
    viteStaticCopy({
      targets: [{ src: "sprites", dest: "./" }],
    }),
  ],
});
