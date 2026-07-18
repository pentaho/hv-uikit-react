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
  "HvVerticalNavigationTree",
  {
    root: {
      display: "block",
      overflowY: "auto",
    },
    list: {},
    listItem: {},
    collapsed: {
      display: "none",
    },
    popup: {
      boxShadow: "inset 5px 0 5px -3px rgb(65 65 65 / 12%)",
    },
    navigationPopup: {
      boxShadow: "inset 5px 0 5px -3px rgb(65 65 65 / 12%)",
    },
  },
);
