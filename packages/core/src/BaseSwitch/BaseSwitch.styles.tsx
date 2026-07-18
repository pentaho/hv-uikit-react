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

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvBaseSwitch", {
  root: {
    padding: theme.space.xs,
    cursor: "pointer",
    width: "fit-content",
    height: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.round,

    "&:hover": {
      backgroundColor: theme.colors.bgHover,
    },

    // Higher CSS specificity here
    "& $switchBase": {
      "&:hover": {
        backgroundColor: "transparent",
      },

      "&$checked": {
        transform: "translateX(16px)",
        "& + $track": {
          opacity: 1,
          backgroundColor: theme.colors.primary,
          borderColor: "transparent",
        },
        "&:not($disabled) $thumb": {
          borderColor: "transparent",
        },
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },

    // Higher CSS specificity here
    "&$disabled": {
      "& $switchBase": {
        "& + $track": {
          opacity: 1,
          backgroundColor: theme.colors.bgDisabled,
          border: `solid 1px ${theme.colors.borderDisabled}`,
        },
      },
    },
  },
  switch: {
    width: "40px",
    height: "32px",
    padding: 0,

    "&$readOnly $switchBase": {
      cursor: "default",
    },
  },
  switchBase: {
    width: "40px",
    height: "32px",
    padding: 0,
    "&[data-size=medium]": {
      "+.HvBaseSwitch-track": {
        width: 48,
        height: 22,
      },
      "& $thumb": {
        left: -2,
        top: 3,
        width: 18,
        height: 18,
      },
      "&$checked $thumb": {
        left: 8,
        top: 3,
      },
    },
  },
  track: {
    opacity: 1,
    borderRadius: theme.radii.full,
    height: "16px",
    width: "32px",

    border: `solid 1px ${theme.colors.borderStrong}`,
    backgroundColor: theme.colors.bgContainer,
  },
  thumb: {
    position: "relative",
    left: "-5px",
    width: "10px",
    height: "10px",

    border: `solid 1px ${theme.colors.borderStrong}`,
    backgroundColor: theme.colors.bgContainer,
    marginLeft: "2px",
    marginTop: 0,
    boxShadow: "none",
  },
  checked: {},
  disabled: {
    cursor: "not-allowed",

    "& $switch": {
      cursor: "not-allowed",
    },

    "& $thumb": {
      backgroundColor: theme.colors.bgPageSecondary,
      border: `solid 1px ${theme.colors.textDisabled}`,
    },
  },
  readOnly: {},
  focusVisible: {
    borderRadius: theme.radii.round,
    ...outlineStyles,
  },
});
