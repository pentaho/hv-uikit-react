import { create, ThemeVarsPartial } from "storybook/theming";
import { pentahoPlus } from "@hitachivantara/uikit-styles";

const { colors } = pentahoPlus;

const getThemeVars = (base: "light" | "dark"): ThemeVarsPartial => ({
  base,

  appBg: colors[base].bgContainer,
  appBorderRadius: 0,
  appContentBg: colors[base].bgContainer,
  barBg: colors[base].bgContainer,
  barSelectedColor: colors[base].primary,
  barTextColor: colors[base].text,
  brandImage: `ui-kit-logo-${base}.png`,
  brandTitle: "UI Kit",

  colorPrimary: colors[base].primary,
  colorSecondary: colors[base].text,
  fontBase: "'Open Sans',sans-serif",
  fontCode: "monospace",
  textColor: colors[base].text,
  textInverseColor: colors[base === "dark" ? "light" : "dark"].text,
  textMutedColor: colors[base].textSubtle,

  // controls styles
  booleanBg: colors[base].bgPage,
  booleanSelectedBg: colors[base].bgContainer,
  buttonBg: colors[base].bgContainer,
  buttonBorder: colors[base].text,
  inputBg: colors[base].bgContainer,
  inputBorder: colors[base].textDisabled,
  inputBorderRadius: 2,
  inputTextColor: colors[base].text,
});

export const themes = {
  dark: create(getThemeVars("dark")),
  light: create(getThemeVars("light")),
};
