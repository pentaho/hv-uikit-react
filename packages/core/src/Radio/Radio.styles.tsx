import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvRadio", {
  root: { display: "inline-block" },
  container: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    borderRadius: theme.radii.base,

    "&:hover:not($disabled)": {
      backgroundColor: theme.colors.bgHover,
    },
    ":where(:has($label)) $radio": {
      borderRadius: "inherit",
    },
  },
  invalidContainer: {},
  disabled: {
    cursor: "not-allowed",
    "& $label": { color: theme.colors.textDisabled, cursor: "not-allowed" },
  },
  focusVisible: {
    backgroundColor: theme.colors.bgPageSecondary,
    ...outlineStyles,
  },
  radio: {},
  invalidRadio: {},
  label: {
    verticalAlign: "middle",
    ...theme.typography.body,
    cursor: "pointer",
    lineHeight: "32px",
    flex: 1,
  },
  checked: {},
  semantic: {},
  left: {
    "& $label": {
      paddingLeft: theme.space.xs,
      textAlign: "right",
    },
    "& $container": {
      flexDirection: "row-reverse",
    },
  },
  right: {
    "& $label": {
      paddingRight: theme.space.xs,
    },
  },
});
