import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationActions",
  {
    root: {
      display: "flex",
      flexDirection: "column",
      marginTop: "auto",

      gap: theme.space.xs,
    },
    hide: {
      display: "none",
    },
  },
);
