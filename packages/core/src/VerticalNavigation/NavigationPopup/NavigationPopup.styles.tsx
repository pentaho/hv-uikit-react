import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationPopup",
  {
    popup: {},
    container: {
      marginLeft: theme.spacing("xs"),
    },
    popper: {
      zIndex: theme.zIndices.popover,
    },
  },
);
