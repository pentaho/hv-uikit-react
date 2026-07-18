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

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationHeader",
  {
    root: {
      width: "100%",
      display: "flex",
      marginTop: "12px",
      alignItems: "center",
    },
    minimized: {
      justifyContent: "center",
      paddingRight: 0,
    },
    collapseButton: {
      marginLeft: "auto",
      color: "inherit",
      "&$minimized": {
        marginLeft: 0,
      },
    },
    backButton: {
      color: "inherit",
    },
    title: {
      color: "inherit",
    },
  },
);
