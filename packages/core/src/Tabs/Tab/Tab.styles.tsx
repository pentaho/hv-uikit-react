import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvTab", {
  root: {
    marginTop: "3px",
    padding: theme.spacing(0, "sm"),
    minWidth: 70,
    minHeight: 32,
    textTransform: "none",
    ...theme.typography.body,
    borderRadius: `${theme.radii.base} ${theme.radii.base} 0 0`,
    "&:hover": {
      backgroundColor: theme.colors.bgHover,
      "&::after": {
        height: "1px",
        backgroundColor: theme.colors.border,
      },
    },
    "&$selected": {
      fontWeight: theme.typography.label.fontWeight,
    },
    "&$disabled": {
      color: theme.colors.textDisabled,
      cursor: "not-allowed",
      pointerEvents: "all",
      opacity: 1,
      "&:hover": {
        background: "none",
      },
    },
    opacity: 1,
    "&::after": {
      position: "absolute",
      left: 0,
      top: "calc(100% - 1px)",
      height: "1px",
      width: "100%",
      backgroundColor: theme.colors.border,
      content: "''",
    },
    // Override Mui styling: https://mui.com/material-ui/api/tab/#css
    "& .MuiTab-iconWrapper": {
      margin: 0,
    },
  },
  focusVisible: {
    ...outlineStyles,
  },
  selected: {},
  disabled: {},
});
