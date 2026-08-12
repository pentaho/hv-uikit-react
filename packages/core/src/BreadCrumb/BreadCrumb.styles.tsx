import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvBreadCrumb", {
  root: { display: "flex", alignItems: "center", zIndex: 0 },
  link: {},
  orderedList: {
    display: "flex",
    paddingLeft: 0,
    marginLeft: `-${theme.space.xs}`,
  },
  currentPage: { padding: `8px ${theme.space.xs}` },
  centerContainer: {},
  separatorContainer: {},
  a: {},
});
