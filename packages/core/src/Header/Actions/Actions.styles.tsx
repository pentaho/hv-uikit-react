import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

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
