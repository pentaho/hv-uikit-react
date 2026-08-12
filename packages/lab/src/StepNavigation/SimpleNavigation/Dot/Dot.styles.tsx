import { createClasses, theme } from "@pentaho/uikit-react-core";

export const { staticClasses, useClasses } = createClasses("HvDot", {
  root: {
    borderRadius: theme.radii.full,
    zIndex: 1,
    width: "var(--dotSize)",
    height: "var(--dotSize)",
    "&,:hover,:disabled": {
      backgroundColor: "var(--dotColor)",
    },
  },
  active: {},
  ghostDisabled: {},
});
