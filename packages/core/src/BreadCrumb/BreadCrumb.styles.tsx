import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvBreadCrumb", {
  root: { display: "flex", alignItems: "center", zIndex: 0 },
  link: {
    height: 24,
    display: "flex",
    alignItems: "center",
    padding: `0px ${theme.space.xxs}`,
    fontWeight: theme.fontWeights.normal,

    borderRadius: theme.radii.base,
    maxWidth: 170 + 16,
    textTransform: "capitalize",
    ":hover,:focus": {
      backgroundColor: theme.colors.bgHover,
    },
    "&:focus-visible": {
      ...outlineStyles,
    },
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
});
