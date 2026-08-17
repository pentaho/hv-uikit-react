import { createClasses } from "@pentaho/uikit-react-utils";
import { slate, theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvSelect", {
  root: {
    position: "relative",
    borderRadius: theme.radii.round,
    "& .HvButton-subtle[data-color=text]": {
      borderColor: theme.colors.textDimmed,
      backgroundColor: `light-dark(white, ${slate[950]})`,
    },
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
    borderRadius: theme.radii.round,
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
