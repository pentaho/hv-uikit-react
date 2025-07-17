import ds5 from "./themes/ds5";
import pentahoPlus from "./themes/pentahoPlus";

export * from "./palette";
export * from "./types";
export * from "./theme";
export * from "./makeTheme";
export * from "./utils";
export * from "./tokens/breakpoints";
export * from "./tokens/colors";
export * from "./tokens/radii";
export * from "./tokens/space";
export * from "./tokens/sizes";
export * from "./tokens/typography";
export * from "./tokens/zIndices";
export * from "./CssBaseline";

// Export each theme individually and a bundle of themes
export { ds5, pentahoPlus };
export const themes = { ds5, pentahoPlus };
