import { useCallback, useMemo } from "react";
import {
  useAsync,
  type AsyncResult,
  type HvAppShellConfig,
  type HvAppShellModel,
} from "@hitachivantara/app-shell-shared";

import { importAllBundles } from "../utils/lazyImport";
import processConfig from "../utils/processConfig";

export type ModelResult = AsyncResult<
  HvAppShellModel | undefined,
  Error,
  "model"
>;

/**
 * Build an App Shell model from a configuration and preload referenced bundles.
 *
 * @param config - The App Shell configuration object.
 * @returns An object containing the loading state, any error encountered, and
 *          the constructed `HvAppShellModel` with preloaded bundles.
 *
 * @remarks
 * - Synchronously processes the provided `config` (adds internal keys and
 *   global indices to condition definitions) to produce a base `HvAppShellModel`.
 * - Extracts bundle paths from all conditions and providers, concatenates them
 *   and preloads those bundles using `importAllBundles`.
 * - Returns an AsyncResult-shaped value so callers can read `isPending`,
 *   `error` and the `model` property (the data property is named `model`).
 */
export const useModelFromConfig = (
  config: HvAppShellConfig | undefined,
): ModelResult => {
  const initialModel = useMemo(
    () => (config ? processConfig(config) : undefined),
    [config],
  );

  const systemProvidersBundles = useMemo(
    () => (initialModel?.systemProviders ?? []).map((p) => p.bundle),
    [initialModel],
  );

  const conditionBundles = useMemo(
    () => (initialModel?.allConditions ?? []).map((c) => c.bundle),
    [initialModel],
  );

  const providerBundles = useMemo(
    () => (initialModel?.providers ?? []).map((p) => p.bundle),
    [initialModel],
  );

  const bundles = useMemo(
    () => [...systemProvidersBundles, ...conditionBundles, ...providerBundles],
    [systemProvidersBundles, conditionBundles, providerBundles],
  );

  const promiseFactory = useCallback(async () => {
    if (!initialModel) {
      return;
    }

    if (bundles.length === 0) {
      return {
        ...initialModel,
      };
    }

    const preloadedBundles = await importAllBundles(bundles);
    return { ...initialModel, preloadedBundles };
  }, [initialModel, bundles]);

  return useAsync(promiseFactory, { dataProp: "model" });
};
