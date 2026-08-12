import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvBreadCrumb", {
  root: { display: "flex", alignItems: "center", zIndex: 0 },
  link: {
    height: 24,
    display: "flex",
    alignItems: "center",
    padding: `0px ${theme.space.xxs}`,
    fontWeight: theme.fontWeights.normal,
  },
  orderedList: {
    display: "flex",
    paddingLeft: 0,
    marginLeft: `-${theme.space.xs}`,
  },
  currentPage: {
    padding: `0 ${theme.space.xxs}`,
    fontWeight: theme.fontWeights.semibold,
  },
  centerContainer: {},
  separatorContainer: { padding: `0 ${theme.space.xxs}` },
  a: {},
});
