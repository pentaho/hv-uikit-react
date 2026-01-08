import { useEffect, useMemo, useState } from "react";
import { EmotionCache } from "@emotion/cache";
import {
  ThemeProvider as MuiThemeProvider,
  useColorScheme,
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
import { createMuiTheme } from "./utils";

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

function HvThemeProviderInner({
  children,
  theme,
  colorMode: colorModeProp,
  themeRootId: rootId,
}: HvThemeProviderProps) {
  const [colorModeValue, setColorModeValue] = useState(colorModeProp);
  const { setMode } = useColorScheme();

  /** safe `colorMode`, ensuring no invalid values are used */
  const colorMode = colorModeValue === "dark" ? "dark" : "light";

  // review in v6 so that theme/colorMode isn't both controlled & uncontrolled
  useEffect(() => {
    setColorModeValue(colorModeProp);
    setMode(colorModeProp);
    // eslint-disable-next-line react-hooks/exhaustive-deps setMode isn't stable
  }, [colorModeProp]);

  useEffect(() => {
    const element = getContainerElement(rootId);
    if (!element) return;
    setElementAttrs(element, theme.name, colorMode);
  }, [colorMode, rootId, theme.name]);

  const value = useMemo<HvThemeContextValue>(
    () => ({
      colorModes: ["light", "dark"],
      // activeTheme: theme as HvTheme,
      selectedMode: colorMode,
      changeMode(newMode = colorMode) {
        setColorModeValue(newMode);
        setMode(newMode);
      },
      rootId,

      // TODO: remove once backwards-compatibility is not needed anymore
      activeTheme: {
        ...(theme as HvTheme),
        colors: {
          ...theme.colors,
          modes: {
            ...theme.colors,
            light: { ...theme.colors.light, type: "light" },
            dark: { ...theme.colors.dark, type: "dark" },
          },
        },
      },
      themes: [theme],
      selectedTheme: theme.name,
      changeTheme(theme: string, mode: HvThemeColorMode) {
        setColorModeValue(mode);
        setMode(mode);
      },
    }),
    [theme, colorMode, setMode, rootId],
  );

  return (
    <HvThemeContext.Provider value={value}>{children}</HvThemeContext.Provider>
  );
}

export function HvThemeProvider(props: HvThemeProviderProps) {
  const { theme, emotionCache, colorMode } = props;

  const muiTheme = useMemo(() => {
    return createMuiTheme(theme);
  }, [theme]);

  const emotionCacheValue = useMemo(
    () => ({ cache: emotionCache }),
    [emotionCache],
  );

  return (
    <MuiThemeProvider theme={muiTheme} defaultMode={colorMode}>
      <EmotionContext.Provider value={emotionCacheValue}>
        <HvThemeProviderInner {...props} />
      </EmotionContext.Provider>
    </MuiThemeProvider>
  );
}
