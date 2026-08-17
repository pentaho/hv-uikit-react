export function getColors<T extends string>(
  colors: Record<T, string | string[]>,
  mode: "light" | "dark",
): Record<T, string> {
  return Object.entries(colors).reduce<Record<string, string>>(
    (acc, [key, color]) => {
      acc[key] = Array.isArray(color) ? color[mode === "light" ? 0 : 1] : color;
      return acc;
    },
    {},
  );
}

export const ds5Colors = {
  // accent
  brand: "#CC0000",
  primary: ["#2064B4", "#639FE3"],
  primary_80: ["#1775E0", "#82B2E8"],
  primary_20: ["#1775E019", "#82B2E84C"],
  secondary: ["#414141", "#CCCCCC"],
  secondary_80: ["#6C6B6B", "#9A9999"],
  secondary_60: ["#999999", "#656565"],

  // atmosphere
  atmo1: ["#FBFCFC", "#313131"],
  atmo2: ["#F4F5F5", "#282828"],
  atmo3: ["#E8E8E8", "#1F1F1F"],
  atmo4: ["#CCCED0", "#4B4B4B"],

  // semantic
  positive: ["#478B1A", "#84D930"],
  positive_80: ["#709C27", "#70BF21"],
  positive_120: ["#227A10", "#63A621"],
  neutral: ["#4D8AC0", "#7EBAD6"],
  warning: ["#F9C846", "#E68C17"],
  warning_120: ["#F8AC39", "#F57B36"],
  warning_140: ["#F27C27", "#FE6B51"],
  negative: ["#D43136", "#FF5E6C"],
  negative_80: ["#ED4747", "#EC3D57"],
  negative_120: ["#B41B3A", "#D92750"],
  catastrophic: ["#930A80", "#9A76E7"],
  neutral_20: "#D8E6F1",
  positive_20: "#D7E6CF",
  negative_20: "#F4D3D4",
  warning_20: "#FBF2D8",
};
