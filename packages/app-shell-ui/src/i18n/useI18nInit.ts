import { useMemo, useRef } from "react";
import type { InitOptions } from "i18next";
import {
  HttpResourcesBackend,
  useI18n,
  type HttpResourcesBackendOptions,
  type I18nInstance,
  type UseI18nResult,
} from "@hitachivantara/app-shell-i18next";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  type HvAppShellConfig,
} from "@hitachivantara/app-shell-shared";

// @ts-ignore
import en from "../locales/en/appShell.json";
import { APP_SHELL_NAMESPACE } from "./constants";

// #region URL helpers

/**
 * Resolves a possibly-relative URL to an absolute one.
 * Uses `document.baseURI` as the fallback so that paths like `/foo/bar/`
 * are turned into full URLs before being fed to the `URL` constructor as
 * a base.
 */
const toAbsoluteUrl = (url: string): string =>
  new URL(url, document.baseURI).href;

/** Resolves the translations base URL to an absolute URL. */
const resolveTranslationsBaseUrl = (
  translationsBaseUrl: string | undefined,
  configUrl?: string,
  baseUrl?: string,
): string => {
  const raw = translationsBaseUrl ?? "./";

  const base = configUrl
    ? new URL(".", toAbsoluteUrl(configUrl)).href
    : toAbsoluteUrl(baseUrl ?? "./");

  const resolved = new URL(raw, base).href;
  return resolved.endsWith("/") ? resolved : `${resolved}/`;
};

// #endregion

// #region resource building

/**
 * Builds the `resources` object for i18next init.
 * Always includes `en/appShell` (bundled) and `en/app` (empty placeholder).
 * Merges any inline translations from the config per language.
 */
const buildResources = (
  translations: HvAppShellConfig["translations"] | undefined,
): InitOptions["resources"] => {
  const resources: InitOptions["resources"] = {
    en: {
      [APP_SHELL_NAMESPACE]: en,
      [CONFIG_TRANSLATIONS_NAMESPACE]: {},
    },
  };

  if (translations) {
    Object.entries(translations).forEach(([lng, bundle]) => {
      resources[lng] = {
        ...resources[lng],
        [CONFIG_TRANSLATIONS_NAMESPACE]: bundle,
      };
    });
  }

  return resources;
};

// #endregion

/**
 * Initializes the App Shell's i18next instance with the resolved config.
 *
 * - Pre-loads `appShell` (English) and config `translations` into `resources`
 *   so they're available before the backend fetches remote bundles.
 * - Computes `translationsBaseUrl` internally from the config.
 * - Right after the first init call, triggers `reloadResources` for both
 *   `appShell` and `app` namespaces (English) so server-side translations
 *   override the pre-bundled defaults.
 *
 * Returns `{ isInitialized }` — same shape as `useI18n`.
 */
const useI18nInit = (
  i18n: I18nInstance,
  config?: Partial<HvAppShellConfig>,
  configUrl?: string,
): UseI18nResult => {
  const reloadTriggered = useRef(false);

  // Resolve backend options
  const translationsBaseUrl = config?.translationsBaseUrl;
  const backendDisabled = translationsBaseUrl === false;

  const initOptions = useMemo<InitOptions<HttpResourcesBackendOptions>>(() => {
    return {
      resources: buildResources(config?.translations),
      partialBundledLanguages: true,
      ...(backendDisabled
        ? {}
        : {
            backend: {
              baseUrl: resolveTranslationsBaseUrl(
                translationsBaseUrl,
                configUrl,
                config?.baseUrl,
              ),
            },
          }),
    };
  }, [
    configUrl,
    config?.baseUrl,
    config?.translations,
    translationsBaseUrl,
    backendDisabled,
  ]);

  // Register the HTTP backend only when needed and not already registered.
  // Lazily registering the backend at this time avoids HttpResourcesBackend.init()
  // being called without a baseUrl when translationsBaseUrl is false.
  if (!backendDisabled && !i18n.modules.backend) {
    i18n.use(HttpResourcesBackend);
  }

  // useI18n triggers ensureInit synchronously on the first call.
  // ensureInit is idempotent — safe on re-renders and Strict Mode.
  const result = useI18n(i18n, initOptions);

  // Fire reloadResources right after the first useI18n call (which triggered init).
  // This runs concurrently with init's own resource loading — i18next queues it until
  // the backend is ready.
  if (!reloadTriggered.current && !backendDisabled) {
    reloadTriggered.current = true;

    // `reloadResources`'s promise is always resolved (never rejected).
    // Handle rejection to make the linter happy.
    i18n
      .reloadResources("en", [
        APP_SHELL_NAMESPACE,
        CONFIG_TRANSLATIONS_NAMESPACE,
      ])
      .catch(() => {});
  }

  return result;
};

export default useI18nInit;
