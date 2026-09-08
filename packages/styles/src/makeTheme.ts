import { theme, type HvTheme } from "./theme";
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

  return newTheme;
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
    light: {
      ...colors.common,
      ...colors.light,
      ...lightColors,
    },

    dark: {
      ...colors.common,
      ...colors.dark,
      ...darkColors,
    },
  };
};
