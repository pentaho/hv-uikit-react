import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvDropDownMenu", {
  root: {
    flexShrink: 0,
    "& > div": {
      height: "inherit",
    },
  },
  open: {
    boxShadow: theme.colors.shadow,
  },
  menuListRoot: {
    padding: theme.space.sm,
  },
  menuList: {
    overflowClipMargin: theme.space.sm,
  },
});
