import { createClasses, theme } from "@hitachivantara/uikit-react-core";

const boxShadow = `4px 0px 8px -4px ${theme.alpha("textDark", "12%")}`;

export const { staticClasses, useClasses } = createClasses(
  "HvCanvasSidePanel",
  {
    root: {
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      boxShadow,
      backgroundColor: "transparent",
      transition: "visibility 0.3s ease, width 0.3s ease",
      overflow: "hidden",
    },
    open: {
      width: 320,
      visibility: "visible",
    },
    close: {
      width: 0,
      visibility: "hidden",
      "&+$separator": {
        display: "none",
      },
    },
    tabs: {},
    content: {
      height: "100%",
    },
    handle: {
      height: 44,
      display: "flex",
      justifyContent: "center",
      boxShadow,
      borderRadius: `0px ${theme.radii.large} ${theme.radii.large} 0px`,
      position: "absolute",
      transition: "left 0.3s ease",
      "&&": {
        // override action state styles
        backgroundColor: theme.colors.bgContainer,
      },
      top: "calc(50% - 44px)", // subtract handle's full height
      left: 0,
      "&[data-open]": {
        left: 320,
      },
    },
    separator: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: 8,
      cursor: "col-resize",
      borderLeftWidth: 2,
      borderColor: "transparent",
      ":hover": {
        borderColor: theme.colors.bgHover,
      },
      "&[data-resizing]": {
        borderColor: theme.colors.primarySubtle,
      },
    },
  },
);
