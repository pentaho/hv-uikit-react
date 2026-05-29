import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigation",
  {
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",

      width: "220px",
      overflow: "hidden",
      transition: "width 300ms ease",

      backgroundColor: theme.colors.bgContainer,
      boxShadow: theme.colors.shadow,
      clipPath: "inset(0px -12px 0px 0px)",

      "& > :only-child": {
        padding: theme.space.sm,
      },
      "& > :first-child": {
        padding: theme.space.sm,
      },
      "& > * + *": {
        borderTop: `3px solid ${theme.colors.borderSubtle}`,
        padding: theme.space.sm,
      },
    },
    collapsed: {
      // calc: (padding-left + padding-right) + icon width
      width: `calc(${theme.space.sm} * 2 + 32px)`,
      "& > :first-child": {
        padding: theme.spacing("sm", "sm"),
      },
      "& > * + *": {
        padding: theme.spacing("sm", "sm"),
      },
    },

    slider: {
      "& > div:first-of-type": {
        borderBottom: `3px solid ${theme.colors.borderSubtle}`,
      },
    },

    childData: {},
  },
);
