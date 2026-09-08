import { createClasses } from "@pentaho/uikit-react-utils";
import { slate, theme } from "@pentaho/uikit-styles";

const modalShadow = `0 32px 32px 0 ${theme.alpha(slate[900], 0.1)}, 0 20px 20px 0 ${theme.alpha(slate[900], 0.08)}, 0 12px 12px 0 ${theme.alpha(slate[900], 0.06)}, 0 5px 5px 0 ${theme.alpha(slate[900], 0.04)}, 0 1px 1px 0 ${theme.alpha(slate[900], 0.02)}`;

export const { staticClasses, useClasses } = createClasses("HvDialog", {
  root: {},
  background: {
    backgroundColor: theme.colors.bgOverlay,
  },
  paper: {
    color: theme.colors.text,
    background: theme.colors.bgContainer,
    boxShadow: modalShadow,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.large,
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
    border: "none",
    borderTopLeftRadius: theme.radii.large,
    borderTopRightRadius: theme.radii.large,
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
