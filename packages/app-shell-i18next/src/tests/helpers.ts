import type { InitOptions } from "i18next";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import createI18n, {
  ensureInit,
  getInitPromise,
  type I18nInstance,
} from "../createI18n";
import {
  HttpResourcesBackend,
  type HttpResourcesBackendOptions,
} from "../HttpResourcesBackend";

// #region constants

export const BASE_URL = "/test-app/";
export const BACKEND: HttpResourcesBackendOptions = { baseUrl: BASE_URL };

export const SUPPORTED_LOCALES_URL = `${BASE_URL}locales/supported-locales.json`;
export const BUNDLE_URL = `${BASE_URL}locales/:lng/:ns.json`;

// #endregion

// #region msw server

export const server = setupServer(
  http.get(SUPPORTED_LOCALES_URL, () => HttpResponse.json(["en", "fr", "pt"])),
  http.get(BUNDLE_URL, () => HttpResponse.json({})),
);

// #endregion

// #region instance helpers

/** Creates a fresh i18n instance with the test backend registered. */
export const createInstance = (
  overrides?: InitOptions<HttpResourcesBackendOptions>,
): I18nInstance =>
  createI18n<HttpResourcesBackendOptions>({
    lng: "en",
    backend: BACKEND,
    ns: ["common"],
    ...overrides,
  }).use(HttpResourcesBackend);

/**
 * Creates a bare i18n instance with only the test backend `.use()`d.
 * No default lng, backend config, or ns — useful for testing deferred init
 * options via `ensureInit` / `useI18n`.
 */
export const createBareInstance = (
  overrides?: InitOptions<HttpResourcesBackendOptions>,
): I18nInstance =>
  createI18n<HttpResourcesBackendOptions>(overrides).use(HttpResourcesBackend);

/**
 * Triggers init (if not already called) and waits for the init promise.
 * Always resolves (the promise never rejects).
 */
export const initAndWait = async (
  instance: I18nInstance,
  options?: InitOptions,
): Promise<void> => {
  ensureInit(instance, options);
  await getInitPromise(instance);
};

/** Creates a fresh i18n instance and waits for init to settle. */
export const createAndWait = async (
  overrides?: InitOptions<HttpResourcesBackendOptions>,
): Promise<I18nInstance> => {
  const instance = createInstance(overrides);
  await initAndWait(instance);
  return instance;
};

// #endregion
