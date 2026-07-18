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

export const { staticClasses, useClasses } = createClasses("HvTable", {
  root: {
    position: "relative",
    width: "100%",

    ...theme.typography.body,

    borderSpacing: 0,

    "& caption": {
      ...theme.typography.body,
      padding: theme.space.xs,
      textAlign: "left",
      captionSide: "bottom",
    },
  },
  stickyHeader: {},
  stickyColumns: {
    backgroundColor: theme.colors.bgPage,
    "&": {
      borderSpacing: 0,
    },
  },
  listRow: {
    borderSpacing: `0 ${theme.space.xs}`,
  },
});
