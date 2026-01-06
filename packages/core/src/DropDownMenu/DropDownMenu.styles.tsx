import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

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
