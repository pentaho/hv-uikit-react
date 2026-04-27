import type {
  BackendModule,
  CallbackError,
  ReadCallback,
  ResourceKey,
  Services,
} from "i18next";

/**
 * Custom request headers forwarded to every `fetch` call made by
 * {@link HttpResourcesBackend}.
 */
export type FetchOptions = { headers?: HeadersInit };

/**
 * Options for {@link HttpResourcesBackend}.
 *
 * Passed via the `backend` key of i18next's `init()` options:
 * ```ts
 * createI18n<HttpResourcesBackendOptions>({ backend: { baseUrl: "..." } });
 * ```
 */
export interface HttpResourcesBackendOptions {
  /** Base URL where locale assets are served. */
  baseUrl: string;
  /**
   * Headers forwarded to every `fetch()` call (manifest + bundles).
   * Useful for auth tokens or CSRF headers required by the server.
   */
  fetchOptions?: FetchOptions;
}

// #region async-to-callback bridge

/**
 * Invokes `fn` and routes the resolved value or rejection to `callback`,
 * bridging async/await to i18next's legacy callback-based `BackendModule.read()`
 * contract.
 */
const callAsync = (
  fn: () => Promise<ResourceKey | false>,
  callback: ReadCallback,
): void => {
  fn()
    .then((data) => callback(null, data))
    .catch((err: unknown) => callback(err as CallbackError, false));
};

// #endregion

// #region URL helpers

const normalizeBaseUrl = (baseUrl: string): string =>
  baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

const getSupportedLocalesUrl = (baseUrl: string) =>
  `${baseUrl}locales/supported-locales.json`;

const getBundleUrl = (baseUrl: string, lng: string, ns: string) =>
  `${baseUrl}locales/${lng}/${ns}.json`;

// #endregion

// #region fetch helpers

/**
 * Type guard that validates the manifest is a non-empty array of strings.
 * An empty array is rejected: a manifest with no entries is almost certainly
 * a misconfiguration and would block all language loads.
 */
const isSupportedLocales = (data: unknown): data is string[] =>
  Array.isArray(data) &&
  data.length > 0 &&
  data.every((item) => typeof item === "string");

/**
 * Fetches the supported-locales manifest from `{baseUrl}locales/supported-locales.json`.
 *
 * Returns `null` — meaning "allow all languages" — on any failure: 404, non-OK
 * status, malformed JSON, or network error. The manifest is optional by design;
 * a missing or broken manifest should never prevent translation from working.
 */
const fetchSupportedLngs = async (
  baseUrl: string,
  fetchOptions?: FetchOptions,
): Promise<string[] | null> => {
  const supportedLocalesUrl = getSupportedLocalesUrl(baseUrl);
  try {
    const resp = await fetch(supportedLocalesUrl, fetchOptions);
    if (!resp.ok) {
      if (resp.status !== 404) {
        console.warn(
          `Could not fetch supported languages from ${supportedLocalesUrl} (status: ${resp.status}).`,
        );
      }
      return null;
    }

    const data: unknown = await resp.json();
    if (!isSupportedLocales(data)) {
      console.warn(
        `Invalid supported languages format in file ${supportedLocalesUrl} (content: ${JSON.stringify(data)})`,
      );
      return null;
    }

    return data;
  } catch (networkError) {
    const aborted =
      networkError instanceof DOMException &&
      networkError.name === "AbortError";
    if (!aborted) {
      console.warn(
        `Could not fetch supported languages from ${supportedLocalesUrl} due to a network error: ${networkError}.`,
      );
    }

    return null;
  }
};

/**
 * Fetches a single `{lng}/{ns}.json` translation bundle.
 *
 * Throws on non-OK responses so the error reaches i18next's `ReadCallback`
 * error path, which marks the bundle as failed and may trigger retries.
 */
const fetchBundle = async (
  baseUrl: string,
  lng: string,
  ns: string,
  fetchOptions?: FetchOptions,
): Promise<ResourceKey> => {
  const bundleUrl = getBundleUrl(baseUrl, lng, ns);
  const res = await fetch(bundleUrl, fetchOptions);
  if (!res.ok) {
    throw new Error(
      `Failed to load translation bundle ${bundleUrl}: HTTP ${res.status}`,
    );
  }

  return await res.json();
};

// #endregion

// #region backend plugin

/**
 * i18next backend plugin that loads JSON translation bundles via native `fetch`.
 *
 * ### Locale assets layout
 *
 * ```
 * locales/
 * ├── supported-locales.json   ← optional manifest of BCP 47 codes
 * ├── en/
 * │   ├── common.json          ← one file per namespace
 * │   └── dashboard.json
 * └── pt/
 *     ├── common.json
 *     └── dashboard.json
 * ```
 *
 * ### JSON formats
 *
 * - **`supported-locales.json`** — a JSON array of BCP 47 language tags
 *   (RFC 5646), e.g. `["en", "pt-BR", "fr"]`.
 *
 * - **Namespace bundles** (e.g. `common.json`) — standard i18next key/value
 *   maps, e.g. `{ "welcome": "Welcome", "menu.file": "File" }`.
 *   See: https://www.i18next.com/misc/json-format#i18next-json-v4
 *
 * ### Manifest
 *
 * `{baseUrl}locales/supported-locales.json` is fetched once during
 * {@link init} and never refreshed until the page reloads. Languages absent
 * from the manifest cause {@link read} to return `false`, which tells i18next
 * "not available" and lets it follow the `fallbackLng` chain — without any
 * network request.
 *
 * If the manifest is missing, malformed, or the fetch fails, all languages
 * are allowed.
 *
 * ### Extensibility
 *
 * This class is the single point of contact between i18next and the
 * translation infrastructure. Both supported-language discovery and bundle
 * retrieval live here so that the entire backend can be swapped out — for
 * example, to consume bundles from a Translation Management System (e.g.
 * locize) — without changes to the consumer code.
 */
export class HttpResourcesBackend implements BackendModule<HttpResourcesBackendOptions> {
  static readonly type = "backend" as const;
  readonly type = "backend" as const;

  private baseUrl = "";
  private fetchOptions: FetchOptions = {};

  /**
   * Supported language codes from the manifest, or `null` when the manifest
   * is unavailable. When `null`, all languages are allowed.
   */
  private supportedLngs: string[] | null = null;

  /**
   * Resolves once the manifest fetch settles. `read()` awaits this before
   * checking `supportedLngs` so that concurrent calls during init don't
   * bypass the filter.
   */
  private supportedLngsReady: Promise<void> = Promise.resolve();

  init(_services: Services, options: HttpResourcesBackendOptions): void {
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.fetchOptions = options.fetchOptions ?? {};

    this.supportedLngsReady = fetchSupportedLngs(
      this.baseUrl,
      this.fetchOptions,
    ).then((langs) => {
      this.supportedLngs = langs;
    });
  }

  read(lng: string, ns: string, callback: ReadCallback): void {
    callAsync(() => this.loadBundle(lng, ns), callback);
  }

  private async loadBundle(
    lng: string,
    ns: string,
  ): Promise<ResourceKey | false> {
    await this.supportedLngsReady;

    if (this.supportedLngs != null && !this.supportedLngs.includes(lng)) {
      return false;
    }

    return fetchBundle(this.baseUrl, lng, ns, this.fetchOptions);
  }
}

// #endregion
