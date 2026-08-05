import { createClasses, theme } from "@pentaho/uikit-react-core";

export const { staticClasses, useClasses } = createClasses("HvFlowMinimap", {
  root: {
    "&.react-flow__minimap": { backgroundColor: theme.colors.bgPage },
  },
});
