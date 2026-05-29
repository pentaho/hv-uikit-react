import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationTree",
  {
    root: {
      display: "block",
      overflowY: "auto",
      minHeight: 0,
    },
    list: {},
    listItem: {},
    collapsed: {
      display: "none",
    },
    popup: {
      boxShadow: "inset 5px 0 5px -3px rgb(65 65 65 / 12%)",
    },
    navigationPopup: {
      boxShadow: "inset 5px 0 5px -3px rgb(65 65 65 / 12%)",
    },
    searchContainer: {
      paddingBottom: theme.space.sm,
    },
    searchIcon: {
      display: "flex",
      padding: 0,
      color: "currentColor",
      justifyContent: "center",
      marginBottom: theme.space.sm,
      ":hover": {
        borderRadius: theme.radii.round,
        cursor: "pointer",
      },
    },
    noResults: {
      padding: theme.spacing("xs", "sm"),
      color: theme.colors.textSubtle,
    },
  },
);
