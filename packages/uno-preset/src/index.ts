import { definePreset, mergeConfigs, UserConfig } from "@unocss/core";
import { presetRemToPx } from "@unocss/preset-rem-to-px";
import { presetWind3, PresetWind3Options, Theme } from "@unocss/preset-wind3";

import { rules } from "./rules";
import { extendTheme } from "./theme";

export { rules, extendTheme };

export interface HvUnoOptions extends PresetWind3Options {
  /** Base fontSize size. 1rem = ${baseFontSize}px. @default 16 */
  baseFontSize?: number;
}

export const presetHv = definePreset<HvUnoOptions, Theme>((options) => {
  const { baseFontSize = 16, ...otherOptions } = options || {};
  /** HV base theme configuration */
  const hvConfig: UserConfig<Theme> = {
    extendTheme,
    rules,
  };

  return {
    name: "@hitachivantara/uikit-uno-preset",
    ...mergeConfigs([
      // base uno config
      presetWind3(otherOptions),
      // convert rem to px & make 1 unit 8px (32px = 1rem => 1/4rem = 8px)
      presetRemToPx({ baseFontSize }),
      hvConfig,
    ]),
  };
});
