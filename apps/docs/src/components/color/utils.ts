import type { HvColorTokens } from "@pentaho/uikit-styles";

// Groups color tokens by their prefix category.
export const groupColorTokensByCategory = (
  colors: Record<string, string>,
): Record<string, { token: string; value: string }[]> => {
  const groups: Record<string, { token: string; value: string }[]> = {};

  Object.keys(colors).forEach((token) => {
    const match = token.match(/^[a-z]+/);
    const category = match ? match[0] : "misc";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push({ token, value: colors[token] });
  });

  return groups;
};

// Placeholder schema for all required keys
export const colorTokensSpec: HvColorTokens = {
  // Semantic
  primary: "string",
  primaryStrong: "string",
  primaryDimmed: "string",
  primarySubtle: "string",
  primaryDeep: "string",

  accent: "string",
  accentStrong: "string",
  accentDimmed: "string",
  accentSubtle: "string",
  accentDeep: "string",
  accentBorder: "string",

  positive: "string",
  positiveStrong: "string",
  positiveDimmed: "string",
  positiveSubtle: "string",
  positiveDeep: "string",
  positiveBorder: "string",

  warning: "string",
  warningStrong: "string",
  warningDimmed: "string",
  warningSubtle: "string",
  warningDeep: "string",
  warningBorder: "string",

  negative: "string",
  negativeStrong: "string",
  negativeDimmed: "string",
  negativeSubtle: "string",
  negativeDeep: "string",
  negativeBorder: "string",

  info: "string",
  infoStrong: "string",
  infoDimmed: "string",
  infoSubtle: "string",
  infoDeep: "string",
  infoBorder: "string",

  // Text
  text: "string",
  textSubtle: "string",
  textDisabled: "string",
  textDimmed: "string",
  textLight: "string",
  textDark: "string",

  // Borders
  border: "string",
  borderSubtle: "string",
  borderStrong: "string",
  borderDisabled: "string",

  // Backgrounds
  bgPage: "string",
  bgPageSecondary: "string",
  bgContainer: "string",
  bgContainerSecondary: "string",
  bgHover: "string",
  bgDisabled: "string",
  bgOverlay: "string",
  dimmer: "string",

  // Shadows
  shad1: "string",
  shadow: "string",

  // Viz colors
  cat1: "string",
  cat2: "string",
  cat3: "string",
  cat4: "string",
  cat5: "string",
  cat6: "string",
  cat7: "string",
  cat8: "string",
  cat9: "string",
  cat10: "string",
  cat11: "string",
  cat12: "string",
};
