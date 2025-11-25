import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

// TODO - rename to HvHeaderActions (the actual component's name) in v6
export const { staticClasses, useClasses } = createClasses("HvHeader-Actions", {
  root: {
    backgroundColor: "transparent",
    display: "flex",
    gap: theme.space.xs,
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: "auto",
  },
});
