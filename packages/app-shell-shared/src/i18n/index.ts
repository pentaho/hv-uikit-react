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
