import { createContext } from "react";
import { HvThemeColorMode } from "@hitachivantara/uikit-styles";

import { HvTheme } from "../types/theme";

export interface HvThemeContextValue {
  colorModes: HvThemeColorMode[];
  activeTheme?: HvTheme;
  selectedMode: HvThemeColorMode;
  changeMode: (mode?: HvThemeColorMode) => void;
  rootId?: string;
}

export const HvThemeContext = createContext<HvThemeContextValue>({
  activeTheme: undefined,
  colorModes: [],
  selectedMode: "light",
  changeMode: () => {},
  rootId: undefined,
});
