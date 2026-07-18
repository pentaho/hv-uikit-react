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

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvCheckBox", {
  root: { display: "inline-block" },
  container: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    borderRadius: theme.radii.base,

    "&:hover:not($disabled)": {
      backgroundColor: theme.colors.bgHover,
    },
    ":where(:has($label)) $checkbox": {
      borderRadius: "inherit",
    },
  },
  invalidContainer: {},
  disabled: {
    cursor: "not-allowed",
    "& $label": { color: theme.colors.textDisabled, cursor: "not-allowed" },
  },
  focusVisible: {
    backgroundColor: theme.colors.bgPageSecondary,
    ...outlineStyles,
  },
  checkbox: {},
  invalidCheckbox: {},
  label: {
    verticalAlign: "middle",
    ...theme.typography.body,
    cursor: "pointer",
    lineHeight: "32px",
    flex: 1,
  },
  checked: {},
  indeterminate: {},
  semantic: {},
  left: {
    "& $label": {
      paddingLeft: theme.space.xs,
      textAlign: "right",
    },
    "& $container": {
      flexDirection: "row-reverse",
      // justifyContent: "flex-end",
    },
  },
  right: {
    "& $label": {
      paddingRight: theme.space.xs,
    },
  },
});
