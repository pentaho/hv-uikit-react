import { useEffect, useMemo, useState } from "react";
import type { InitOptions } from "i18next";

import {
  ensureInit,
  getInitPromise,
  isI18nInitialized,
  type I18nInstance,
} from "./createI18n";

export interface UseI18nResult {
  /**
   * `true` once `init()` has completed, `false` while still in progress.
   *
   * This does **not** indicate whether all resources loaded successfully —
   * i18next always marks itself as initialized regardless of load outcomes.
   * Partial failures degrade gracefully to fallback translations or raw keys.
   */
  isInitialized: boolean;
}

/**
 * Initializes a {@link createI18n} instance and returns reactive readiness
 * state (`isInitialized`).
 *
 * Triggers `init()` on the first render that sees a given instance. Any
 * i18next `InitOptions` (e.g. `backend`, `ns`) passed here are applied only
 * on that first initialization — subsequent renders only react to `lng`
 * changes via `changeLanguage()`.
 *
 * This is useful when some options are only known at render time (e.g. a
 * `backend.baseUrl` derived from the runtime environment).
 *
 * If `ns` is provided without `defaultNS`, `defaultNS` is derived from
 * `ns[0]` — matching the same logic applied by {@link createI18n}.
 *
 * See {@link createI18n} for full documentation and usage examples.
 */
const useI18n = <T extends object = object>(
  i18n: I18nInstance,
  options?: InitOptions<T>,
): UseI18nResult => {
  const lng = options?.lng;

  // Trigger init synchronously during render so that child useTranslation
  // consumers see a configured instance before they mount. ensureInit is
  // idempotent (bails out via initTriggered) — safe on re-renders and in
  // Strict Mode's double invocation.
  ensureInit(i18n, options);

  const [isInitialized, setIsInitialized] = useState(() =>
    isI18nInitialized(i18n),
  );

  useEffect(() => {
    // Already settled — sync catch-up (covers shared instances and fast init).
    if (isI18nInitialized(i18n)) {
      setIsInitialized(true);
      return;
    }

    let cancelled = false;

    getInitPromise(i18n)?.then(() => {
      if (!cancelled) {
        setIsInitialized(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [i18n]);

  useEffect(() => {
    if (lng != null && lng !== i18n.language) {
      i18n.changeLanguage(lng).catch(() => {
        // Avoid unhandled promise warning.
      });
    }
  }, [lng, i18n]);

  return useMemo(() => ({ isInitialized }), [isInitialized]);
};

export default useI18n;
