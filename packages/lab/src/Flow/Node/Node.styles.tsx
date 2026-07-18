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

import { staticClasses as baseNodeClasses } from "./BaseNode.styles";

const baseClasses = Object.fromEntries(
  Object.keys(baseNodeClasses).map((key) => [key, {}]),
) as Record<keyof typeof baseNodeClasses, {}>;

export const { staticClasses, useClasses } = createClasses("HvFlowNode", {
  subtitleContainer: {
    minHeight: 48,
    padding: theme.spacing("xs"),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtitle: {
    paddingLeft: theme.spacing("xs"),
  },
  inlineEditRoot: {
    display: "inline-flex",
    flexGrow: 1,
  },
  inlineEditButton: {
    justifyContent: "space-between",
  },
  actions: {},
  actionsButton: {
    gap: 0,
  },
  paramsContainer: {
    borderTop: `1px solid ${theme.colors.border}`,
    display: "flex",
    flexDirection: "column",
    gap: theme.space.xs,
    padding: theme.space.sm,
  },
  // Spread here to know if we are overriding classes from parents
  ...baseClasses,
});
