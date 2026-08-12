import { createClasses } from "@pentaho/uikit-react-utils";

export const { staticClasses, useClasses } = createClasses("HvAccordion", {
  root: {},
  hidden: { height: 0, display: "none" },
  container: { paddingTop: 8, height: "auto" },
  label: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "32px",
  },
  disabled: {},
});
