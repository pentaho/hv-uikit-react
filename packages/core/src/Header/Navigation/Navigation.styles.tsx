import { createClasses } from "@hitachivantara/uikit-react-utils";

export const { staticClasses, useClasses } = createClasses(
  "HvHeaderNavigation",
  {
    root: {
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: 1,
      top: "0px",
      left: "0px",
    },
  },
);
