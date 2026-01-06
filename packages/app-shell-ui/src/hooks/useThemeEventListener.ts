import { HvAppShellEventTheme } from "@hitachivantara/app-shell-events";
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
