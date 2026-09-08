import { useContext, useMemo } from "react";
import {
  HvThemeContext,
  type HvThemeContextValue,
} from "@pentaho/uikit-react-shared";
import type { HvThemeColorsAny } from "@pentaho/uikit-styles";

interface ThemeContextValue extends HvThemeContextValue {
  /** Colors of the currently active theme and mode */
  colors?: HvThemeColorsAny;
}

export const useTheme = () => {
  const context = useContext(HvThemeContext);

  return useMemo<ThemeContextValue>(() => {
    const { activeTheme, selectedMode } = context;
    return { ...context, colors: activeTheme?.colors?.[selectedMode] };
  }, [context]);
};
