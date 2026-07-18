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

export const { staticClasses, useClasses } = createClasses("HvFlowBaseNode", {
  root: {
    borderRadius: theme.radii.round,
    backgroundColor: theme.colors.bgContainer,
    boxShadow: theme.colors.shadow,
    minWidth: "250px",
    border: "1px solid var(--node-color)",
  },
  headerContainer: {
    padding: theme.spacing(0.5, 1),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: "inherit",
    borderTopRightRadius: "inherit",
    backgroundColor: "var(--node-color)",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& svg *.color0": { fill: "var(--icon-color)" },
  },
  title: {
    color: theme.colors.textDark,
  },
  inputsTitleContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.space.xs,
    backgroundColor: theme.colors.bgPage,
    borderTop: `1px solid ${theme.colors.borderSubtle}`,
    borderBottom: `1px solid ${theme.colors.borderSubtle}`,
  },
  outputsTitleContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.space.xs,
    backgroundColor: theme.colors.bgPage,
    borderTop: `1px solid ${theme.colors.borderSubtle}`,
    borderBottom: `1px solid ${theme.colors.borderSubtle}`,
  },
  contentContainer: {},
  inputsContainer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.space.sm,
    gap: theme.space.xs,
    alignItems: "flex-start",
  },
  outputsContainer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.space.sm,
    gap: theme.space.xs,
    alignItems: "flex-end",
  },
  inputGroupContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.space.xs,
    alignItems: "flex-start",
  },
  outputGroupContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.space.xs,
    alignItems: "flex-end",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  outputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  handle: {
    zIndex: theme.zIndices.overlay,
    marginLeft: 2,
    backgroundColor: theme.colors.bgContainer,
    height: 10,
    width: 10,
    border: `1px solid ${theme.colors.textDisabled}`,
    "&.react-flow__handle-left": {
      left: -23,
    },
    "&.react-flow__handle-right": {
      right: -21,
    },
    "&.react-flow__handle-connecting": {
      backgroundColor: theme.colors.negativeDimmed,
    },
    "&.react-flow__handle-valid": {
      backgroundColor: theme.colors.positiveDimmed,
    },
    "::before": {
      fontSize: 14,
      color: theme.colors.textDisabled,
      content: '"+"',
      marginTop: -7,
      position: "absolute",
    },
  },
  handleConnected: {
    backgroundColor: theme.colors.textDisabled,
    width: 8,
    height: 8,

    "::before": {
      fontSize: 11,
      marginTop: -8,
    },
  },
  mandatory: {
    width: 10,
    height: 10,
    margin: theme.spacing(0, theme.space.xs),
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.negativeDimmed,
  },
  footerContainer: {
    padding: theme.space.sm,
    borderTop: `1px solid ${theme.colors.borderSubtle}`,
  },
});
