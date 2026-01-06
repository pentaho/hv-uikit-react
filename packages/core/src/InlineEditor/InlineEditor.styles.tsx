import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvInlineEditor", {
  root: {},
  input: {},
  inputRoot: {
    height: "100%",
    minHeight: "32px",
  },
  text: {},
  largeText: {},
  textEmpty: {
    color: theme.colors.textDisabled,
  },
  button: {
    padding: theme.spacing(0, "xs"),
    minHeight: "32px",

    boxSizing: "border-box",
    cursor: "text",
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    justifyContent: "start",
    textAlign: "start",
    alignItems: "center",

    backgroundColor: theme.colors.bgContainer,
    borderColor: "transparent",

    "&:hover, &:focus": {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.bgContainer,

      "& $icon": {
        visibility: "visible",
      },
    },

    "&:active": {
      borderColor: theme.colors.text,
      backgroundColor: "transparent",

      "& $icon": {
        visibility: "visible",
      },
    },
  },
  icon: {
    cursor: "pointer",
    visibility: "hidden",
    alignSelf: "center",
  },
  iconVisible: {
    visibility: "visible",
  },
});
