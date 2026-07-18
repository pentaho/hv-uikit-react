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

export const { staticClasses, useClasses } = createClasses("HvNavigation", {
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.xs,
  },
  icon: {},
  disabled: {},
  text: {
    minWidth: "unset",
    flex: 1,
    color: theme.colors.text,
    fontWeight: theme.typography.body.fontWeight,
    padding: 0,
  },
  textWithoutHover: {
    pointerEvents: "none",
  },
});
