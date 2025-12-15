import { useEffect, useMemo, useState } from "react";
import { EmotionCache } from "@emotion/cache";
import {
  createTheme as createMuiTheme,
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
import {
  HvThemeColorMode,
  HvThemeStructure,
} from "@hitachivantara/uikit-styles";

import { getContainerElement } from "../utils/document";
import { setElementAttrs } from "../utils/theme";

export { HvThemeContext };
export type { HvThemeContextValue };

export { defaultCacheKey, defaultEmotionCache, EmotionContext };

interface HvThemeProviderProps {
  children: React.ReactNode;
  theme: HvTheme | HvThemeStructure;
  emotionCache: EmotionCache;
  colorMode: HvThemeColorMode;
  themeRootId?: string;
}

export const HvThemeProvider = ({
  children,
  theme,
  emotionCache,
  colorMode: colorModeProp,
  themeRootId: rootId,
}: HvThemeProviderProps) => {
  const [colorModeValue, setColorModeValue] = useState(colorModeProp);

  /** safe `colorMode`, ensuring no invalid values are used */
  const colorMode = colorModeValue === "dark" ? "dark" : "light";

  // review in v6 so that theme/colorMode isn't both controlled & uncontrolled
  useEffect(() => {
    setColorModeValue(colorModeProp);
  }, [colorModeProp]);

  useEffect(() => {
    const element = getContainerElement(rootId);
    if (!element) return;
    setElementAttrs(element, theme.name, colorMode);
  }, [colorMode, rootId, theme.name]);

  const value = useMemo<HvThemeContextValue>(
    () => ({
      colorModes: ["light", "dark"],
      activeTheme: theme as HvTheme,
      selectedMode: colorMode,
      changeMode(newMode = colorMode) {
        setColorModeValue(newMode);
      },
      rootId,

      // TODO: remove once backwards-compatibility is not needed anymore
      themes: () => [theme],
      selectedTheme: () => theme.name,
      changeTheme(theme: string, mode: string) {
        setColorModeValue(mode as any);
      },
    }),
    [theme, colorMode, rootId],
  );

  const muiTheme = useMemo(() => {
    const colors = theme.colors[colorMode] || theme.colors.light;
    return createMuiTheme({
      colorSchemes: { light: true, dark: true },
      spacing: theme.space.base,
      typography: {
        fontFamily: theme.fontFamily.body,
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
      breakpoints: theme.breakpoints,
    });
  }, [theme, colorMode]);

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
