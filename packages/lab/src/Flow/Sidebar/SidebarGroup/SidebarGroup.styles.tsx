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
  "HvFlowSidebarGroup",
  {
    root: {
      padding: theme.space.sm,
      borderRadius: theme.radii.round,
      borderWidth: "1px",
      borderTopWidth: "3px",
    },
    titleContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
    labelContainer: {
      display: "flex",
      alignItems: "center",
    },
    icon: { paddingRight: theme.space.xs },
    descriptionContainer: {
      padding: `${theme.space.xs} 0 ${theme.space.sm} calc(32px + ${theme.space.xs})`,
    },
    itemsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: theme.space.xs,
      paddingLeft: theme.space.sm,
    },
  },
);
