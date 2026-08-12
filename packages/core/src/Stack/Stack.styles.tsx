import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvStack", {
  root: {
    display: "flex",
  },
  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  divider: {
    borderColor: theme.colors.border,
  },
  xs: {
    gap: theme.space.xs,
  },
  sm: {
    gap: theme.space.sm,
  },
  md: {
    gap: theme.spacing(4),
  },
  lg: {
    gap: theme.spacing(6),
  },
  xl: {
    gap: theme.spacing(11),
  },
});
