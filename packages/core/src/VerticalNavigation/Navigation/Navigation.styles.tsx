import { createClasses } from "@pentaho/uikit-react-utils";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationTree",
  {
    root: {
      display: "block",
      overflowY: "auto",
    },
    list: {},
    listItem: {},
    collapsed: {
      display: "none",
    },
    popup: {
      boxShadow: "inset 5px 0 5px -3px rgb(65 65 65 / 12%)",
    },
    navigationPopup: {
      boxShadow: "inset 5px 0 5px -3px rgb(65 65 65 / 12%)",
    },
  },
);
