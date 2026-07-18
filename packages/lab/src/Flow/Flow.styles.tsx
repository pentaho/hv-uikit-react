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
import { createClasses, theme } from "@hitachivantara/uikit-react-core";

import { flowBaseNodeClasses } from "./Node";

export const { staticClasses, useClasses } = createClasses("HvFlow", {
  root: {
    height: "100%",
    [`& .selected > .${flowBaseNodeClasses.root}`]: {
      border: `1px solid ${theme.colors.textDisabled}`,
      borderRadius: theme.radii.round,
      boxSizing: "border-box",
    },
  },
});
