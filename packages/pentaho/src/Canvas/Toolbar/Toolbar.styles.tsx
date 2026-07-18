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

export const { staticClasses, useClasses } = createClasses("HvCanvasToolbar", {
  root: {
    width: `calc(100% - var(--sidepanel-width) - 2 * ${theme.space.sm})`,
    height: 54,
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.bgContainer,
    position: "absolute",
    right: theme.space.sm,
    top: 0,
  },
  back: {
    borderRadius: `${theme.radii.full} 0 0 ${theme.radii.full}`,
    minWidth: 68,
    backgroundColor: theme.colors.bgHover,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, "md"),
    height: "100%",
    flexGrow: 1,
  },
  actions: {
    display: "flex",
    flexWrap: "nowrap",
    overflow: "auto",
    paddingRight: theme.space.md,
  },
});
