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

import viteConfig from "../../.config/vite.config";

export default mergeConfig(viteConfig, {
  build: {
    rolldownOptions: {
      output: [
        {
          format: "esm",
          dir: "dist/bundles",
        },
      ],
    },
  },
});
