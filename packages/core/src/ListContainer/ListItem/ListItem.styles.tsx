import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { outlineStyles } from "../../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvListItem", {
  root: {
    ...theme.typography.body,
    padding: 0,
    display: "block",
    height: "32px",
    lineHeight: "32px",
    listStyleType: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    position: "relative",
    alignContent: "center",

    "&:not(:last-child)": {
      marginBottom: "8px",
    },

    "&$condensed": {
      marginBottom: 0,
    },

    "&.HvIsFocused:focus-visible": {
      ...outlineStyles,
      backgroundColor: theme.colors.bgPageSecondary,
      zIndex: 2,
    },
  },
  focus: {
    "&:focus-visible": {
      backgroundColor: theme.colors.bgPageSecondary,
      zIndex: 2,
    },
  },
  gutters: {
    padding: `0 ${theme.space.xs}`,

    ":has($startAdornment)": {
      paddingLeft: 0,
    },
    ":has($endAdornment)": {
      paddingRight: 0,
    },
  },
  condensed: {},
  interactive: {
    cursor: "pointer",
    "&:not($disabled):not($selected):hover": {
      backgroundColor: theme.colors.bgHover,
    },
    "&$disabled": {
      cursor: "not-allowed",
    },
  },
  selected: { backgroundColor: theme.colors.bgHover },
  disabled: {
    color: theme.colors.textDisabled,
    backgroundColor: theme.colors.bgDisabled,
  },
  startAdornment: {
    float: "left",
  },
  endAdornment: {
    float: "right",
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    margin: `${theme.space.xs} calc(${theme.space.sm} * -1)`,
    border: "none",
    padding: 0,
    listStyleType: "none",
    "&:last-child": {
      display: "none",
    },
  },
});
