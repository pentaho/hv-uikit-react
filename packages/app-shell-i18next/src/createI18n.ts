import i18next, { type i18n, type InitOptions } from "i18next";

// If changed, must update doclets where it's mentioned literally.
const LAST_RESORT_FALLBACK = "en";

// #region branded instance type

// Compile-time brand — never used at runtime. Ensures useI18n only accepts
// instances created by createI18n (with opinionated defaults and deferred init).
declare const __brand: unique symbol;

/** A branded i18next instance returned by {@link createI18n}. */
export type I18nInstance = i18n & { readonly [__brand]: true };

// #endregion

// #region helpers

/**
 * Returns `true` if the i18next instance has fully initialized.
 *
 * `isInitialized` is absent (`undefined`) until `init()` resolves and sets it
 * to `true`. The cast makes the coercion explicit.
 */
export const isI18nInitialized = (instance: i18n): boolean =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  (instance.isInitialized as boolean | undefined) ?? false;

/**
 * Returns `navigator.languages` as a mutable copy, or an empty array in
 * non-browser environments.
 *
 * The full preference list is used as the default `fallbackLng` — not just the
 * first entry — and `"en"` is appended if not already present so there is
 * always a last-resort English fallback.
 */
const getDefaultFallbackLng = (): string[] => {
  const langs =
    typeof navigator === "undefined" ? [] : [...navigator.languages];
  return langs.includes(LAST_RESORT_FALLBACK)
    ? langs
    : [...langs, LAST_RESORT_FALLBACK];
};

/**
 * Derives `defaultNS` from `ns` when not explicitly provided.
 * Returns the first element for arrays, or the value itself for strings.
 */
const getDefaultDefaultNs = (ns: InitOptions["ns"]): string | undefined => {
  if (Array.isArray(ns)) {
    return ns.length > 0 ? ns[0] : undefined;
  }
  return ns as string | undefined;
};

// #endregion

// #region deferred init

// Stores the init promise so useI18n can await readiness.
const initPromises = new WeakMap<i18n, Promise<void>>();

/**
 * Returns the init promise, or `undefined` if init hasn't been triggered yet.
 * Always resolves (never rejects) — errors from i18next's init are
 * intentionally not propagated because they are unreliable (i18next reports
 * partial load failures even when fallback resources are available and `t()`
 * works).
 */
export const getInitPromise = (
  instance: I18nInstance,
): Promise<void> | undefined => initPromises.get(instance);

/**
 * Triggers `init()` on the instance (idempotent). Throws synchronously if the
 * instance was initialized externally.
 *
 * Called by `useI18n` during render; exported for testing.
 *
 * The returned/stored promise always resolves — i18next load failures degrade
 * gracefully to raw keys or fallback translations. There is no reliable way to
 * distinguish fatal init errors from partial load failures using i18next's
 * public API.
 */
export const ensureInit = (
  instance: I18nInstance,
  options?: InitOptions,
): void => {
  if (initPromises.has(instance)) return;

  // Guard against external initialization.
  if (isI18nInitialized(instance) || instance.isInitializing) {
    throw new Error(
      "i18n instance was already initialized externally. " +
        "Do not call init() on instances created by createI18n() — " +
        "initialization is managed by useI18n().",
    );
  }

  // Build init options: spread caller-provided options, force initAsync,
  // and derive defaultNS from ns (matching createI18n logic) when ns is
  // provided without an explicit defaultNS.
  const initOptions: InitOptions = {
    ...options,
    initAsync: true,
    ...(options?.ns != null &&
      options.defaultNS == null && {
        defaultNS: getDefaultDefaultNs(options.ns),
      }),
  };

  // The init() promise is _always_ resolved with a `t` function here ignored.
  // The rejection never happens, but is handled just to make linting happy.
  const initPromise = instance.init(initOptions).then(
    () => {},
    () => {},
  );

  initPromises.set(instance, initPromise);
};

// #endregion

// #region factory

