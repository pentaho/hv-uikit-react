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

export const { staticClasses, useClasses } = createClasses("HvAppSwitcher", {
  root: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  item: {},
  itemSelected: {},
  itemDisabled: {},
  itemTrigger: {},
  itemIcon: {},
  itemTitle: {},
  itemInfoIcon: {},
  actionsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",

    overflowY: "auto",
    gap: theme.space.xs,
    padding: 4,
    margin: -4,
  },
  footerContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "auto",
    height: 52,
    paddingTop: theme.space.sm,
  },
  open: {
    zIndex: theme.zIndices.overlay,
    position: "absolute",
    top: "50px",
    overflowX: "hidden",
    boxShadow: theme.colors.shadow,
  },
  closed: { display: "none" },
  title: {
    minHeight: 36,
    paddingBottom: theme.space.sm,
    ...theme.typography.label,
  },
  titleAnchor: {
    WebkitLineClamp: 2,
  },
  single: { width: 280 + 40 },
  dual: { width: 560 + 40 },
  fluid: {},
});
