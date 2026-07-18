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

export const { useClasses, staticClasses } = createClasses(
  "HvSnackbarProvider",
  {
    snackItemRoot: {
      backgroundColor: "transparent !important",
      boxShadow: "none !important",
      "&&": {
        color: "inherit",
        padding: "0",
        fontSize: "inherit",
        boxShadow: "none",
        alignItems: "center",
        fontFamily: "inherit",
        fontWeight: "inherit",
        lineHeight: "inherit",
        borderRadius: 0,
        letterSpacing: "inherit",
        backgroundColor: "inherit",
      },
    },
  },
);
