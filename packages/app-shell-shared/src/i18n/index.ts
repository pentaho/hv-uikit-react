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
import { createContext, useContext } from "react";

export const CONFIG_TRANSLATIONS_NAMESPACE = "app";

/**
 * The App Shell I18N context.
 */
export type HvAppShellI18nContextValue = {
  /**
   * Gets the current language of the App Shell, as a BCP 47 language tag.
   */
  language: string;

  /**
   * Sets the App Shell's current language.
   */
  changeLanguage: (newLng?: string) => Promise<void>;
};

export const HvAppShellI18nContext = createContext<
  HvAppShellI18nContextValue | undefined
>(undefined);

/**
 * Gets the App Shell's I18N context.
 */
export const useHvAppShellI18n = (): HvAppShellI18nContextValue => {
  const context = useContext(HvAppShellI18nContext);
  if (!context) {
    throw new Error(
      "useHvAppShellI18n must be used within HvAppShellI18nContext.Provider",
    );
  }

  return context;
};
