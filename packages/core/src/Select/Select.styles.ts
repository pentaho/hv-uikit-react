import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

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
    marginTop: -1,
    marginBottom: -1,

    // panel styles overrides
    padding: theme.space.xs,
  },
  error: {},
});
