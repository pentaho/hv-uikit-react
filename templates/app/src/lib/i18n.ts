import { initReactI18next } from "react-i18next";
import { createInstance, type i18n } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend, { type HttpBackendOptions } from "i18next-http-backend";

const initAppI18n = (baseUrl: string): i18n => {
  const i18nInstance = createInstance();

  const loadPath = `${baseUrl}locales/{{lng}}/{{ns}}.json`;

  // learn more: https://react.i18next.com/latest/using-with-hooks#configure-i18next
  i18nInstance
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
      fallbackLng: "en",
      // each page loads its own namespace (useTranslation("home")): none up front
      ns: [],
      // enable explicit declaration to avoid fetching non-existing `lng`s
      // supportedLngs: ["en"],
      backend: {
        loadPath,
      },
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      load: "languageOnly",
    });

  return i18nInstance;
};

/** The app's base URL in the App Shell, which serves its translations; none outside it (in tests). */
const resolveModule = (specifier: string) => {
  try {
    return import.meta.resolve?.(specifier) ?? "";
  } catch {
    return "";
  }
};

/**
 * The app's translations. Created once: a page suspends while they load, and a suspended render keeps no state, so
 * an instance made while rendering would start over on every retry.
 */
const moduleId = "@hv-apps/uikit-app";
const i18nInstance = initAppI18n(resolveModule(`${moduleId}/`));

export const useI18nInstance = () => i18nInstance;
