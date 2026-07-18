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
import {
  createClasses,
  outlineStyles,
  theme,
} from "@hitachivantara/uikit-react-core";

export const { staticClasses, useClasses } = createClasses(
  "HvFlowSidebarGroupItem",
  {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: `1px solid ${theme.colors.border}`,
      padding: theme.spacing(0, 0, 0, "sm"),
      cursor: "pointer",
      boxShadow: `0 1px 0 ${theme.colors.shad1}`,

      "&:focus-visible": {
        ...outlineStyles,
      },
    },
    dragging: { borderColor: theme.colors.primaryStrong },
  },
);
