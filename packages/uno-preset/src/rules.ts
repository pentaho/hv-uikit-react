import type { UserConfig } from "@unocss/core";
import type { Theme } from "@unocss/preset-wind3";
import { theme as hvCssVars } from "@pentaho/uikit-styles";

export const rules: UserConfig<Theme>["rules"] = [
  ["bg-default", { "background-color": hvCssVars.colors.bgPage }],
  // fix for `gap-xxs` being parsed as `gap-x-xs`
  ["gap-xxs", { gap: hvCssVars.space.xxs }],
  ["m-xxs", { margin: hvCssVars.space.xxs }],
  ["p-xxs", { padding: hvCssVars.space.xxs }],
];
