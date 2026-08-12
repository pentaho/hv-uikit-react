import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvHeaderActions", {
  root: {
    backgroundColor: "transparent",
    display: "flex",
    gap: theme.space.xs,
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: "auto",
  },
});
