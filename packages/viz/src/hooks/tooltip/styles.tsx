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

export const { useClasses, staticClasses } = createClasses("HvChartTooltip", {
  /** Single tooltip styles */
  singleTooltipRoot: {
    width: "fit-content",
    boxShadow: theme.colors.shadow,
    backgroundColor: theme.colors.bgContainer,
    padding: theme.space.sm,
    display: "flex",
  },
  singleTooltipTitle: {
    fontFamily: theme.fontFamily.body,
    fontWeight: theme.fontWeights.semibold,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
  singleTooltipValue: {
    fontFamily: theme.fontFamily.body,
    fontWeight: theme.fontWeights.normal,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    marginLeft: theme.space.xs,
  },
  /** Multiple tooltip styles */
  multipleTooltipRoot: {
    width: "fit-content",
    boxShadow: theme.colors.shadow,
    backgroundColor: theme.colors.bgContainer,
  },
  multipleTooltipTitleContainer: {
    padding: `15px ${theme.space.sm}`,
    borderBottom: `3px solid ${theme.colors.bgPage}`,
  },
  multipleTooltipTitle: {
    fontFamily: theme.fontFamily.body,
    fontWeight: theme.fontWeights.semibold,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
  multipleTooltipValuesContainer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.space.sm,

    "& > *:not(:last-child)": { paddingBottom: theme.space.sm },
  },
  multipleTooltipSeriesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  multipleTooltipSeriesNameContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.space.sm,
  },
  multipleTooltipSeriesColor: {
    width: "10px",
    height: "10px",
    marginRight: "5px",
  },
  multipleTooltipSeriesName: {
    fontFamily: theme.fontFamily.body,
    fontWeight: theme.fontWeights.semibold,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
  multipleTooltipSeriesValue: {
    fontFamily: theme.fontFamily.body,
    fontWeight: theme.fontWeights.normal,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
});
