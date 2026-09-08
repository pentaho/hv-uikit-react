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
      overflow: "hidden",
      transition: "width 300ms ease",
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
      },

      colorScheme: "light",
      padding: theme.space.sm,
      paddingTop: 32,
      color: theme.colors.textLight,
      backgroundColor: `var(--hv-popup-nav-bg, ${slate[900]})`,
      boxShadow: `inset -1px 0 0 0 ${slate[500]}`,
      clipPath: "inset(0px -12px 0px 0px)",

      "& > * + *": {
        padding: 0,
        paddingTop: theme.space.sm,
        borderTop: `1px solid ${theme.alpha("border", 0.3)}`,
      },
      "& > * + div": {
        borderTop: `1px solid ${slate[500]}`,
      },
      "& > :only-child": {
        padding: theme.space.sm,
        "& .HvVerticalNavigationSlider-listContainer": { padding: 0 },
      },
      "& > :first-child": {
        padding: 0,
        paddingBottom: theme.space.sm,
      },

      ".HvVerticalNavigationPopup-wrapper:has(&)": {
        "--hv-popup-nav-bg": slate[800],
      },
      ".HvVerticalNavigationPopup-container:has(> &)": {
        borderRadius: theme.radii.round,
        overflow: "hidden",
      },
      ".HvVerticalNavigationPopup-container &": {
        padding: theme.space.sm,
        paddingBottom: 0,
      },
    },
    collapsed: {
      // calc: (padding-left + padding-right) + icon width
      width: `calc(${theme.space.sm} * 2 + 32px)`,
      "& > :first-child": {
        padding: 0,
        paddingBottom: theme.space.sm,
      },
      "& > * + *": {
        padding: 0,
        paddingTop: theme.space.sm,
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
