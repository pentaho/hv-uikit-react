import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvTagsInput", {
  root: { display: "inline-block", width: "100%" },
  tag: {
    maxWidth: "none",
  },
  disabled: {
    "& $tagsList": {
      backgroundColor: theme.colors.bgPage,
      "&,:hover": {
        borderColor: theme.colors.border,
      },
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
    padding: theme.spacing("xxs", "xs"),
    overflow: "auto",
    position: "relative",

    flexDirection: "row",
    flexWrap: "wrap",

    backgroundColor: theme.colors.bgContainer,
    borderWidth: 1,
    borderColor: theme.colors.textSubtle,
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
  singleLine: {},
  error: { float: "left" },
  inputExtension: {},
  suggestionsContainer: {},
  suggestionList: {},
});
