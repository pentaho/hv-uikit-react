import type { ThemeExtender } from "@unocss/core";
import type { Theme } from "@unocss/preset-wind3";
import { ds5 as hvTheme, theme } from "@hitachivantara/uikit-styles";

// #region theme conversion utils
const { dawn: defaultColors } = hvTheme.colors.modes;
const { base, ...hvSpacing } = hvTheme.space;

/** HV breakpoints with added `px` suffix */
const hvBreakpoints = Object.entries(hvTheme.breakpoints.values).map(
  ([key, value]) => [key, `${value}px`] as const,
);

const hvZIndex = Object.entries(hvTheme.zIndices).map(
  ([key, value]) => [key, `${value}`] as const,
);
// #endregion

/** Extends the current theme with the Design System utilities */
export const extendTheme: ThemeExtender<Theme> = (baseTheme) => ({
  ...baseTheme,

  borderRadius: {
    DEFAULT: theme.radii.base,
    ...theme.radii,
  },
  breakpoints: Object.fromEntries(hvBreakpoints),
  containers: Object.fromEntries(
    hvBreakpoints.map(([k, v]) => [k, `(min-width: ${v})`]),
  ),
  spacing: {
    ...baseTheme.spacing,
    DEFAULT: hvSpacing.xs,
    ...hvSpacing,
  },
  zIndex: Object.fromEntries(hvZIndex),

  // colors
  colors: {
    ...baseTheme.colors,
    ...defaultColors,
    ...theme.colors,
  },
  accentColor: { DEFAULT: defaultColors.primary },
  textColor: { DEFAULT: defaultColors.text },
  backgroundColor: { DEFAULT: defaultColors.bgPage },

  // typography
  fontFamily: {
    body: hvTheme.fontFamily.body,
    sans: hvTheme.fontFamily.body,
    serif: hvTheme.fontFamily.body,
    mono: "monospace",
  },
  lineHeight: { DEFAULT: hvTheme.lineHeights.base, ...hvTheme.lineHeights },
  fontSize: { DEFAULT: hvTheme.fontSizes.base, ...hvTheme.fontSizes },
  fontWeight: { DEFAULT: hvTheme.fontWeights.normal, ...hvTheme.fontWeights },
});
