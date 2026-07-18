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

export const { staticClasses, useClasses } = createClasses("HvStep", {
  root: {
    width: "fit-content",
    height: "fit-content",
    fontWeight: theme.fontWeights.semibold,
  },
  notCurrent: { margin: "-8px" },
  xs: {},
  sm: {},
  md: {},
  lg: {},
  xl: {},
  avatar: {
    "&$xs": {
      fontSize: "0.625rem",
    },
    "&$sm": {
      fontSize: "1rem",
    },
    "&$md": {
      fontSize: "1.5rem",
    },
    "&$lg": {
      fontSize: "2rem",
    },
    "&$xl": {
      fontSize: "2.5rem",
    },
  },
});
