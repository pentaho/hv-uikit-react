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
import type { HvThemeColorMode } from "@hitachivantara/uikit-styles";

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
