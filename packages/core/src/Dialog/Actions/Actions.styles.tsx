import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvDialogAction", {
  root: {
    margin: 0,
    padding: theme.space.sm,
    backgroundColor: "inherit",
    borderTop: `1px solid ${theme.colors.border}`,
    height: 65,
    maxHeight: 65,
  },
  fullscreen: { position: "fixed", width: "100%", bottom: 0, left: 0 },
  spacing: {
    "& > :not(:first-of-type)": {
      marginLeft: theme.space.xs,
    },
  },
});
