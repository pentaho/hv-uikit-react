import { createClasses, theme } from "@pentaho/uikit-react-core";

import { flowBaseNodeClasses } from "./Node";

export const { staticClasses, useClasses } = createClasses("HvFlow", {
  root: {
    height: "100%",
    [`& .selected > .${flowBaseNodeClasses.root}`]: {
      border: `1px solid ${theme.colors.textDisabled}`,
      borderRadius: theme.radii.round,
      boxSizing: "border-box",
    },
  },
});