/**
 * Creates a pre-configured i18next instance with opinionated defaults.
 *
 * Paired with {@link useI18n}, which triggers initialization inside a React
 * component. Call `createI18n` at **module level** and `useI18n` at
 * **component level** — neither is used alone.
 *
 * Options can be split between the two: provide what is statically known to
 * `createI18n`, and defer runtime-dependent options (e.g. `backend.baseUrl`)
 * to `useI18n`. See the "Deferred init options" section below.
 *
 * Register modules (backends, language detectors, etc.) via `.use()` on the
 * returned instance.
 *
 * ### Option defaults
 *
 * | Option                      | Default                                      |
 * |-----------------------------|----------------------------------------------|
 * | `load`                      | `"all"` — every locale variant               |
 * | `fallbackLng`               | `navigator.languages` (with `"en"` appended) |
 * | `defaultNS`                 | first entry in `ns`                          |
 * | `interpolation.escapeValue` | `false` — React already escapes output       |
 *
 * ### Error handling
 *
 * i18next does not provide a reliable public API to distinguish fatal
 * initialization errors from partial load failures (where fallback resources
 * are still usable). Therefore, `useI18n` does **not** propagate init errors.
 *
 * Load failures degrade gracefully:
 * - If a fallback language has resources, `t()` returns the fallback value.
 * - If no resources are available at all, `t()` returns raw keys.
 *
 * ### Controlled language (recommended)
 *
 * Pass `lng` to `useI18n`. Changes trigger `i18n.changeLanguage()` reactively.
 *
 * @example
 * ```tsx
 * const appI18n = createI18n<HttpResourcesBackendOptions>({
 *   backend: { baseUrl: import.meta.resolve("$app/") },
 *   ns: ["common"],
 * }).use(HttpResourcesBackend);
 *
 * const I18nShell = ({ children, locale }: Props) => {
 *   useI18n(appI18n, { lng: locale });
 *
 *   return (
 *     <I18nextProvider i18n={appI18n}>
 *       <Suspense fallback={<HvLoading />}>{children}</Suspense>
 *     </I18nextProvider>
 *   );
 * };
 * ```
 *
 * ### Uncontrolled language (detector)
 *
 * Omit `lng` and register a language detector module.
 *
 * @example
 * ```tsx
 * const appI18n = createI18n<HttpResourcesBackendOptions>({
 *     backend: { baseUrl: import.meta.resolve("$app/") },
 *     ns: ["common"],
 *     detection: { order: ["navigator"] },
 *   })
 *   .use(LanguageDetector)
 *   .use(HttpResourcesBackend);
 *
 * const I18nShell = ({ children }: Props) => {
 *   useI18n(appI18n);
 *   return <I18nextProvider i18n={appI18n}>{children}</I18nextProvider>;
 * };
 * ```
 *
 * ### Deferred init options
 *
 * When some options (e.g. `backend.baseUrl`) are only known at render time,
 * pass them to `useI18n` instead of `createI18n`. Only the **first** call
 * uses the full options — subsequent renders only react to `lng` changes.
 *
 * The option defaults (`load`, `fallbackLng`, `interpolation`) set by
 * `createI18n` are preserved; options passed to `useI18n` are merged on
 * top by i18next's `init()`.
 *
 * @example
 * ```tsx
 * // Module level — register modules, but defer backend config.
 * const appI18n = createI18n<HttpResourcesBackendOptions>({
 *   ns: ["common"],
 * }).use(HttpResourcesBackend);
 *
 * // Component level — provide runtime-only options.
 * const I18nShell = ({ children, locale, baseUrl }: Props) => {
 *   useI18n<HttpResourcesBackendOptions>(appI18n, {
 *     lng: locale,
 *     backend: { baseUrl },
 *   });
 *
 *   return (
 *     <I18nextProvider i18n={appI18n}>
 *       <Suspense fallback={<HvLoading />}>{children}</Suspense>
 *     </I18nextProvider>
 *   );
 * };
 * ```
 *
 * ### No-Suspense usage
 *
 * With `useSuspense: false`, `useI18n`'s `isInitialized` flag can be used to
 * gate rendering until init completes, which includes loading resources for the
 * default namespaces (listed in `ns`). Beyond initialization, namespaces loaded
 * on demand (not listed in `ns`) can briefly show raw keys. To prevent this,
 * consumers must check `useTranslation`'s own `ready` flag:
 *
 * ```tsx
 * const { t, ready } = useTranslation("admin", { useSuspense: false });
 * if (!ready) return <HvLoading />;
 * ```
 *
 * @example
 * ```tsx
 * const appI18n = createI18n<HttpResourcesBackendOptions>({
 *   backend: { baseUrl: import.meta.resolve("$app/") },
 *   ns: ["common"],
 *   react: { useSuspense: false },
 * }).use(HttpResourcesBackend);
 *
 * const I18nShell = ({ children }: Props) => {
 *   const { isInitialized } = useI18n(appI18n, { lng: locale });
 *   if (!isInitialized) return <HvLoading />;
 *   return <I18nextProvider i18n={appI18n}>{children}</I18nextProvider>;
 * };
 * ```
 */
const createI18n = <T extends object = object>(
  options?: InitOptions<T>,
): I18nInstance => {
  const effectiveOptions: InitOptions<T> = {
    load: "all",
    ...options,
    // Prevent auto-init in the createInstance constructor.
    initAsync: true,
    fallbackLng: options?.fallbackLng ?? getDefaultFallbackLng(),
    defaultNS: options?.defaultNS ?? getDefaultDefaultNs(options?.ns),
    interpolation: {
      escapeValue: false,
      ...options?.interpolation,
    },
  };

  return i18next.createInstance(effectiveOptions) as I18nInstance;
};

export default createI18n;
