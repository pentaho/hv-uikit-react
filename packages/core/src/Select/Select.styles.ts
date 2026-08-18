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
  popper: {
    zIndex: theme.zIndices.popover,
    width: "var(--anchor-width)",
    minWidth: "var(--anchor-width)",
    maxWidth: "var(--available-width)",
  },
  popperVariableWidth: {
    width: "auto",
  },
  panel: {
    maxHeight: 400,
    margin: theme.spacing("xxs", 0),
    backgroundColor: theme.colors.bgContainer,
    border: `1px solid ${theme.colors.borderSubtle}`,
    borderRadius: theme.radii.large,
    boxShadow: theme.colors.shadow,
    overflow: "hidden",

    // panel styles overrides
    padding: theme.space.xs,
  },
  listContainer: {
    padding: 4,
    margin: -4,
    overflow: "auto",
    maxHeight: "inherit",
  },
  error: {},
});
