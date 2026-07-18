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

export const { staticClasses, useClasses } = createClasses("HvDialogContent", {
  root: {
    padding: theme.spacing(0, "sm", "sm"),
    borderColor: theme.colors.borderSubtle,
  },
  textContent: {
    paddingLeft: `calc(42px + ${theme.space.sm})`,
    paddingRight: "62px",
    overflowY: "auto",
  },
});
