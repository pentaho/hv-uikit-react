import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvBaseInput", {
  root: {
    // #region `input` style reset
    // Clears number input up/down arrows in Chrome and Firefox
    "input[type=number]": {
      MozAppearance: "textfield",
      "&::-webkit-outer-spin-button,&::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
    },

    // Clears time input clock in Chrome
    "input::-webkit-calendar-picker-indicator": {
      display: "none",
    },

    // Clears search input clear button in Chrome
    "input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration":
      {
        display: "none",
      },
    // #endregion

    display: "inline-flex",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    margin: 0,
    borderRadius: theme.radii.round,
    height: "32px",
    borderWidth: 1,
    borderColor: theme.colors.text,
    boxSizing: "border-box",
    backgroundColor: theme.colors.bgContainer,
    fontFamily: theme.fontFamily.body,
    alignItems: "stretch",
    ...theme.typography.body,

    ":hover:not($disabled,$readOnly)": {
      borderColor: theme.colors.primary,
    },
    ":focus-within:not($disabled)": {
      ...outlineStyles,
    },
  },
  disabled: {
    backgroundColor: theme.colors.bgPage,
    borderColor: theme.colors.textDisabled,

    cursor: "not-allowed",

    "&&::before": {
      borderBottomStyle: "none",
    },
  },
  invalid: {
    borderColor: theme.form.errorColor,
  },
  multiline: {
    padding: 0,
    overflow: "auto",
    height: "auto",

    "& $input": {
      borderRadius: theme.radii.base,
      height: "auto",
      minHeight: "21px",
      padding: "5px 10px",
      overflow: "auto",
      margin: 0,
    },
  },
  resizable: { width: "auto" },
  readOnly: {
    borderColor: theme.colors.textDisabled,
    backgroundColor: theme.colors.bgPage,
  },
  focused: {},
  input: {
    height: "100%",
    marginLeft: theme.space.xs,
    marginRight: theme.space.xs,
    padding: 0,
    backgroundColor: "transparent",
    overflow: "hidden",
    textOverflow: "ellipsis",
    outline: "none",
    width: "initial",
    flexGrow: 1,
    ...theme.typography.body,

    "&::placeholder": {
      opacity: 1,
      color: theme.colors.textSubtle,
    },
  },
  inputDisabled: {
    color: theme.colors.textDisabled,
    WebkitTextFillColor: theme.colors.textDisabled,
  },
  inputReadOnly: {
    color: theme.colors.textSubtle,
  },
  inputResizable: {
    resize: "both",
    width: "100%",
  },
});
