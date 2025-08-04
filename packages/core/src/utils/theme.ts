import { HvTheme } from "@hitachivantara/uikit-react-shared";
import {
  HvThemeColorMode,
  HvThemeStructure,
} from "@hitachivantara/uikit-styles";

import { themes } from "../themes";

/**
 * Sets the element attributes and style for a theme and color mode.
 */
export const setElementAttrs = (
  element: HTMLElement,
  themeName: string,
  modeName: HvThemeColorMode,
) => {
  element.dataset.theme = themeName;
  element.dataset.colorMode = modeName;

  // set default styles for child components to inherit
  element.classList.add("uikit-root-element");
  element.style.colorScheme = modeName;
};

/**
 * Process the themes provided to the HvProvider:
 *  - Cleans themes with the same name
 *  - Returns the default if the list is empty (ds5)
 */
export const processThemes = (
  themesList?: (HvTheme | HvThemeStructure)[],
): (HvTheme | HvThemeStructure)[] => {
  if (themesList && Array.isArray(themesList) && themesList.length > 0) {
    const list: (HvTheme | HvThemeStructure)[] = [];

    themesList.forEach((thm) => {
      const i: number = list.findIndex(
        (t) => t.name.trim() === thm.name.trim(),
      );

      if (i !== -1) {
        list.splice(i, 1);
        list.push(thm);
      } else {
        list.push(thm);
      }
    });

    // Cleaned themes
    return list;
  }
  // DS5
  return [themes.ds5];
};
