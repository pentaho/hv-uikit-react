import { useContext, useMemo } from "react";
import {
  HvThemeContext,
  type HvTheme,
  type HvThemeContextValue,
} from "@hitachivantara/uikit-react-shared";

interface ThemeContextValue extends HvThemeContextValue {
  /** Colors of the currently active theme and mode */
  colors?: HvTheme["colors"]["modes"]["mode"];
}

export const useTheme = () => {
  const context = useContext(HvThemeContext);

  return useMemo<ThemeContextValue>(() => {
    const { activeTheme, selectedMode } = context;
    return {
      ...context,
      colors:
        activeTheme?.colors.modes?.[selectedMode] ||
        // workaround for v5 + v6 theme compatibility
        activeTheme?.colors?.[selectedMode],
    };
  }, [context]);
};
