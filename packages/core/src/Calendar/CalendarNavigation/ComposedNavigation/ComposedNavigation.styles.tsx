import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvComposedNavigation",
  {
    navigationContainer: {
      display: "flex",
      justifyContent: "space-between",
      paddingBottom: theme.space.xs,
    },
    navigationMonth: {
      minWidth: "160px",
    },
  },
);
