import { breakpoints } from "./breakpoints";
import { colors } from "./colors";
import { radii } from "./radii";
import { space } from "./space";
import { fontFamily, fontSizes, fontWeights, lineHeights } from "./typography";
import { zIndices } from "./zIndices";

/**
 * Base theme tokens to use when merging with theme, used to merge with the makeTheme utility.
 * Mostly just the uses the `tokens` directly, but also adds other properties like `typography` or component vars.
 */
export const baseTheme = {
  breakpoints,
  colors,
  radii,
  space,
  zIndices,
  fontFamily,
  fontSizes,
  fontWeights,
  lineHeights,
};
