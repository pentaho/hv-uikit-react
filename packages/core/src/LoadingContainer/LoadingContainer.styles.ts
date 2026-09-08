import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

const { staticClasses, useClasses } = createClasses("HvLoadingContainer", {
  root: {
    position: "relative",
    height: "inherit",
  },
  loading: {
    position: "absolute",
    userSelect: "none",
    inset: 0,
    zIndex: theme.zIndices.overlay,
    transition: "background-color .2s ease",
    backgroundColor: theme.alpha("bgContainer", "var(--opacity, 80%)"),
  },
});

export { staticClasses, useClasses };
