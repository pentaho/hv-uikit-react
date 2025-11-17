import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { useClasses, staticClasses } = createClasses("HvBannerContent", {
  root: {
    minWidth: "100%",
    width: "100%",
    position: "relative",
    gap: theme.space.xs,
  },
  success: {},
  warning: {},
  error: {},
  default: {},
  info: {},
  accent: {},
  message: {
    gap: theme.space.xs,
    ...theme.typography.body,
    color: theme.colors.textDark,
  },
  action: {
    flex: "0 0 auto",
    placeSelf: "stretch",
  },
  messageContainer: {
    maxWidth: 700,
  },
  iconContainer: {},
  messageActions: {
    flex: "0 0 auto",
  },
  actionContainer: {},
  closeAction: {},
});
