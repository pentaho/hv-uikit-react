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

export const { staticClasses, useClasses } = createClasses("HvFlowSidebar", {
  drawerPaper: { width: "360px" },
  titleContainer: {
    display: "flex",
    padding: theme.spacing("sm", "lg", "xs", "sm"),
  },
  contentContainer: { padding: theme.spacing(0, "lg", "sm", "lg") },
  description: { color: theme.colors.textSubtle },
  searchRoot: {
    paddingTop: theme.space.sm,
    paddingBottom: theme.space.sm,
  },
  groupsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.space.sm,
    listStyleType: "none",
  },
});
