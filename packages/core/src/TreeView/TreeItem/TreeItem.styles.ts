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

export const { staticClasses, useClasses } = createClasses("HvTreeItem", {
  /** Applied to the root element */
  root: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    outline: 0,
  },
  group: {
    margin: 0,
    padding: 0,
    marginLeft: theme.space.sm,
  },

  content: {
    padding: theme.spacing(0, 1),
    minHeight: 32, // TODO: review

    width: "100%",
    boxSizing: "border-box", // prevent width + padding to overflow
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    "&:hover:not($disabled)": {
      backgroundColor: theme.colors.bgHover,
    },
  },
  expanded: {},
  selected: {
    backgroundColor: theme.colors.bgPageSecondary,
  },
  focused: {
    backgroundColor: theme.colors.bgHover,
    "&:focus-visible": {
      ...outlineStyles,
    },
  },
  disabled: {
    cursor: "not-allowed",
    color: theme.colors.textDisabled,
    "& $label": {
      color: theme.colors.textDisabled,
    },
  },
  label: {
    paddingLeft: 4,
    width: "100%",
    boxSizing: "border-box",

    // fixes overflow
    minWidth: 0,
    position: "relative",
    ...theme.typography.body,
  },
  iconContainer: {
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",

    marginRight: 4,
    width: theme.space.sm,
    ":empty": {
      width: theme.space.xs,
    },
  },
});
