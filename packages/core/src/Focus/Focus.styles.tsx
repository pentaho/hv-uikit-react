import { createClasses } from "@pentaho/uikit-react-utils";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvFocus", {
  root: {},
  selected: {},
  disabled: {},
  focusDisabled: {
    outline: "none",
    "& *:focus": {
      outline: "none",
    },
    "& *": {
      outline: "none !important",
    },
  },
  focused: {
    ...outlineStyles,
    "@media (-webkit-min-device-pixel-ratio:0)": {
      ...outlineStyles,
    },
  },
  focusedVisible: {
    "&:focus-visible": {
      ...outlineStyles,
      "@media (-webkit-min-device-pixel-ratio:0)": {
        ...outlineStyles,
      },
    },
    "&:focus-within:has(:focus-visible)": {
      ...outlineStyles,
      "@media (-webkit-min-device-pixel-ratio:0)": {
        ...outlineStyles,
      },
    },
  },
  focus: {},
});
