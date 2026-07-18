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

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigation",
  {
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",

      width: "220px",

      backgroundColor: theme.colors.bgContainer,
      boxShadow: theme.colors.shadow,
      clipPath: "inset(0px -12px 0px 0px)",

      "& > :only-child": {
        padding: theme.space.sm,
      },
      "& > :not(nav:first-of-type)": {
        borderTop: `3px solid ${theme.colors.borderSubtle}`,
        padding: theme.spacing("xs", "sm", "sm", "sm"),
      },

      "& > :first-of-type:not(:last-child)": {
        borderTop: "none",
        padding: theme.spacing("sm", "sm", "xs", "sm"),
      },
    },
    collapsed: {
      width: "fit-content",
      "& > :first-of-type:not(:last-child)": {
        padding: theme.spacing("sm", "xs", "xs", "xs"),
      },

      "& > :not(nav:first-of-type)": {
        padding: theme.spacing("xs", "xs", "sm", "xs"),
      },
    },

    slider: {
      "& > div:first-of-type": {
        borderBottom: `3px solid ${theme.colors.borderSubtle}`,
      },
    },

    childData: {},
  },
);
