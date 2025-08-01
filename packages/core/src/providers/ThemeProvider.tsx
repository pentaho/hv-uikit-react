import { useEffect, useMemo, useState } from "react";
import { EmotionCache } from "@emotion/cache";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import {
  defaultCacheKey,
  defaultEmotionCache,
  EmotionContext,
  HvThemeContext,
  type HvTheme,
  type HvThemeContextValue,
} from "@hitachivantara/uikit-react-shared";
import { HvThemeStructure } from "@hitachivantara/uikit-styles";

import { setElementAttrs } from "../utils/theme";

export { HvThemeContext };
export type { HvThemeContextValue };

export { defaultCacheKey, defaultEmotionCache, EmotionContext };

interface HvThemeProviderProps {
  children: React.ReactNode;
  theme: HvTheme | HvThemeStructure;
  emotionCache: EmotionCache;
  colorMode: string;
  themeRootId?: string;
}

export const HvThemeProvider = ({
  children,
  theme,
  emotionCache,
  colorMode: colorModeProp,
  themeRootId: rootId,
}: HvThemeProviderProps) => {
  const [colorMode, setColorMode] = useState(colorModeProp);

  const {
    theme: activeTheme,
    selectedMode,
    colorModes,
    colorScheme,
  } = useMemo(() => {
    const colorModes = Object.keys(theme.colors.modes);
    const selectedMode = colorModes.includes(colorMode)
      ? colorMode
      : colorModes[0];
    const colorScheme = theme.colors.modes[selectedMode].type;

    return {
      theme,
      selectedMode,
      colorModes,
      colorScheme,
    };
  }, [theme, colorMode]);

  // review in v6 so that theme/colorMode isn't both controlled & uncontrolled
  useEffect(() => {
    setColorMode(colorModeProp);
  }, [colorModeProp]);

  useEffect(() => {
    setElementAttrs(activeTheme.name, selectedMode, colorScheme, rootId);
  }, [colorScheme, rootId, selectedMode, activeTheme.name]);

  const value = useMemo<HvThemeContextValue>(
    () => ({
      colorModes,
      activeTheme: activeTheme as HvTheme,
      selectedMode,
      changeMode(newMode = selectedMode) {
        setColorMode(newMode);
      },
      rootId,
    }),
    [colorModes, activeTheme, selectedMode, rootId],
  );

  const muiTheme = useMemo(() => {
    const colors = activeTheme.colors.modes[selectedMode];
    return createTheme({
      colorSchemes: { light: true, dark: true },
      spacing: activeTheme.space.base,
      typography: {
        fontFamily: activeTheme.fontFamily.body,
      },
      palette: {
        primary: { main: colors.primary },
        success: { main: colors.positive },
        warning: { main: colors.warning },
        error: { main: colors.negative },
        info: { main: colors.info },
        text: {
          primary: colors.text,
          secondary: colors.textSubtle,
          disabled: colors.textDisabled,
        },
        background: {
          default: colors.bgPage,
          paper: colors.bgContainer,
        },
        divider: colors.border,
        action: {
          active: colors.primary,
          hover: colors.primaryStrong,
          selected: colors.primaryStrong,
          disabled: colors.textDisabled,
          disabledBackground: colors.bgDisabled,
        },
      },
      components: {
        MuiButtonBase: {
          defaultProps: {
            disableRipple: true,
            disableTouchRipple: true,
          },
        },
      },
      breakpoints: activeTheme.breakpoints,
    });
  }, [activeTheme, selectedMode]);

  const emotionCacheValue = useMemo(
    () => ({ cache: emotionCache }),
    [emotionCache],
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <HvThemeContext.Provider value={value}>
        <EmotionContext.Provider value={emotionCacheValue}>
          {children}
        </EmotionContext.Provider>
      </HvThemeContext.Provider>
    </MuiThemeProvider>
  );
};
