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

export const { staticClasses, useClasses } = createClasses("HvSkeleton", {
  root: {
    backgroundColor: theme.colors.bgPageSecondary,
    width: "fit-content",
    "& > *": {
      visibility: "hidden",
    },
  },
  content: {
    opacity: 0,
    animation: "fadeIn 0.5s ease forwards",

    "@keyframes fadeIn": {
      to: {
        opacity: 1,
      },
    },
  },
  circle: {
    borderRadius: theme.radii.full,
  },
  square: {
    borderRadius: theme.radii.base,
  },
  text: {
    borderRadius: theme.radii.full,
    width: "100%",
    height: "1.5em",
  },
  pulse: {
    animation: "pulse 2s infinite",

    "@keyframes pulse": {
      "50%": {
        opacity: "0.5",
      },
    },
  },
  wave: {
    overflow: "hidden",
    position: "relative",
    "&::after": {
      animation: "wave 2s linear 0.5s infinite",
      background: `linear-gradient(
            90deg,
            transparent,
            ${theme.colors.border},
            transparent
          )`,
      content: "''",
      position: "absolute",
      transform: "translateX(-100%)",
      inset: 0,

      // Animation taken from Material UI:
      // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Skeleton/Skeleton.js
      "@keyframes wave": {
        "0%": {
          transform: "translateX(-100%)",
        },
        "50%": {
          transform: "translateX(100%)",
        },
        "100%": {
          transform: "translateX(100%)",
        },
      },
    },
  },
});
