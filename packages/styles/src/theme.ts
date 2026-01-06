import { palette } from "./palette";
import { baseTheme as tokens } from "./tokens";
import { colors, type HvColor, type HvColorAny } from "./tokens/colors";
import {
  DeepString,
  HvThemeComponents,
  HvThemeTypography,
  HvThemeTypographyProps,
  HvThemeVars,
  SpacingValue,
} from "./types";
import { hasMultipleArgs, mapCSSVars, spacingUtil } from "./utils";

const componentsSpec: DeepString<HvThemeComponents> = {
  header: {
    height: "string",
    secondLevelHeight: "string",
  },
  form: {
    errorColor: "string",
  },
  snackbar: {
    actionButtonVariant: "string",
  },

  bulkActions: {
    actionButtonVariant: "string",
  },
  stepNavigation: {
    separatorMargin: "string",
    defaultSeparatorHeight: "string",
    simpleSeparatorHeight: "string",
  },
  filterGroup: {
    applyButtonVariant: "string",
    cancelButtonVariant: "string",
  },
  colorPicker: {
    hueDirection: "string",
  },
};

const typographyProps: DeepString<HvThemeTypographyProps> = {
  color: "string",
  fontSize: "string",
  letterSpacing: "string",
  lineHeight: "string",
  fontWeight: "string",
  textDecoration: "string",
};

const typographySpec: DeepString<HvThemeTypography> = {
  typography: {
    display: { ...typographyProps },
    title1: { ...typographyProps },
    title2: { ...typographyProps },
    title3: { ...typographyProps },
    title4: { ...typographyProps },
    label: { ...typographyProps },
    body: { ...typographyProps },
    captionLabel: { ...typographyProps },
    caption1: { ...typographyProps },
    caption2: { ...typographyProps },
  },
};

const colorTokens = {
  ...colors.common,
  ...colors.light,
};

const themeVars: HvThemeVars = mapCSSVars({
  ...tokens,
  colors: {
    type: "light",
    ...colorTokens,
  }, // Flatten colors and add background color
  ...componentsSpec,
  ...typographySpec,
});

function getColorOrFallback(color?: HvColorAny) {
  return themeVars.colors[color as HvColor] || color;
}

/** Get a `color` from the theme palette, or `fallbackColor` if not found */
export function getColor(color?: HvColorAny, fallbackColor?: HvColorAny) {
  return getColorOrFallback(color) || getColorOrFallback(fallbackColor);
}

/**
 * Utility function to generate spacing values from the theme.
 *
 * @example
 * theme.spacing(2) // 16px (2*8px)
 * theme.spacing("md", "inherit", "42px") // 24px inherit 42px
 */
const spacing = (...args: [SpacingValue[]] | SpacingValue[]): string => {
  if (hasMultipleArgs(args)) {
    return args.map((arg) => spacing(arg)).join(" ");
  }

  const [value] = args;

  switch (typeof value) {
    case "number":
    case "string":
      return spacingUtil(value, themeVars);
    default:
      return "0px";
  }
};

/**
 * Utility function to mix two colors. Accepts theme and CSS colors.
 *
 * @example
 * theme.mix("warning", 0.7) // 70% warning, 30% transparent
 * theme.mix("cat1", "60%", "orange") // 60% cat1, 30% orange
 */
const mix = (
  color1: HvColorAny,
  factor: string | number,
  color2: HvColorAny = "transparent",
) => {
  const percent = typeof factor === "number" ? `${factor * 100}%` : factor;
  return `color-mix(in srgb, ${getColor(color1)} ${percent}, ${getColor(color2)})`;
};

/**
 * Utility function to apply an alpha channel to a color from the theme.
 *
 * @example
 * theme.alpha("warning", 0.5) // rgb( R G B / 0.5)
 */
const alpha = (color: HvColorAny, factor: number | string) =>
  mix(color, factor);

/**
 * UI Kit static theme object, containing values and utility functions that leverage the injected CSS variables.
 * @returns string values that can be used as CSS values.
 * @example
 * theme.colors.primary // "var(--uikit-colors-primary)"
 * theme.spacing("xs", "sm") // "var(--uikit-space-xs) var(--uikit-space-sm)"
 */
export const theme = {
  ...themeVars,
  palette,
  spacing,
  alpha,
  mix,
};

export type HvTheme = typeof theme;
