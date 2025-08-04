import { useContext, useMemo } from "react";
import {
  HvThemeContext,
  type HvThemeContextValue,
} from "@hitachivantara/uikit-react-shared";
import type { HvThemeColorsAny } from "@hitachivantara/uikit-styles";

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
