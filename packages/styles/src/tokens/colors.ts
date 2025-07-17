import type { Property } from "csstype";

import { indigo } from "../palette";
import { ds5Colors as dsColors, getColors, oldVizColors } from "./colorsCompat";

type SemanticTypes =
  | "primary"
  | "accent"
  | "positive"
  | "warning"
  | "negative"
  | "info";

type SemanticKeys<Prefix extends string> =
  | `${Prefix}`
  | `${Prefix}Strong`
  | `${Prefix}Dimmed`
  | `${Prefix}Subtle`
  | `${Prefix}Deep`;
// 🔎: border tokens don't exist for "primary"

type VizKeys = `cat${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;

/** @deprecated use `HvColorTokens` instead */
export type ColorTokens = HvColorTokens;

export interface HvColorTokens
  extends Record<SemanticKeys<SemanticTypes>, string>,
    Record<VizKeys, string> {
  // #region semantic
  // 🔎: border tokens don't exist for "primary"
  accentBorder: string;
  positiveBorder: string;
  warningBorder: string;
  negativeBorder: string;
  infoBorder: string;
  // #endregion

  // #region text
  /** primary text color */
  text: string;
  /** secondary text color */
  textSubtle: string;
  /** disabled text color */
  textDisabled: string;
  /** dimmed text, close to the bgColor, used for contrasting with semantic backgrounds */
  textDimmed: string;
  /** light-only text */
  textLight: string;
  /** dark-only text */
  textDark: string;
  // #endregion

  // #region borders
  border: string;
  borderSubtle: string;
  borderStrong: string;
  borderDisabled: string;
  // #endregion

  // #region backgrounds
  /** default page background */
  bgPage: string;
  /** secondary page background (also for :active action). */ // 🔎 weird use-cases?
  bgPageSecondary: string;
  /** default surface background for containers */
  bgContainer: string;
  /** secondary surface background for containers */
  bgContainerSecondary: string;
  /** background for :hover actions */
  bgHover: string;
  /** background for disabled elements */
  bgDisabled: string;
  /** overlay background (for Dialog, dropdowns, etc.) */
  bgOverlay: string;
  /** color to use for opacity */
  dimmer: string;
  // #endregion

  // #region others
  /** shadow color */
  shad1: string;
  /** box shadow */
  shadow: string;
  // #endregion
}

const base = {
  /** @deprecated use `textLight` instead */
  base_light: "#FBFCFC",
  /** @deprecated use `textDark` instead */
  base_dark: "#414141",
};

const categorical = {
  cat1: "#95AFE8",
  cat2: "#E89E5D",
  cat3: "#73BAA5",
  cat4: "#6F749F",
  cat5: "#D17A7C",
  cat6: "#FFDA8A",
  cat7: "#7DC1DB",
  cat8: "#B67EA3",
  cat9: "#F2BC66",
  cat10: "#2D86B3",
  cat11: "#FC9AAA",
  cat12: "#8EBA8C",
};

const common = {
  ...base,
  ...categorical,
  ...oldVizColors,
} satisfies Partial<HvColorTokens>;

// #region Light palette
const light = {
  ...getColors(dsColors, "light"),

  primary: dsColors.primary[0],
  primaryDeep: dsColors.primary_80[0],
  primaryStrong: dsColors.primary_80[0],
  primarySubtle: dsColors.primary_20[0],
  primaryDimmed: dsColors.primary_20[0],
  positive: dsColors.positive[0],
  positiveDeep: dsColors.positive_120[0],
  positiveStrong: dsColors.positive_80[0],
  positiveDimmed: dsColors.positive_20,
  positiveSubtle: dsColors.positive_20,
  positiveBorder: dsColors.positive_20,
  warning: dsColors.warning[0],
  warningDeep: dsColors.warning_140[0],
  warningStrong: dsColors.warning_120[0],
  warningDimmed: dsColors.warning_20,
  warningSubtle: dsColors.warning_20,
  warningBorder: dsColors.warning_20,
  negative: dsColors.negative[0],
  negativeDeep: dsColors.negative_120[0],
  negativeStrong: dsColors.negative_80[0],
  negativeDimmed: dsColors.negative_20,
  negativeSubtle: dsColors.negative_20,
  negativeBorder: dsColors.negative_20,
  info: dsColors.neutral[0],
  infoDeep: dsColors.neutral[0],
  infoStrong: dsColors.neutral[0],
  infoDimmed: dsColors.neutral_20,
  infoSubtle: dsColors.neutral_20,
  infoBorder: dsColors.neutral_20,
  accent: indigo[600] as string,
  accentDeep: indigo[800] as string,
  accentStrong: indigo[700] as string,
  accentSubtle: indigo[100] as string,
  accentDimmed: indigo[50] as string,
  accentBorder: indigo[200] as string,

  text: dsColors.secondary[0],
  textSubtle: dsColors.secondary_80[0],
  textDisabled: dsColors.secondary_60[0],
  textDimmed: dsColors.atmo1[0],
  textLight: base.base_light,
  textDark: base.base_dark,

  border: dsColors.atmo4[0],
  borderSubtle: dsColors.atmo3[0],
  borderStrong: dsColors.secondary_80[0],
  borderDisabled: dsColors.secondary_60[0],

  bgPage: dsColors.atmo2[0],
  bgContainer: dsColors.atmo1[0],
  bgPageSecondary: dsColors.atmo3[0],
  bgContainerSecondary: dsColors.atmo1[0],
  bgHover: dsColors.primary_20[0],
  bgDisabled: dsColors.atmo3[0],
  bgOverlay: `color-mix(in srgb, ${dsColors.atmo4[0]} 80%, transparent)`,
  dimmer: "#FFFFFF",

  shad1: "rgba(65, 65, 65, 0.12)",
  shadow: "0 2px 12px rgba(65,65,65,0.12)",

  /** @deprecated use `bgPage` */
  backgroundColor: dsColors.atmo2[0],
  /** @deprecated use `bgHover` */
  containerBackgroundHover: dsColors.primary_20[0],

  ...categorical,
} satisfies HvColorTokens & Record<string, string>;
// #endregion

// #region Dark palette
const dark = {
  ...getColors(dsColors, "dark"),

  primary: dsColors.primary[1],
  primaryDeep: dsColors.primary_80[1],
  primaryStrong: dsColors.primary_80[1],
  primarySubtle: dsColors.primary_20[1],
  primaryDimmed: dsColors.primary_20[1],
  positive: dsColors.positive[1],
  positiveDeep: dsColors.positive_120[1],
  positiveStrong: dsColors.positive_80[1],
  positiveDimmed: dsColors.positive_20,
  positiveSubtle: dsColors.positive_20,
  positiveBorder: dsColors.positive_20,
  warning: dsColors.warning[1],
  warningDeep: dsColors.warning_140[1],
  warningStrong: dsColors.warning_120[1],
  warningDimmed: dsColors.warning_20,
  warningSubtle: dsColors.warning_20,
  warningBorder: dsColors.warning_20,
  negative: dsColors.negative[1],
  negativeDeep: dsColors.negative_120[1],
  negativeStrong: dsColors.negative_80[1],
  negativeDimmed: dsColors.negative_20,
  negativeSubtle: dsColors.negative_20,
  negativeBorder: dsColors.negative_20,
  info: dsColors.neutral[1],
  infoDeep: dsColors.neutral[1],
  infoStrong: dsColors.neutral[1],
  infoDimmed: dsColors.neutral_20,
  infoSubtle: dsColors.neutral_20,
  infoBorder: dsColors.neutral_20,
  accent: indigo[500] as string,
  accentDeep: indigo[700] as string,
  accentStrong: indigo[600] as string,
  accentSubtle: indigo[900] as string,
  accentDimmed: indigo[950] as string,
  accentBorder: indigo[800] as string,

  text: dsColors.secondary[1],
  textSubtle: dsColors.secondary_80[1],
  textDisabled: dsColors.secondary_60[1],
  textDimmed: dsColors.atmo1[1],
  textLight: base.base_light,
  textDark: base.base_dark,

  border: dsColors.atmo4[1],
  borderSubtle: dsColors.atmo3[1],
  borderStrong: dsColors.secondary_80[0],
  borderDisabled: dsColors.secondary_60[0],

  bgPage: dsColors.atmo2[1],
  bgContainer: dsColors.atmo1[1],
  bgPageSecondary: dsColors.atmo3[1],
  bgContainerSecondary: dsColors.atmo1[1],
  bgHover: dsColors.primary_20[1],
  bgDisabled: dsColors.atmo3[1],
  bgOverlay: `color-mix(in srgb, ${dsColors.atmo4[1]} 80%, transparent)`,
  dimmer: "#000000",

  shad1: "rgba(0,0,0,.16)",
  shadow: "0 3px 5px rgba(0,0,0,.16)",

  backgroundColor: dsColors.atmo2[1],
  containerBackgroundHover: dsColors.primary_20[1],
  ...categorical,
} satisfies HvColorTokens & Record<string, string>;
// #endregion

export const colors = {
  common,
  light,
  dark,
};

/** @deprecated replace with standard UI Kit ColorTokens in v6 */
type AllColors = typeof colors.common & typeof colors.light;

/** @experimental extendable theme colors */
export interface HvThemeColors extends HvColorTokens, AllColors {}

// TODO: remove in favour of `HvColor`/`HvColorAny`
export type HvAccentColor =
  | "brand"
  | `${"primary" | "secondary"}${"" | "_80" | "_60"}`;
export type HvAtmosphereColor = `atmo${1 | 2 | 3 | 4}`;
export type HvBaseColor = "base_light" | "base_dark";
export type HvSemanticColor =
  | `${"positive" | "neutral" | "warning" | "negative"}${"" | "_20"}`
  | `${"positive" | "warning" | "negative"}_120`
  | `${"positive" | "negative"}_80`
  | "warning_140"
  | "catastrophic"
  | "sema6"
  | `sema${10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19}`;
export type HvCategoricalColor =
  | `cat${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}${"" | "_20" | "_40" | "_60" | "_80" | "_120" | "_140" | "_160" | "_180"}`
  | `cat${13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28}`;

/** A type with all the accepted colors from the color palette */
export type HvColor = keyof HvThemeColors;

/**
 * A type representing an `HvColor` from the palette or any other color string
 * @example "primary" "bgPage" "#FF0000" "purple" "inherit"
 * */
export type HvColorAny = HvColor | Property.Color;
