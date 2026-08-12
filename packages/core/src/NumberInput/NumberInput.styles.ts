import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { inputStyles } from "../Input/Input.styles";

export const { staticClasses, useClasses } = createClasses("HvNumberInput", {
  ...inputStyles,
  root: {
    ...inputStyles.root,
    ".HvBaseInput-disabled .HvInput-adornmentsBox": {
      backgroundColor: theme.colors.bgDisabled,
    },
  },
  adornmentsBox: {
    ...inputStyles.adornmentsBox,
    backgroundColor: theme.colors.bgContainer,
    borderLeft: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radii.none,
  },
});
