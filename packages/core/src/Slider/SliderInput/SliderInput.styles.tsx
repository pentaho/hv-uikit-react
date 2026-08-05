import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvSliderInput", {
  root: {
    display: "flex",
    alignItems: "center",
    color: theme.colors.textSubtle,
    gap: theme.space.xs,
    fontSize: 16,
  },
  input: { maxWidth: "50px" },
});
