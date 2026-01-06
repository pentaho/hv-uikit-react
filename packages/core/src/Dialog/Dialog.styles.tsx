import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvDialog", {
  root: {},
  background: {
    backgroundColor: theme.colors.bgOverlay,
  },
  paper: {
    color: theme.colors.text,
    backgroundColor: theme.colors.bgContainer,
    boxShadow: theme.colors.shadow,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.round,
  },
  fullScreen: {
    borderRadius: 0,
  },

  fullHeight: {
    height: "100%",
  },
  closeButton: {
    padding: 0,
    minWidth: "auto",
    position: "absolute",
    top: theme.space.sm,
    right: theme.space.sm,
    width: 32,
    height: 32,
  },
  statusBar: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 4,
  },
  success: {
    borderColor: theme.colors.positive,
  },
  error: {
    borderColor: theme.colors.negative,
  },
  warning: {
    borderColor: theme.colors.warning,
  },
});
