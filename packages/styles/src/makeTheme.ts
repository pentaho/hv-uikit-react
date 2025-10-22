import { HvTheme, theme } from "./theme";
import { baseTheme } from "./tokens";
import {
  colors,
  type HvColorTokens,
  type HvThemeColors,
} from "./tokens/colors";
import type { HvCustomTheme, HvThemeStructure } from "./types";
import { mergeTheme } from "./utils";

const getKey = (...keys: string[]) => keys.filter(Boolean).join("-");

/** Uses a Proxy to output the CSS Vars based on the `themeObject` */
const makeVarsProxy = (themeObject: Record<string, any>, parentKey = "") => {
  return new Proxy(themeObject, {
    get(target, prop) {
      if (prop === "vars" || typeof prop !== "string") return null;

      if (typeof target[prop] === "object" && target[prop] != null) {
        return makeVarsProxy(target[prop], getKey(parentKey, prop));
      }

      return `var(--${getKey("uikit", parentKey, prop)})`;
    },
  });
};

/**
 * Generate a theme base on the options received.
 * Takes an incomplete theme object and adds the missing parts.
 *
 * @param options The options to generate the theme
 * @returns The generated theme
 */
export const makeTheme = (
  options: HvCustomTheme | ((theme: HvTheme) => HvCustomTheme),
): HvThemeStructure => {
  const customTheme = typeof options === "function" ? options(theme) : options;
  const newTheme = mergeTheme(baseTheme, customTheme);

  // @ts-expect-error type this correctly
  newTheme.vars = makeVarsProxy(newTheme);
  // add `modes` for backwards compatibility with existing v5 apps
  // TODO: remove when this is no longer deemed necessary
  // @ts-expect-error backwards compatibility hack
  newTheme.colors.modes = {
    dawn: newTheme.colors.light,
    wicked: newTheme.colors.dark,
  };

  return newTheme;
};

/** Compatibility object between UI Kit tokens and NEXT tokens */
const compatMap: Partial<Record<keyof HvThemeColors, string>> = {
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

/** Adds the NEXT compatibility colors for a given palette. @example `bgPage` => `bgPage` => `atmo2` */
const extendCompatColors = (colors: Partial<HvThemeColors>) => {
  return Object.entries(colors).reduce((acc, [key, color]) => {
    const compatKey = compatMap[key as keyof typeof compatMap];
    if (compatKey) {
      acc[compatKey as keyof typeof acc] = color;
    }
    return acc;
  }, colors);
};

/**
 * Takes in a subset `HvThemeColors`, where the values can be the `[light,dark]` colors theme tuple,
 * or a single color for both light and dark modes.
 * @private @internal internal use only
 */
export const makeColors = (
  inputColors: Partial<Record<keyof HvThemeColors, string[] | string>>,
): HvCustomTheme["colors"] => {
  const [lightColors, darkColors] = Object.entries(inputColors).reduce(
    (acc, [key, color]) => {
      const [lightColor, darkColor] =
        typeof color === "string" ? [color, color] : color;

      if (lightColor) {
        acc[0][key as keyof HvColorTokens] = lightColor;
      }
      if (darkColor) {
        acc[1][key as keyof HvColorTokens] = darkColor;
      }
      return acc;
    },
    [{}, {}] as [Partial<HvThemeColors>, Partial<HvThemeColors>],
  );

  return {
    light: extendCompatColors({
      ...colors.common,
      ...colors.light,
      ...lightColors,
    }),

    dark: extendCompatColors({
      ...colors.common,
      ...colors.dark,
      ...darkColors,
    }),
  };
};
