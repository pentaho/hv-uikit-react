import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvActionBar", {
  root: {
    width: "100%",
    padding: theme.space.sm,
    borderTop: `1px solid ${theme.colors.borderSubtle}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
