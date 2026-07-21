import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationPopup",
  {
    popup: { "--hv-popup-nav-bg": theme.colors.bgContainer },
    wrapper: {
      // position:relative is the containing block for the absolutely-positioned arrow
      position: "relative",
      // reserve space on the left for the arrow so it stays inside the Popper's
      // clip box, keeping it visible even when a consumer sets `overflow` on the
      // Popper root (e.g. to make a long menu scrollable)
      paddingLeft: 8,
    },
    arrow: {
      position: "absolute",
      // sits in the reserved padding strip, flush against the Popper's left edge
      left: 0,
      width: 0,
      height: 0,
      borderTop: `${theme.space.xs} solid transparent`,
      borderBottom: `${theme.space.xs} solid transparent`,
      // top is set dynamically (inline) by Popper.js arrow modifier
      borderRight: `${theme.space.xs} solid var(--hv-popup-nav-bg)`,
    },
    container: {},
    popper: {
      zIndex: theme.zIndices.popover,
    },
  },
);
