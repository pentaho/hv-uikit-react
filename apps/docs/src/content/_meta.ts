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
import type { MetaRecord } from "nextra";

export default {
  index: {
    type: "page",
    display: "hidden",
    theme: {
      layout: "full",
      timestamp: false,
    },
  },
  docs: {
    type: "page",
    title: "Docs",
  },
  components: {
    type: "page",
    title: "Components",
    theme: { layout: "full", toc: false },
  },
  "app-shell": {
    type: "page",
    title: "App Shell",
  },
  examples: {
    type: "page",
    title: "Examples",
    theme: {
      layout: "full",
      toc: false,
      breadcrumb: false,
      sidebar: false,
      timestamp: false,
    },
  },
} satisfies MetaRecord;
