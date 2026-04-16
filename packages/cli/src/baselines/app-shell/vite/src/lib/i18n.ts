import { useMemo } from "react";
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

export const useI18nInstance = () => {
  return useMemo(() => {
    const moduleId = "@hv-apps/uikit-app";
    return initAppI18n(import.meta.resolve?.(`${moduleId}/`) || "");
  }, []);
};
