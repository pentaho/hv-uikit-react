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

export const { staticClasses, useClasses } = createClasses("HvInfoMessage", {
  root: { color: theme.colors.textSubtle, display: "inline-block" },
  infoDisabled: { color: theme.colors.textDisabled },
  gutter: { padding: theme.spacing(0, 0, "xxs", "xs") },
});
