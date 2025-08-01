import { createContext } from "react";

import { HvTheme } from "../types/theme";

export interface HvThemeContextValue {
  colorModes: string[];
  activeTheme?: HvTheme;
  selectedMode: string;
  changeMode: (mode?: string) => void;
  rootId?: string;
}

export const HvThemeContext = createContext<HvThemeContextValue>({
  activeTheme: undefined,
  colorModes: [],
  selectedMode: "",
  changeMode: () => {},
  rootId: undefined,
});
