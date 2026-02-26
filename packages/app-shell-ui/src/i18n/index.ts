import { initReactI18next } from "react-i18next";
import { createInstance, type i18n } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// @ts-ignore
import en from "./localization/en.json";
// @ts-ignore
import pt from "./localization/pt.json";

export const APP_SHELL_NAMESPACE = "appShell";
export const addResourceBundles = (
  i18nInstance: i18n,
  bundles: Record<string, object>,
  namespace?: string,
) => {
  Object.entries(bundles).forEach((entry) => {
    const [key, value] = entry;
    i18nInstance.addResourceBundle(
      key,
      namespace ?? APP_SHELL_NAMESPACE,
      value,
    );
  });
};

export const createI18Next = (): i18n => {
  const newInstance = createInstance();
  newInstance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      defaultNS: APP_SHELL_NAMESPACE,
      fallbackLng: "en",
      detection: { order: ["navigator"] },
      resources: {},
    });

  newInstance.addResourceBundle("en", APP_SHELL_NAMESPACE, en);
  newInstance.addResourceBundle("pt", APP_SHELL_NAMESPACE, pt);

  return newInstance;
};
