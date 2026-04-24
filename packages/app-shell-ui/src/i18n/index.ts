import LanguageDetector from "i18next-browser-languagedetector";
import {
  createI18n,
  type I18nInstance,
} from "@hitachivantara/app-shell-i18next";

// @ts-ignore
import en from "../locales/en/appShell.json";
import {
  APP_SHELL_NAMESPACE,
  CONFIG_TRANSLATIONS_NAMESPACE,
} from "./constants";

export {
  APP_SHELL_NAMESPACE,
  CONFIG_TRANSLATIONS_NAMESPACE,
} from "./constants";
export { default as useI18nInit } from "./useI18nInit";

/**
 * Creates the i18next instance and registers the language detector, but does
 * NOT register the HTTP backend or call init().
 *
 * The HTTP backend is conditionally registered by `useI18nInit` only when
 * `translationsBaseUrl` is not `false` — this avoids the backend's `init()`
 * being called without a `baseUrl` when HTTP loading is disabled.
 *
 * The instance must be created at module level so the same reference is
 * provided to `I18nextProvider` across renders.
 */
export const createI18NextInstance = (): I18nInstance => {
  const instance = createI18n({
    ns: [APP_SHELL_NAMESPACE, CONFIG_TRANSLATIONS_NAMESPACE],
    fallbackLng: "en",
    detection: { order: ["navigator"] },
    partialBundledLanguages: true,
    resources: {
      en: { [APP_SHELL_NAMESPACE]: en },
    },
  });

  instance.use(LanguageDetector);

  return instance as I18nInstance;
};
