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
import { createClasses, theme } from "@hitachivantara/uikit-react-core";

export const { staticClasses, useClasses } = createClasses(
  "HvCanvasBottomPanel",
  {
    root: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      right: 0,
      bottom: 0,
      width: "100%",
      maxHeight: "500px",
      visibility: "visible",
    },
    closed: {
      maxHeight: 0,
      visibility: "hidden",
    },
    minimized: {
      "& $content": {
        display: "none",
      },
      "& $tab": {
        backgroundColor: theme.colors.bgContainer,
        ...theme.typography.label,
      },
    },
    multipleTabs: {
      "& $tab": { maxWidth: "288px" },
    },
    overflowing: {},
    tab: {
      padding: theme.space.xs,
    },
    tabsRoot: {
      position: "relative",
    },
    leftActions: {},
    rightActions: {},
    actionsDisabled: {
      pointerEvents: "none",
      "&&& button": {
        pointerEvents: "none",
        "&,&:hover": {
          backgroundColor: "transparent",
          borderColor: "transparent",
        },
      },
    },
    content: { borderTopRightRadius: "var(--right-border-radius)" },
  },
);
