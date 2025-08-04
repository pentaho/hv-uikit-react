import type {
  DeepString,
  HvThemeBreakpoint,
  HvThemeColorMode,
  HvThemeStructure,
  HvThemeVars,
  SpacingValue,
} from "./types";

export const spacingUtil = (value: SpacingValue, vars: HvThemeVars): string => {
  switch (typeof value) {
    case "number":
      return value === 0 ? "0" : `calc(${vars.space.base} * ${value}px)`;
    case "string":
      return vars.space[value as HvThemeBreakpoint] || value;
    default:
      return value;
  }
};

// TODO: remove in favour or `spacingUtil` in v6
export const spacingUtilOld = (
  value: SpacingValue,
  vars: HvThemeVars,
): string => {
  switch (typeof value) {
    case "number":
      return `${value}px`;
    case "string":
      return vars.space[value as HvThemeBreakpoint] || value;
    default:
      return "0px";
  }
};

const toCSSVars = (obj: object, prefix = "--uikit") => {
  const vars: Record<string, string> = {};

  if (!obj || typeof obj !== "object") return vars;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object") {
      const nestedVars = toCSSVars(value, `${prefix}-${key}`);

      for (const [nestedKey, nestedValue] of Object.entries(nestedVars)) {
        vars[nestedKey] = nestedValue;
      }
    } else {
      vars[`${prefix}-${key}`] = value;
    }
  }

  return vars;
};

export const hasMultipleArgs = <T>(args: T[] | [T[]]): args is T[] => {
  return args.length > 1;
};

export const mapCSSVars = <T extends object>(
  obj: T,
  prefix = "--uikit",
): DeepString<T> => {
  const vars: DeepString<any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object") {
      vars[key] = mapCSSVars(value, `${prefix}-${key}`);
    } else {
      vars[key] = `var(${prefix}-${key})`;
    }
  }

  return vars;
};

const isObject = (obj: unknown) => obj && typeof obj === "object";

// TODO: review in v6:
// - typings: accept any or theme object?
// - arguments: source/target themes, or any number of theme objects?
export const mergeTheme = (...objects: any[]): HvThemeStructure => {
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeTheme(pVal, oVal);
      } else {
        prev[key] = oVal !== undefined ? oVal : pVal;
      }
    });

    return prev;
  }, {});
};

export const getThemeVars = (theme: HvThemeStructure) => {
  const cssVars: Record<string, any> = {};

  const colorModes: HvThemeColorMode[] = ["light", "dark"];

  colorModes.forEach((colorMode) => {
    const styleName = `[data-theme="${theme.name}"][data-color-mode="${colorMode}"]`;
    const themeName = `[data-theme="${theme.name}"]`;

    // exclude properties that shouldn't be mapped to CSS variables
    // @ts-expect-error align HvTheme <-> HvThemeStructure?
    const { base, components, name, colors, palette, icons, vars, ...rest } =
      theme;

    cssVars[styleName] = toCSSVars({
      colors: {
        ...colors[colorMode],
      },
    });

    cssVars[themeName] = toCSSVars({
      ...rest,
    });
  });

  return cssVars;
};
