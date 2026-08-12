import { createClasses } from "@pentaho/uikit-react-utils";
import { slate, theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigation",
  {
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",

      width: "280px",

      color: theme.colors.textLight,
      backgroundColor: slate[900],
      boxShadow: `inset -1px 0 0 0 ${slate[500]}`,
      clipPath: "inset(0px -12px 0px 0px)",

      "& > :only-child": {
        padding: theme.space.sm,
        "& .HvVerticalNavigationSlider-listContainer": { padding: 0 },
      },
      "& > :not(nav:first-of-type)": {
        borderTop: `1px solid ${slate[500]}`,
        padding: theme.spacing("xs", "sm", "sm", "sm"),
      },

      "& > :first-of-type:not(:last-child)": {
        borderTop: "none",
        padding: theme.spacing("sm", "sm", "xs", "sm"),
      },
    },
    collapsed: {
      width: "fit-content",
      "& > :first-of-type:not(:last-child)": {
        padding: theme.spacing("sm", "xs", "xs", "xs"),
      },

      "& > :not(nav:first-of-type)": {
        padding: theme.spacing("xs", "xs", "sm", "xs"),
      },
    },

    slider: {
      "& > div:first-of-type": {
        borderBottom: `1px solid ${slate[500]}`,
      },
    },

    childData: {},
  },
);
