import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { useClasses, staticClasses } = createClasses("HvBanner", {
  /** Styles applied to the component root class when the component is closed. */
  rootClosed: {
    display: "none",
  },
  /** Styles applied to the component root class. */
  root: {
    minWidth: `calc(100% - ${theme.space.sm})`,
  },
  /** Styles applied to the component when define as top. */
  anchorOriginTopCenter: {
    top: theme.space.xs,
  },
  /** Styles applied to the component when define as bottom. */
  anchorOriginBottomCenter: {
    bottom: theme.space.xs,
  },
});
