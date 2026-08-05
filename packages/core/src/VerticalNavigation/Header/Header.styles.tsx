import { createClasses } from "@pentaho/uikit-react-utils";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationHeader",
  {
    root: {
      width: "100%",
      display: "flex",
      marginTop: "12px",
      alignItems: "center",
    },
    minimized: {
      justifyContent: "center",
      paddingRight: 0,
    },
    collapseButton: {
      marginLeft: "auto",
      color: "inherit",
      "&$minimized": {
        marginLeft: 0,
      },
    },
    backButton: {
      color: "inherit",
    },
    title: {
      color: "inherit",
    },
  },
);
