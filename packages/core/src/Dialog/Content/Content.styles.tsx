import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvDialogContent", {
  root: {
    padding: theme.spacing(0, "sm", "sm"),
    borderColor: theme.colors.borderSubtle,
  },
  textContent: {
    paddingLeft: `calc(42px + ${theme.space.sm})`,
    paddingRight: "62px",
    overflowY: "auto",
  },
});
