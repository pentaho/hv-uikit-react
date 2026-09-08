import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvFooter", {
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space.xs,
    padding: theme.spacing("xs", "sm"),
    height: 40,
    bottom: 0,
    zIndex: theme.zIndices.base,
    backgroundColor: theme.colors.bgContainer,
    boxShadow: `0 -1px 0 ${theme.colors.border}`,
  },
  name: {},
  rightContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "auto",
  },
  copyright: {},
  separator: {
    width: 1,
    height: 16,
    backgroundColor: theme.colors.text,
    margin: theme.spacing("xs", "sm"),
  },
  small: {
    "&$root": {
      height: "unset",
      flexDirection: "column",
      padding: theme.space.xs,
    },
    "& $rightContainer": {
      display: "contents",
    },
    "& $separator": { display: "none" },
  },
});
