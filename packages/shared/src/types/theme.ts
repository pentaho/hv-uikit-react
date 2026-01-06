import { HvThemeStructure } from "@hitachivantara/uikit-styles";

/** This type allows to pass undetermined extra props to components recursively */
type HvExtraDeepProps<T> = {
  [P in keyof T]: T[P] & Record<string, any>;
} & Record<string, any>;

/**
 * Theme structure
 */
export type HvTheme = HvExtraDeepProps<HvThemeStructure>;
