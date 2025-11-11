import { useMemo } from "react";
import type { HvAppShellModel } from "@hitachivantara/app-shell-shared";

import filterModel from "../utils/filterModel";
import { useConditionsEvaluator } from "./useConditionsEvaluator";
import { ModelResult } from "./useModelFromConfig";

/**
 * Hook to evaluate conditions and filter configuration
 *
 * @param model - The app shell model with config and preloaded bundles
 * @returns Object with isPending flag and the filtered model
 */
export const useFilteredModel = (model: HvAppShellModel): ModelResult => {
  const { isPending: isModelPending, result } = useConditionsEvaluator(
    model.allConditions,
    model.preloadedBundles,
  );

  const resolvedModel = useMemo(() => {
    if (isModelPending) {
      return undefined;
    }

    return filterModel(model, result!);
  }, [isModelPending, model, result]);

  if (isModelPending) {
    return {
      error: null,
      isPending: true,
      model: undefined,
    };
  }

  return {
    error: null,
    isPending: false,
    model: resolvedModel,
  };
};
