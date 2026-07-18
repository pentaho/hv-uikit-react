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
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationAction",
  {
    action: {
      width: "100%",
      justifyContent: "flex-start",
      height: "32px",
      color: "inherit",
      fontWeight: "inherit",
      padding: theme.spacing(0, "xs"),
      border: "none",

      // cursor
      "& *": {
        cursor: "pointer",
      },
    },
    noIcon: {},
    minimized: {
      justifyContent: "center",
      padding: 0,
    },
  },
);
