import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvDropDownMenu", {
  root: {
    flexShrink: 0,
    "--r": "calc(var(--HvButton-height) / 2)",
    "& > div": {
      height: "inherit",
    },
  },
  open: {
    boxShadow: theme.colors.shadow,
    "&[data-color=secondary]": {
      borderColor: theme.colors.textDimmed,
    },
  },
  menuListRoot: {
    padding: theme.space.sm,
  },
  menuList: {
    overflowClipMargin: theme.space.sm,
  },
});
