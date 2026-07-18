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
  "HvVerticalNavigationSlider",
  {
    root: {
      display: "flex",
      alignItems: "center",
      borderLeft: `4px solid transparent`,
      minHeight: "48px",
      color: "inherit",
      marginBottom: "8px",
      "& > button": {
        marginLeft: "auto",
      },
    },
    listItemSelected: {
      backgroundColor: theme.colors.bgPageSecondary,
      borderLeft: `4px solid ${theme.colors.text}`,
    },
    listItemFocus: {
      backgroundColor: theme.colors.bgPageSecondary,
    },
    forwardButton: {
      color: "inherit",
    },
    listContainer: {},
    listItemDisabled: {},
  },
);
