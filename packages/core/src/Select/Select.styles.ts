import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvSelect", {
  root: {
    position: "relative",
    "&$disabled,&$readOnly": {
      pointerEvents: "none",
    },
  },
  disabled: {},
  readOnly: {},
  invalid: {},
  labelContainer: {},
  label: {},
  description: {},
  select: {
    "&&$invalid": { borderColor: theme.form.errorColor },
  },
  popper: {},
  panel: {
    maxHeight: 400,

    // panel styles overrides
    padding: theme.space.xs,
    "& > *": {
      padding: 4,
      margin: -4,
    },
  },
  error: {},
});
