import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvBreadCrumbPage", {
  link: {
    padding: `8px ${theme.space.xs}`,
    borderRadius: theme.radii.base,
    maxWidth: 170 + 16,
    textTransform: "capitalize",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.colors.bgHover,
    },
    "&:focus": {
      backgroundColor: theme.colors.bgHover,
    },
    "&:focus-visible": {
      ...outlineStyles,
    },
  },
  label: {},
  a: {},
});
