import type { Property } from "csstype";

import {
  amber,
  blue,
  cyan,
  emerald,
  fuchsia,
  green,
  indigo,
  lime,
  neutral,
  orange,
  pink,
  red,
  rose,
  sky,
  slate,
  teal,
  violet,
  yellow,
} from "../palette";

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

// export type ColorValue = string | [string, string];

/** 🔎: border tokens don't exist for "primary"  */
type BorderKeys = `${Exclude<SemanticTypes, "primary">}Border`;

export interface HvColorTokens
  extends
    Record<SemanticKeys<SemanticTypes>, string>,
    Record<VizKeys, string>,
    Record<BorderKeys, string> {
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

const categorical = {
  cat1: blue[300],
  cat2: orange[300],
  cat3: teal[400],
  cat4: violet[400],
  cat5: pink[400],
  cat6: yellow[400],
  cat7: fuchsia[300],
  cat8: cyan[400],
  cat9: lime[300],
  cat10: rose[400],
  cat11: green[600],
  cat12: indigo[500],
};

const common = {
  ...categorical,
} satisfies Partial<HvColorTokens>;

export const light = {
  primary: blue[600],
  primaryDeep: blue[800],
  primaryStrong: blue[700],
  primarySubtle: blue[200],
  primaryDimmed: blue[100],
  positive: emerald[600],
  positiveDeep: emerald[800],
  positiveStrong: emerald[700],
  positiveDimmed: emerald[50],
  positiveSubtle: emerald[100],
  positiveBorder: emerald[200],
  warning: amber[500],
  warningDeep: amber[700],
  warningStrong: amber[600],
  warningDimmed: amber[50],
  warningSubtle: amber[100],
  warningBorder: amber[200],
  negative: red[600],
  negativeDeep: red[800],
  negativeStrong: red[700],
  negativeDimmed: red[50],
  negativeSubtle: red[100],
  negativeBorder: red[200],
  info: sky[500],
  infoDeep: sky[700],
  infoStrong: sky[600],
  infoDimmed: sky[50],
  infoSubtle: sky[100],
  infoBorder: sky[200],
  accent: indigo[600],
  accentDeep: indigo[800],
  accentStrong: indigo[700],
  accentSubtle: indigo[100],
  accentDimmed: indigo[50],
  accentBorder: indigo[200],

  text: slate[700],
  textSubtle: slate[500],
  textDisabled: neutral[400],
  textDimmed: slate[400],
  textLight: slate[50],
  textDark: slate[700],

  border: slate[300],
  borderSubtle: slate[200],
  borderStrong: slate[500],
  borderDisabled: neutral[400],

  bgPage: slate[100],
  bgContainer: slate[50],
  bgPageSecondary: slate[200],
  bgContainerSecondary: slate[100],
  bgHover: blue[600],
  bgDisabled: neutral[200],
  bgOverlay: slate[950],
  dimmer: "#FFFFFF",

  shad1: "rgba(65, 65, 65, 0.12)",
  shadow: "0 2px 12px rgba(65,65,65,0.12)",

  ...common,
} satisfies HvColorTokens;

export const dark = {
  primary: blue[500],
  primaryDeep: blue[700],
  primaryStrong: blue[600],
  primarySubtle: blue[900],
  primaryDimmed: blue[950],
  positive: green[600],
  positiveDeep: green[300],
  positiveStrong: green[500],
  positiveDimmed: green[950],
  positiveSubtle: green[900],
  positiveBorder: green[800],
  warning: yellow[500],
  warningDeep: yellow[300],
  warningStrong: yellow[400],
  warningDimmed: yellow[950],
  warningSubtle: yellow[900],
  warningBorder: yellow[800],
  negative: red[600],
  negativeDeep: red[300],
  negativeStrong: red[500],
  negativeDimmed: red[950],
  negativeSubtle: red[900],
  negativeBorder: red[800],
  info: cyan[500],
  infoDeep: cyan[300],
  infoStrong: cyan[400],
  infoDimmed: cyan[950],
  infoSubtle: cyan[900],
  infoBorder: cyan[800],
  accent: indigo[500],
  accentDeep: indigo[700],
  accentStrong: indigo[600],
  accentSubtle: indigo[900],
  accentDimmed: indigo[950],
  accentBorder: indigo[800],

  text: slate[50],
  textSubtle: slate[400],
  textDisabled: neutral[500],
  textDimmed: slate[600],
  textLight: slate[50],
  textDark: slate[700],

  border: slate[700],
  borderSubtle: slate[950],
  borderStrong: slate[400],
  borderDisabled: neutral[700],

  bgPage: slate[900],
  bgContainer: slate[800],
  bgPageSecondary: slate[950],
  bgContainerSecondary: slate[900],
  bgHover: blue[600],
  bgDisabled: neutral[900],
  bgOverlay: slate[900],
  dimmer: "#000000",

  shad1: "rgba(0,0,0,.16)",
  shadow: "0 3px 5px rgba(0,0,0,.16)",

  ...common,
} satisfies HvColorTokens;

export const colors = {
  common,
  light,
  dark,
};

/** @experimental extendable theme colors */
export interface HvThemeColors extends HvColorTokens {}

/** A type with all the accepted colors from the color palette */
export type HvColor = keyof HvThemeColors;

/**
 * A type representing an `HvColor` from the palette or any other color string
 * @example "primary" "bgPage" "#FF0000" "purple" "inherit"
 * */
export type HvColorAny = HvColor | Property.Color;
