import { createClasses } from "@pentaho/uikit-react-utils";
import { blue, neutral, slate, theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationSlider",
  {
    root: {
      display: "flex",
      alignItems: "center",
      borderLeft: "unset",
      borderRadius: theme.radii.round,
      minHeight: "32px",
      color: "inherit",
      marginBottom: "8px",
      "& > button": {
        marginLeft: "auto",
      },
      "&.HvIsFocused": {
        backgroundColor: slate[700],
      },
      "&.HvListItem-interactive:not(.HvListItem-disabled):not(.HvListItem-selected):hover":
        {
          backgroundColor: slate[700],
        },
    },
    listItemSelected: {
      background: blue[800],
      borderLeft: "unset",
    },
    listItemFocus: {
      background: slate[700],
    },
    forwardButton: {
      color: "inherit",
    },
    listContainer: {
      padding: theme.space.sm,
    },
    listItemDisabled: {
      color: neutral[500],
      backgroundColor: neutral[800],
      "& .HvListItem-startAdornment": { backgroundColor: "transparent" },
      "& .HvListItem-endAdornment": { backgroundColor: "transparent" },
    },
  },
);
