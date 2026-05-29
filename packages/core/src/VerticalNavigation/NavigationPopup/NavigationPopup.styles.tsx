import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationPopup",
  {
    popup: {},
    wrapper: {
      // position:relative is the containing block for the absolutely-positioned arrow
      position: "relative",
    },
    arrow: {
      position: "absolute",
      // sticks 8px to the left of the wrapper, filling the gap created by the offset modifier
      left: -8,
      width: 0,
      height: 0,
      borderTop: "8px solid transparent",
      borderBottom: "8px solid transparent",
      // top is set dynamically (inline) by Popper.js arrow modifier
      borderRight: "8px solid var(--hv-popup-nav-bg)",
    },
    container: {},
    popper: {
      zIndex: theme.zIndices.popover,
    },
  },
);
