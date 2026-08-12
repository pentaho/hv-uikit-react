import { createClasses } from "@pentaho/uikit-react-utils";
import { theme, type HvSize } from "@pentaho/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvButton", {
  /** applied to the root element */
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",

    // Background color common for almost all variants
    ":where(:not($disabled))": {
      ":hover, :focus-visible": {
        backgroundColor: theme.colors.bgHover,
      },
    },
    ":focus-visible": {
      ...outlineStyles,
    },

    // Default button - no size specified
    fontFamily: theme.fontFamily.body,
    ...theme.typography.label,
    color: "var(--color, currentcolor)",
    backgroundColor: "transparent",
    height: "var(--HvButton-height, fit-content)",
    border: "1px solid transparent",
    borderRadius: `var(--radius, ${theme.radii.base})`,
    padding: theme.spacing(0, "sm"),

    // remove icon container spacing
    "--icsize": "auto",

    "& $startIcon, & $endIcon": {
      flexShrink: 0,
      lineHeight: 0,
      minWidth: 16,
    },

    ":where(:not($disabled,$contained))": {
      "&[data-color=positive]": { color: theme.colors.positive },
      "&[data-color=warning]": { color: theme.colors.warning },
      "&[data-color=negative]": { color: theme.colors.negative },
      ":hover": { backgroundColor: theme.colors.primaryDimmed },
      ":active": { backgroundColor: theme.colors.primarySubtle },
    },
  },
  /** applied to the _left_ icon container */
  startIcon: {
    marginRight: 8,
  },
  /** applied to the _right_ icon container */
  endIcon: {
    marginLeft: 8,
  },
  focusVisible: {},
  /** applied to the root element when disabled */
  disabled: {
    cursor: "not-allowed",
    color: theme.colors.textDisabled,
    backgroundColor: theme.colors.bgDisabled,
    borderColor: "transparent",
    ":hover, :focus-visible": {
      backgroundColor: theme.colors.bgDisabled,
      borderColor: "transparent",
    },
    ":not($ghost)": {
      borderColor: "transparent",
      "&,:hover,:active": {
        backgroundColor: theme.colors.bgDisabled,
      },
    },
  },
  /** applied to the root element when is icon-only */
  icon: {
    margin: 0,
    padding: 0,
    flexShrink: 0,
    width: "var(--HvButton-height, fit-content)",
  },
  /** applied to the root element when using the `contained` variant */
  contained: {
    color: theme.colors.textDimmed, // `color-contrast(var(--color) vs ${colors.textDimmed}, ${colors.textLight}, ${colors.textDark})`,
    backgroundColor: "var(--color)",
    ":where(:not($disabled))": {
      ":hover, :focus-visible": {
        backgroundColor: theme.mix("var(--color)", 0.8, "black"),
      },
      ":active": {
        backgroundColor: theme.mix("var(--color)", 0.7, "black"),
      },
      color: "#FFFFFF",
      "&[data-color=primary]": {
        backgroundColor: theme.colors.primary,
        ":hover": { backgroundColor: theme.colors.primaryStrong },
        ":active": { backgroundColor: theme.colors.primaryDeep },
      },
      "&[data-color=positive]": {
        ":hover": { backgroundColor: theme.colors.positiveDeep },
        ":active": { backgroundColor: theme.colors.positiveStrong },
      },
      "&[data-color=warning]": {
        ":hover": { backgroundColor: theme.colors.warningDeep },
        ":active": { backgroundColor: theme.colors.warningStrong },
      },
      "&[data-color=negative]": {
        ":hover": { backgroundColor: theme.colors.negativeDeep },
        ":active": { backgroundColor: theme.colors.negativeStrong },
      },
    },
  },
  /** applied to the root element when using the `subtle` variant */
  subtle: {
    borderColor: theme.alpha("currentcolor", 0.4),
    ":where(:not($disabled))": {
      "&[data-color=primary]": {
        borderColor: theme.colors.primarySubtle,
        backgroundColor: theme.colors.primaryDimmed,
      },
      "&[data-color=secondary]": {
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.bgPage,
      },
      ":hover": {
        backgroundColor: theme.colors.primaryDimmed,
      },
      ":active": {
        borderColor: "transparent",
        backgroundColor: theme.colors.primarySubtle,
      },
      "&[data-color=positive]": {
        borderColor: theme.colors.positiveBorder,
        backgroundColor: theme.colors.positiveDimmed,
        ":hover": { backgroundColor: theme.colors.positiveSubtle },
        ":active": {
          backgroundColor: theme.colors.positiveBorder,
        },
      },
      "&[data-color=warning]": {
        borderColor: theme.colors.warningBorder,
        backgroundColor: theme.colors.warningDimmed,
        ":hover": { backgroundColor: theme.colors.warningSubtle },
        ":active": { backgroundColor: theme.colors.warningBorder },
      },
      "&[data-color=negative]": {
        borderColor: theme.colors.negativeBorder,
        backgroundColor: theme.colors.negativeDimmed,
        ":hover": { backgroundColor: theme.colors.negativeSubtle },
        ":active": {
          backgroundColor: theme.colors.negativeBorder,
        },
      },
    },
  },
  /** applied to the root element when using the `ghost` variant */
  ghost: {
    ":where(:not($disabled))": {
      "&[data-color=positive]": {
        ":hover": { backgroundColor: theme.colors.positiveDimmed },
        ":active": { backgroundColor: theme.colors.positiveSubtle },
      },
      "&[data-color=warning]": {
        ":hover": { backgroundColor: theme.colors.warningDimmed },
        ":active": { backgroundColor: theme.colors.warningSubtle },
      },
      "&[data-color=negative]": {
        ":hover": { backgroundColor: theme.colors.negativeDimmed },
        ":active": { backgroundColor: theme.colors.negativeSubtle },
      },
    },
  },
  /** applied to the root element when using the `semantic` variant */
  semantic: {
    color: theme.colors.textDark,
    backgroundColor: "transparent",
    borderColor: "transparent",
    "&:hover, &:focus-visible": {
      backgroundColor: theme.alpha("textLight", 0.3),
    },
    "&:active": {
      backgroundColor: theme.alpha("textLight", 0.5),
    },
    "&$disabled": {
      backgroundColor: theme.alpha("textLight", 0.1),
    },
  },
});

// TODO - remove xs and xl in v6 since they are not DS spec
const sizes: Record<
  HvSize,
  { height: string; space?: HvSize; fontSize?: keyof typeof theme.fontSizes }
> = {
  xs: { height: "24px", fontSize: "sm" },
  sm: { height: "24px", fontSize: "sm" },
  md: { height: "32px" },
  lg: { height: "48px", space: "md" },
  xl: { height: "48px", space: "md" },
};

export const getSizeStyles = (size: HvSize) => {
  const { height, space = "sm", fontSize } = sizes[size];
  return {
    height,
    padding: theme.spacing(0, space),
    fontSize: fontSize && theme.fontSizes[fontSize],
  };
};

export const getIconSizeStyles = (size: HvSize) => {
  const { height } = sizes[size];
  return {
    height,
    width: height,
  };
};
