import { createClasses, outlineStyles } from "@pentaho/uikit-react-core";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvBlade", {
  root: {
    position: "relative",

    display: "flex",
    minWidth: 72,

    "& + $root": {
      marginLeft: theme.spacing("sm"),
    },

    transition: "flex-grow 600ms linear",

    zIndex: 0,

    color: theme.colors.text,
    backgroundColor: theme.colors.bgContainer,
    borderRadius: theme.radii.round,
    border: `1px solid ${theme.colors.border}`,
  },
  expanded: {},

  fullWidth: {
    flexGrow: 0,

    "&$expanded": {
      flexGrow: 1,
    },
  },

  heading: {},

  button: {
    height: "100%",
    minWidth: 70,

    "&[disabled], &:active": {
      outline: "none",
    },

    "&:focus": {
      outline: "none",
      background: theme.colors.bgHover,
    },

    "&:hover": {
      background: theme.colors.bgHover,
    },

    "&:focus-visible": {
      ...outlineStyles,
      zIndex: 1,
    },

    cursor: "pointer",
  },
  textOnlyLabel: {
    padding: theme.spacing("xs", "sm"),
  },

  container: {
    display: "inline-block",
    height: "100%",
    width: "100%",

    minWidth: 0,

    overflowX: "hidden",

    maxWidth: 0,
    transition: "max-width 600ms linear",
  },

  disabled: {
    cursor: "not-allowed",
    color: theme.colors.textDisabled,

    "&:focus": {
      background: "none",
    },

    "&:hover": {
      background: "none",
    },
  },
});
