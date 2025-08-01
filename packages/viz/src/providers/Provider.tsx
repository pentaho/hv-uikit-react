import { createContext, useContext, useMemo } from "react";
import { useTheme, type HvTheme } from "@hitachivantara/uikit-react-utils";

import { registerTheme } from "../utils/registerTheme";

export interface HvVizContextValue {
  /**
   * Current theme
   */
  theme?: string;
  /**
   * The current active theme
   */
  activeTheme?: HvTheme;
}

export const HvVizContext = createContext<HvVizContextValue>({
  theme: undefined,
});

export interface HvVizProviderProps {
  /**
   * Component tree.
   */
  children?: React.ReactNode;
}

/**
 * Enables theming capabilities for visualizations.
 *
 * Without this provider the visualizations will not comply to the UI Kit themes.
 *
 * This provider should always be used in combination with the `HvProvider` from
 * the core package since the former uses the themes provided by the latter.
 *
 * `HvVizProvider` should always be used after `HvProvider` like so to work properly:
 *
 * ```
 * <HvProvider>
 *    <HvVizProvider>
 *        (...)
 *    </HvVizProvider>
 * </HvProvider>
 * ```
 */
export const HvVizProvider = ({ children }: HvVizProviderProps) => {
  const { activeTheme, selectedMode } = useTheme();

  const value = useMemo(() => {
    const themeName = `${activeTheme?.name}-${selectedMode}`;
    registerTheme(themeName, selectedMode, activeTheme);
    return { theme: themeName, activeTheme };
  }, [selectedMode, activeTheme]);

  return (
    <HvVizContext.Provider value={value}>{children}</HvVizContext.Provider>
  );
};

export const useVizTheme = () => {
  return useContext(HvVizContext);
};
