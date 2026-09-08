import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvHeaderBrand", {
  root: { display: "flex", alignItems: "center" },
  separator: {
    width: 1,
    height: theme.space.sm,
    margin: theme.space.xs,
    backgroundColor: theme.colors.border,
  },
  brandName: {},
});
