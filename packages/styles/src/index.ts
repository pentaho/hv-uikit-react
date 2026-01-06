import next from "./themes/next";
import pentaho from "./themes/pentaho";

export * from "./CssBaseline";
export * from "./makeTheme";
export * from "./palette";
export * from "./theme";
export * from "./tokens/breakpoints";
export * from "./tokens/colors";
export * from "./tokens/radii";
export * from "./tokens/space";
export * from "./tokens/typography";
export * from "./tokens/zIndices";
export * from "./types";
export * from "./utils";

// Export each theme individually and a bundle of themes
export { next, pentaho };
export const themes = { next, pentaho };
