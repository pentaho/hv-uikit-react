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
import { css } from "@emotion/css";
import { actionsGenericClasses, theme } from "@hitachivantara/uikit-react-core";

export const classes = {
  flow: css({
    width: "100%",
    height: "100%",
    // border style when a node is selected
    [`& .selected > div`]: {
      borderWidth: "2px",
      borderColor: theme.colors.primaryStrong,
    },
    " .react-flow": {
      minHeight: 700,
    },
  }),
  flowEmpty: css({ backgroundColor: "transparent" }),
  flowEmptyMessage: css({ color: theme.colors.textSubtle }),
  tabLabel: css({ display: "flex", alignItems: "center" }),
  root: css({
    minHeight: 700,
    height: "100%",
    display: "flex",
    width: "100%",
    position: "relative",
  }),
  titleRoot: css({
    display: "flex",
    width: "100%",
    alignItems: "center",
  }),
  dialogTitle: css({
    ...theme.typography.label,
    "& div > div": { margin: 0, padding: 0 },
  }),
  rightActions: css({
    [`& .${actionsGenericClasses.button}:not(:last-child)`]: {
      marginRight: 0,
    },
  }),
};
