import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvBaseSwitch", {
  root: {
    padding: theme.space.xxs,
    cursor: "pointer",
    width: "fit-content",
    height: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.full,

    "&:hover": {
      backgroundColor: theme.colors.bgHover,
    },
  },
  switch: {
    width: "40px",
    height: "32px",
    padding: 0,

    "& $switchBase": {
      width: "40px",
      height: "32px",
      padding: 0,

      "&:hover": {
        backgroundColor: "transparent",
      },

      "& $thumb": {
        borderColor: "transparent",
        backgroundColor: "#FFFFFF",
        left: -8,
        top: -3,
        width: 14,
        height: 14,
      },

      "& + $track": {
        opacity: 1,
        backgroundColor: theme.colors.textDimmed,
        border: "none",
        width: 40,
        height: 18,
      },

      "&$checked": {
        transform: "translateX(16px)",

        "& + $track": {
          opacity: 1,
          backgroundColor: theme.colors.positive,
          borderColor: "transparent",
        },

        "&:not($disabled) $thumb": {
          borderColor: "transparent",
        },

        "& $thumb": {
          left: -2,
        },

        "&:hover": {
          backgroundColor: "transparent",
        },
      },

      "&$disabled": {
        "& $thumb": {
          backgroundColor: "#FFFFFF",
          borderColor: theme.colors.textDisabled,
        },

        "& + $track": {
          opacity: 1,
          backgroundColor: theme.colors.bgDisabled,
          border: "none",
        },
      },
    },

    "&[data-size=medium] $switchBase": {
      "& + $track": {
        width: 48,
        height: 24,
      },

      "& $thumb": {
        left: -5,
        top: 0,
        width: 16,
        height: 16,
      },

      "&$checked $thumb": {
        left: 3,
        top: 0,
      },
    },

    "&$readOnly $switchBase": {
      cursor: "default",
    },
  },
  switchBase: {
    width: "40px",
    height: "32px",
    padding: 0,
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
      backgroundColor: "#FFFFFF",
      border: `solid 1px ${theme.colors.textDisabled}`,
    },
  },
  readOnly: {
    ":hover": {
      backgroundColor: "transparent",
    },
    "& $switchBase + $track": {
      backgroundColor: theme.colors.border,
    },
    "& $switchBase$checked + $track": {
      backgroundColor: theme.mix("positive", 0.5, "dimmer"),
    },
  },
  focusVisible: {
    borderRadius: theme.radii.round,
    ...outlineStyles,
  },
});
