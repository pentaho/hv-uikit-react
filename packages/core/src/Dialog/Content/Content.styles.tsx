import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvDialogContent", {
  root: {
    padding: theme.spacing(0, "sm", "sm"),
    borderColor: theme.colors.borderSubtle,
    borderTopWidth: "var(--borderW)",
    borderBottomWidth: "var(--borderW)",
  },
  textContent: {
    paddingLeft: `calc(42px + ${theme.space.sm})`,
    paddingRight: "62px",
    overflowY: "auto",
  },
});
