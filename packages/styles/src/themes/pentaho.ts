import { makeColors, makeTheme } from "../makeTheme";
import { blue, slate } from "../palette";

const pentaho = makeTheme((theme) => ({
  name: "pentaho",
  colors: makeColors({
    bgHover: theme.alpha(blue[600], 0.08),
    bgOverlay: [theme.alpha(slate[950], 0.6), theme.alpha(slate[900], 0.4)],

    shad1: theme.alpha(slate[900], 0.08),
    shadow: [
      `0 4px 4px 0 ${theme.alpha(slate[900], 0.02)}`,
      `0 3px 3px 0 ${theme.alpha(slate[900], 0.04)}`,
      `0 1px 1px 0 ${theme.alpha(slate[900], 0.06)}`,
      `0 1px 1px 0 ${theme.alpha(slate[900], 0.08)}`,
      `0 0 0 0 ${theme.alpha(slate[900], 0.1)}`,
    ].join(", "),
  }),
  fontFamily: {
    body: "Inter, Arial, Helvetica, sans-serif",
  },
  typography: {
    display: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.semibold,
      fontSize: theme.fontSizes.xl4,
      lineHeight: theme.lineHeights.xl4,
      letterSpacing: "0.00504em",
    },
    title1: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.semibold,
      fontSize: theme.fontSizes.xl3,
      lineHeight: theme.lineHeights.xl3,
      letterSpacing: "0.00384em",
    },
    title2: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.semibold,
      fontSize: theme.fontSizes.xl2,
      lineHeight: theme.lineHeights.xl2,
      letterSpacing: "0.00288em",
    },
    title3: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.semibold,
      fontSize: theme.fontSizes.xl,
      lineHeight: theme.lineHeights.xl,
      letterSpacing: "0.0024em",
    },
    title4: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.semibold,
      fontSize: theme.fontSizes.lg,
      lineHeight: theme.lineHeights.lg,
      letterSpacing: "0.00192em",
    },
    label: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.semibold,
      fontSize: theme.fontSizes.base,
      lineHeight: theme.lineHeights.base,
      letterSpacing: "0.00168em",
    },
    body: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.normal,
      fontSize: theme.fontSizes.base,
      lineHeight: theme.lineHeights.base,
      letterSpacing: "0.00168em",
    },
    captionLabel: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.semibold,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.lineHeights.sm,
      letterSpacing: 0,
    },
    caption1: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.normal,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.lineHeights.sm,
      letterSpacing: "0.00144em",
    },
    caption2: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.normal,
      fontSize: theme.fontSizes.xs,
      lineHeight: theme.lineHeights.xs,
      letterSpacing: "0.0012em",
    },
  },
  radii: {
    base: "4px",
    round: "8px",
    large: "16px",
  },
  header: {
    height: "48px",
    secondLevelHeight: "42px",
  },
  form: {
    errorColor: theme.colors.negative,
  },
  snackbar: {
    actionButtonVariant: "secondaryGhost",
  },
}));

export default pentaho;
