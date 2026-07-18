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

const name = "HvFilterGroupContent";

export const { staticClasses, useClasses } = createClasses(name, {
  dropdown: {},
  panel: {
    maxHeight: 500,
    minHeight: 370,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    height: 32,
  },
  baseDropdownSelection: {
    padding: theme.spacing("0px", "30px", "0px", "0px"),
  },
  root: {
    width: 640,
    maxHeight: "calc(500px - 75px)",
    minHeight: "calc(370px - 75px)",
  },
  rightSidePanel: {
    display: "inline-block",
    width: "50%",
    height: "100%",
    maxHeight: "calc(500px - 75px)",
    minHeight: "calc(370px - 75px)",
    verticalAlign: "top",
    overflow: "visible",
    boxShadow: "none",
    borderLeft: `1px solid ${theme.colors.bgPageSecondary}`,
  },
  leftSidePanel: {
    display: "inline-block",
    width: "50%",
    height: "100%",
    verticalAlign: "top",
    maxHeight: "calc(500px - 75px)",
    minHeight: "calc(370px - 75px)",
  },
  actionBar: {},
  actions: {
    display: "flex",
    gap: theme.space.xs,
  },
  space: {
    flex: 1,
  },
  applyButton: {},
});
