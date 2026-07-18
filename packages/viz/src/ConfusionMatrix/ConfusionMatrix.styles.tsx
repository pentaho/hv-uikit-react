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

export const { useClasses, staticClasses } = createClasses(
  "HvConfusionMatrix",
  {
    tooltipRoot: {
      backgroundColor: theme.colors.bgContainer,
      width: "fit-content",
      minWidth: 150,
      boxShadow: theme.colors.shadow,
      zIndex: theme.zIndices.sticky,
    },
    tooltipContainer: {
      padding: theme.spacing("15px", "sm"),
      display: "flex",
      flexDirection: "column",
    },
    tooltipText: {
      fontFamily: theme.fontFamily.body,
      fontWeight: theme.fontWeights.normal,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
    },
  },
);
