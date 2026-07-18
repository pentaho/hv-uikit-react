/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { createContext } from "react";
import type { HvThemeColorMode } from "@hitachivantara/uikit-styles";

import type { HvTheme } from "../types/theme";

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

  // TODO: remove once backwards-compatibility is not needed anymore
  // @ts-expect-error removed from API interfaces to avoid usage
  themes: [],
  selectedTheme: "",
  changeTheme() {},
});
