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

    "& .HvBaseSwitch-switchBase": {
      "& .HvBaseSwitch-thumb": {
        borderColor: "transparent",
        backgroundColor: "#FFFFFF",
        left: -8,
        top: -3,
        width: 14,
        height: 14,
      },
      "+.HvBaseSwitch-track": {
        backgroundColor: theme.colors.textDimmed,
        border: "none",
        width: 40,
        height: 18,
      },
      "&.HvBaseSwitch-checked": {
        "+.HvBaseSwitch-track": {
          backgroundColor: theme.colors.positive,
        },
        "& .HvBaseSwitch-thumb": {
          left: -2,
        },
      },
      "&.HvBaseSwitch-disabled": {
        "& .HvBaseSwitch-thumb": {
          borderColor: theme.colors.textDisabled,
        },
        "+.HvBaseSwitch-track": {
          backgroundColor: theme.colors.bgDisabled,
          border: "none",
        },
      },
      "&[data-size=medium]": {
        "+.HvBaseSwitch-track": {
          width: 48,
          height: 24,
        },
        "& .HvBaseSwitch-thumb": {
          left: -5,
          top: 0,
          width: 16,
          height: 16,
        },
        "&.HvBaseSwitch-checked .HvBaseSwitch-thumb": {
          left: 3,
          top: 0,
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
  readOnly: {
    ":hover": {
      backgroundColor: "transparent",
    },
    "& .HvBaseSwitch-switchBase + .HvBaseSwitch-track": {
      backgroundColor: theme.colors.border,
    },
    "& .HvBaseSwitch-switchBase.HvBaseSwitch-checked + .HvBaseSwitch-track": {
      backgroundColor: theme.mix("positive", 0.5, "dimmer"),
    },
  },
  focusVisible: {
    borderRadius: theme.radii.round,
    ...outlineStyles,
  },
});
