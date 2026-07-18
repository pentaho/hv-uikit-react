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

export const { useClasses } = createClasses("HvPaginationSelect", {
  root: {},
  header: {
    backgroundColor: "transparent",
    borderColor: theme.colors.textSubtle,
    "&:hover": {
      borderColor: theme.colors.textSubtle,
    },
  },
  selection: {
    padding: theme.spacing(0, "md", 0, "xs"),
  },
  headerOpen: {
    backgroundColor: theme.colors.bgContainer,
  },
});
