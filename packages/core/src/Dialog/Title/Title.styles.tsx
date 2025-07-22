import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvDialogTitle", {
  root: {
    padding: theme.space.sm,
    paddingRight: 32 + 16, // close icon padding
    backgroundColor: "inherit",
    display: "flex",
    alignItems: "center",
    gap: theme.space.xs,
  },
  fullscreen: {},
  // TODO: consider deprecating
  textWithIcon: {},
});
