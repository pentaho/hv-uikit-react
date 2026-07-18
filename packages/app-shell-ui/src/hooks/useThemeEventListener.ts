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
import type { HvAppShellEventTheme } from "@hitachivantara/app-shell-events";
import { useTheme } from "@hitachivantara/uikit-react-core";

import useLocalStorage from "./useLocalStorage";

const useThemeEventListener = () => {
  const { selectedMode, colorModes, changeMode } = useTheme();
  const { setStoredValue } = useLocalStorage("COLOR_MODE");

  const getNextColorMode = () => {
    const nextIndex = colorModes.indexOf(selectedMode) + 1;
    return colorModes[nextIndex % colorModes.length];
  };

  const handleThemeEvent = (event: CustomEvent<HvAppShellEventTheme>) => {
    const { colorMode } = event.detail;
    const newColorMode =
      !colorMode || colorModes.indexOf(colorMode) === -1
        ? getNextColorMode()
        : colorMode;

    changeMode(newColorMode);
    setStoredValue(newColorMode);
  };

  return { handleThemeEvent };
};

export default useThemeEventListener;
