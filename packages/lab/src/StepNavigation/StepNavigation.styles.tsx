import { createClasses } from "@pentaho/uikit-react-core";

export const { staticClasses, useClasses } = createClasses("HvStepNavigation", {
  root: {
    display: "flex",
    flexDirection: "column",
  },
  titles: {
    marginTop: 8,
    display: "flex",
  },
  ol: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    padding: 0,
    listStyle: "none",
  },
  li: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    userSelect: "none",
    "& > div": {
      display: "flex",
    },
  },
});
