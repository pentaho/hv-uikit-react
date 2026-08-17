import { createClasses } from "@pentaho/uikit-react-utils";
import { slate, theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvTagsInput", {
  root: { display: "inline-block", width: "100%" },
  tag: {
    maxWidth: "none",
  },
  disabled: {
    "& $tagsList": {
      backgroundColor: theme.colors.bgDisabled,
      "&,:hover": {
        borderColor: theme.colors.textDisabled,
      },
    },
    "& $tag": {
      outlineColor: theme.colors.textDisabled,
    },
  },
  readOnly: {
    "& $tagsList": {
      backgroundColor: theme.colors.bgPage,
      "&,:hover": {
        borderColor: theme.colors.textDisabled,
      },
    },
  },
  resizable: { width: "auto", resize: "both", clear: "both", overflow: "auto" },
  invalid: {},
  labelContainer: {},
  label: {},
  description: {},
  characterCounter: {
    display: "block",
    float: "right",
    textAlign: "right",
    marginBottom: "6px",
  },
  tagsList: {
    display: "flex",
    alignItems: "center",
    alignContent: "flex-start",
    gap: theme.space.xxs,
    cursor: "text",
    width: "100%",
    minHeight: 32,
    padding: theme.space.xxs,
    overflow: "auto",
    position: "relative",

    flexDirection: "row",
    flexWrap: "wrap",

    backgroundColor: `light-dark(${theme.colors.dimmer}, ${slate[950]})`,
    borderWidth: 1,
    borderColor: theme.colors.textDimmed,
    borderRadius: theme.radii.round,

    "&:hover": {
      borderColor: theme.colors.primary,
    },

    "&:focus-within, &:focus-visible": {
      ...outlineStyles,
    },

    "&$singleLine": {
      flexWrap: "nowrap",
    },

    "&$error, $invalid": {
      borderColor: theme.form.errorColor,
    },
  },
  input: {
    display: "flex",
    flex: "1 0 auto",
    height: "auto",
    width: 0,
    minWidth: 60,
    border: "none",
    margin: 0,
    padding: 0,
    ...theme.typography.body,
    backgroundColor: "transparent",
    outline: "none",
    boxShadow: "none",

    "&::placeholder": {
      color: theme.colors.textSubtle,
    },
  },
  singleLine: { height: 32 },
  error: { float: "left" },
  inputExtension: {},
  suggestionsContainer: {},
  suggestionList: {},
});
