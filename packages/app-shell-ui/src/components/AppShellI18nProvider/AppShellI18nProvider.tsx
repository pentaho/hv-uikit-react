import { useContext, useMemo, type PropsWithChildren } from "react";
import { I18nContext, useTranslation } from "react-i18next";
import { HvAppShellI18nContext } from "@hitachivantara/app-shell-shared";

export function HvAppShellI18nProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const { i18n } = useContext(I18nContext);

  // "Hack" to register for any language changes (even if externally triggered).
  // The default namespace is fine (any namespace works).
  useTranslation();

  const language = i18n.language;

  const appShellI18n = useMemo(
    () => ({
      language,
      changeLanguage: async (newLng?: string) => {
        if (i18n) {
          await i18n.changeLanguage(newLng);
        } else {
          // Should not really happen, but J.I.C., logging.
          console.warn("I18N not initialized");
        }

        return undefined;
      },
    }),
    [i18n, language],
  );

  return (
    <HvAppShellI18nContext.Provider value={appShellI18n}>
      {children}
    </HvAppShellI18nContext.Provider>
  );
}
