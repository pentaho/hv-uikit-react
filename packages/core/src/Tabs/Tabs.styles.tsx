import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvTabs", {
  root: {
    minHeight: 0,
  },
  indicator: {
    "&$floating": {
      height: "100%",
      backgroundColor: theme.colors.bgContainer,
      border: `1px solid ${theme.colors.primary}`,
      borderRadius: theme.radii.full,
    },
  },
  scroller: {},
  flexContainer: {
    marginLeft: "3px",
    "&$floating": {
      display: "inline-flex",
      backgroundColor: theme.colors.bgPageSecondary,
      borderRadius: theme.radii.full,
      marginLeft: 0,
    },
  },
  floating: {
    "& .HvTab-root": {
      marginTop: 0,
      zIndex: 1,
      "&:is(.HvTab-selected)": {
        borderColor: "transparent",
        backgroundColor: "transparent",
      },
      "&:hover": {
        borderRadius: theme.radii.full,
      },
      "::after": {
        display: "none",
      },
    },
  },
});
