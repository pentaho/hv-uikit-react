import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationSlider",
  {
    root: {
      display: "flex",
      alignItems: "center",
      borderLeft: `4px solid transparent`,
      minHeight: "48px",
      color: "inherit",
      marginBottom: "8px",
      "& > button": {
        marginLeft: "auto",
      },
    },
    listItemSelected: {
      backgroundColor: theme.colors.bgPageSecondary,
      borderLeft: `4px solid ${theme.colors.text}`,
    },
    listItemFocus: {
      backgroundColor: theme.colors.bgPageSecondary,
    },
    forwardButton: {
      color: "inherit",
    },
    listContainer: {},
    listItemDisabled: {},
  },
);
