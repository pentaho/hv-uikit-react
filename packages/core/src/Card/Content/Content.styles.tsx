import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvCardContent", {
  content: {
    padding: theme.space.sm,
    paddingBottom: 0,
    "&& + .HvCardMedia-root": {
      paddingTop: theme.space.xs,
    },
  },
});
