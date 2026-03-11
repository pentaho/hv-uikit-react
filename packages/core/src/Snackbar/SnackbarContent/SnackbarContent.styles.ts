import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

const name = "HvSnackbarContent";
export const { useClasses, staticClasses } = createClasses(name, {
  root: {
    width: "310px",
    minHeight: "52px",
    maxHeight: "92px",
    padding: theme.space.xs,
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
    paddingLeft: theme.space.xs,
    maxHeight: "72px",
  },
  iconVariant: {},
});
