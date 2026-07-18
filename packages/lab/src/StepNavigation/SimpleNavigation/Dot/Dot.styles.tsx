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

export const { staticClasses, useClasses } = createClasses("HvDot", {
  root: {
    borderRadius: theme.radii.full,
    zIndex: 1,
    width: "var(--dotSize)",
    height: "var(--dotSize)",
    "&,:hover,:disabled": {
      backgroundColor: "var(--dotColor)",
    },
  },
  active: {},
  ghostDisabled: {},
});
