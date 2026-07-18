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
import { theme } from "@hitachivantara/uikit-react-core";

const styles = {
  root: css({
    marginTop: theme.space.md,
  }),
  board: css({
    display: "flex",
    gap: theme.space.sm,
  }),
  columnContainer: css({
    // This is needed because we need to have a set height on the column container so that
    // dnd-kit will work. In some edge cases (when content of the column is a single item with
    // a certain height) drag between columns wouldn't work.
    height: 100,
    width: "100%",
  }),
  column: css({
    flex: 1,
    padding: theme.spacing("sm", "xs"),
    borderRadius: theme.radii.large,
    backgroundColor: theme.colors.primaryDimmed,
  }),
  columnHeader: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.space.lg,
    padding: theme.spacing(0, "xs"),
    "&:hover": {
      cursor: "grab",
    },
  }),
  columnTitle: css({
    display: "flex",
    alignItems: "center",
    gap: theme.space.xs,
  }),
  columnCards: css({}),
  count: css({
    borderRadius: theme.radii.full,
    width: 20,
    height: 20,
    backgroundColor: theme.colors.border,
    display: "grid",
    placeItems: "center",
  }),
  card: css({
    borderRadius: theme.radii.round,
  }),
  cardHeader: css({
    "&:hover": {
      cursor: "grab",
    },
    backgroundColor: theme.colors.bgContainer,
    zIndex: 200,
    borderRadius: `${theme.radii.round} ${theme.radii.round} 0 0`,
  }),
  cardDeleteIcon: css({
    position: "absolute",
    top: theme.space.xs,
    right: theme.space.xs,
  }),
  cardSemanticBar: css({
    height: 20,
    borderRadius: theme.radii.round,
    top: -2,
  }),
  cardActions: css({
    borderTop: "none",
  }),
};

export default styles;
