import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { useClasses, staticClasses } = createClasses("HvTimePicker", {
  root: {
    position: "relative",
  },

  labelContainer: {},
  label: {},
  description: {},

  placeholder: {
    display: "flex",
    gap: 1,
  },
  placeholderDisabled: {
    color: theme.colors.textDisabled,
  },

  dropdownHeader: {},
  dropdownHeaderOpen: {},
  dropdownHeaderInvalid: {
    "&,:hover": {
      borderColor: theme.form.errorColor,
    },
  },
  dropdownPanel: {},

  icon: {},

  timePopperContainer: {
    zIndex: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing("xs", 0),
    userSelect: "none",
    minWidth: "175px",
  },

  error: {},
});
