/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import type {
  HvColorTokens,
  HvThemeColors,
} from "@hitachivantara/uikit-styles";

/** Compatibility object between UI Kit tokens and NEXT tokens */
export const compatMap: Partial<Record<keyof HvThemeColors, string>> = {
  primaryStrong: "primary_80",
  primaryDimmed: "primary_20",
  positiveStrong: "positive_80",
  positiveDeep: "positive_120",
  positiveDimmed: "positive_20",
  warningStrong: "warning_120",
  warningDeep: "warning_140",
  warningDimmed: "warning_20",
  negativeStrong: "negative_80",
  negativeDeep: "negative_120",
  negativeDimmed: "negative_20",
  info: "neutral",
  infoDimmed: "neutral_20",

  text: "secondary",
  textSubtle: "secondary_80",
  textDisabled: "secondary_60",
  textDimmed: "atmo1",
  textLight: "base_light",
  textDark: "base_dark",

  bgHover: "primary_20",
  bgDisabled: "atmo3",
  bgPage: "atmo2",
  bgContainer: "atmo1",
  bgPageSecondary: "atmo3",
  border: "atmo4",
};

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
