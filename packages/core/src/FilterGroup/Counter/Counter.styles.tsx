import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

const name = "HvFilterGroupCounter";

export const { staticClasses, useClasses } = createClasses(name, {
  root: {
    lineHeight: "34px",
    marginRight: 10,
  },
  partialCounter: {
    display: "inline-block",
    fontWeight: theme.fontWeights.normal,
  },
});
