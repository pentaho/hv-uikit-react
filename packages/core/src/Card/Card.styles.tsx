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

export const { staticClasses, useClasses } = createClasses("HvCard", {
  root: {
    overflow: "visible",
    position: "relative",
    outline: `1px solid ${theme.colors.border}`,
    "--rt": 0,
    "--rb": theme.radii.round,
    borderRadius: `var(--rt) var(--rt) var(--rb) var(--rb)`,
    backgroundColor: "var(--bg-color)",
    "&:focus-visible": {
      ...outlineStyles,
    },
    "&:focus": {
      outline: "none",
    },
  },
  selected: {
    "&,&:hover,&:focus": {
      outlineColor: theme.colors.text,
    },
  },
  selectable: {
    "&:hover": {
      outlineColor: theme.colors.primary,
    },
  },
  semanticContainer: {
    position: "relative",
    "& > *": {
      position: "absolute",
      zIndex: 1,
    },
  },
  icon: {
    top: theme.space.xs,
    right: theme.space.xs,
  },
  semanticBar: {
    backgroundColor: `var(--bar-color, ${theme.colors.border})`,
    height: "var(--bar-height, 2px)",
    width: "100%",
    top: -1,
    right: 0,
  },
});
