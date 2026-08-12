import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvButtonBase", {
  root: {
    display: "inline-flex",
    cursor: "pointer",
    background: "none",
    padding: 0,

    // Background color common for almost all variants
    ":where(:not($disabled))": {
      ":hover, :focus-visible": {
        backgroundColor: theme.colors.bgHover,
      },
    },
    ":focus-visible": {
      ...outlineStyles,
    },

    // Default button - no size specified
    fontFamily: theme.fontFamily.body,
    fontSize: "inherit",
    color: "inherit",
  },
  disabled: {
    cursor: "not-allowed",
    color: theme.colors.textDisabled,
  },
});
