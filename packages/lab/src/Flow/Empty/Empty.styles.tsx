import { createClasses, theme } from "@hitachivantara/uikit-react-core";

export const { staticClasses, useClasses } = createClasses("HvFlowEmpty", {
  root: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.bgPage,
    position: "absolute",
    zIndex: theme.zIndices.popover,
  },
});
