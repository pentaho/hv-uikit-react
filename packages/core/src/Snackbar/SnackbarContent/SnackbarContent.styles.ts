import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

const name = "HvSnackbarContent";
export const { useClasses, staticClasses } = createClasses(name, {
  root: {
    width: "525px",
    minHeight: "unset",
    maxHeight: "92px",
    padding: theme.space.xs,
    boxShadow: theme.colors.shadow,
  },
  success: {},
  error: {},
  default: {},
  warning: {},
  info: {},
  accent: {},
  message: {
    padding: 0,
    width: "100%",
    minHeight: "32px",
  },
  action: {},
  messageText: {
    paddingLeft: 0,
    maxHeight: "72px",
  },
  iconVariant: {
    alignSelf: "flex-start",
    margin: theme.space.xxs,
    marginRight: theme.space.sm,
  },
});
