import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvScrollToHorizontal",
  {
    root: {
      display: "flex",
      padding: "0 30px",
      listStyleType: "none",
      flexWrap: "wrap",
      backdropFilter: `blur(4px)`,
      backgroundColor: theme.alpha("bgPage", 0.9),
    },
    positionSticky: {
      position: "sticky",
      zIndex: `calc(${theme.zIndices.banner} - 2)`,
      top: 0,
      left: 0,
    },
    positionFixed: {
      position: "fixed",
      zIndex: `calc(${theme.zIndices.banner} - 2)`,
      top: 0,
      left: 0,
    },
    item: {},
    itemSelected: {},
  },
);
