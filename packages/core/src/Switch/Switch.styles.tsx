import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvSwitch", {
  root: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {},
  error: {},
  container: {
    display: "flex",
    "&$left, &$right": {
      alignItems: "center",
    },
    "&$left": {
      flexDirection: "row",
      paddingLeft: theme.space.xs,
    },
    "&$right": {
      flexDirection: "row-reverse",
      paddingRight: theme.space.xs,
    },
    "&$top": {
      flexDirection: "column",
      "&&:hover": {
        backgroundColor: "transparent",
      },
    },
  },
  switchContainer: {
    height: "32px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderBottom: "1px solid transparent",
  },
  invalidSwitch: {
    paddingBottom: "1px",
    borderBottom: `1px solid ${theme.form.errorColor}`,
  },
  top: {},
  left: {
    "& .HvSwitch-label": {
      paddingBottom: 0,
      paddingRight: theme.space.xxs,
    },
  },
  right: {
    "& .HvSwitch-label": {
      paddingBottom: 0,
      paddingLeft: theme.space.xxs,
    },
  },
});
