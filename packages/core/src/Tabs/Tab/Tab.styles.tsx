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

import { outlineStyles } from "../../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvTab", {
  root: {
    marginTop: "3px",
    padding: theme.spacing(0, "sm"),
    minWidth: 70,
    minHeight: 32,
    textTransform: "none",
    ...theme.typography.body,
    borderRadius: `${theme.radii.base} ${theme.radii.base} 0 0`,
    "&:hover": {
      backgroundColor: theme.colors.bgHover,
      "&::after": {
        height: "1px",
        backgroundColor: theme.colors.border,
      },
    },
    "&$selected": {
      fontWeight: theme.typography.label.fontWeight,
    },
    "&$disabled": {
      color: theme.colors.textDisabled,
      cursor: "not-allowed",
      pointerEvents: "all",
      opacity: 1,
      "&:hover": {
        background: "none",
      },
    },
    opacity: 1,
    "&::after": {
      position: "absolute",
      left: 0,
      top: "calc(100% - 1px)",
      height: "1px",
      width: "100%",
      backgroundColor: theme.colors.border,
      content: "''",
    },
    // Override Mui styling: https://mui.com/material-ui/api/tab/#css
    "& .MuiTab-iconWrapper": {
      margin: 0,
    },
  },
  focusVisible: {
    ...outlineStyles,
  },
  selected: {},
  disabled: {},
});
