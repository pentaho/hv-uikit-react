import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvColorPicker", {
  root: {},
  labelContainer: {},
  label: {},
  description: {},
  headerColorValue: {
    textTransform: "uppercase",
    minWidth: "8ch",
    fontVariant: "tabular-nums",
  },
  headerColorIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    flexShrink: 0,
  },
  panel: {
    width: "100%",
    minWidth: "266px",
    display: "flex",
    flexDirection: "column",
    gap: theme.space.md,
    justifyContent: "center",
    padding: "16px",
    backgroundColor: "transparent",
  },
  colorPicker: {},
  colorPickerIcon: {},
  dropdownRootIconOnly: {
    "&,& .HvBaseDropdown-arrowContainer": {
      width: 32,
      height: 32,
    },
    "& .HvBaseDropdown-selection": {
      padding: 0,
    },
  },
  headerColorIconOnly: {
    margin: 8,
  },
});
