import { useRef } from "react";
import type {
  AsyncResult,
  HvAppShellConditionModel,
  PreloadedBundles,
  UseCondition,
  UseConditionResult,
} from "@hitachivantara/app-shell-shared";

function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function areArraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

export type ConditionResultsList = boolean[];

export type ConditionsEvaluatorResult = AsyncResult<
  ConditionResultsList,
  Error,
  "result"
>;

/**
 * Hook to execute all loaded condition hooks and return results
 *
 * @param allConditions - Array of conditions with globalIndex from processed config
 * @param preloadedBundles - Array of all the preloaded bundles
 * @returns Object with isPending flag, error and results map
 */
export const useConditionsEvaluator = (
  allConditions: HvAppShellConditionModel[],
  preloadedBundles: PreloadedBundles,
): ConditionsEvaluatorResult => {
  const previousResultsRef = useRef<ConditionResultsList>([]);

  if (preloadedBundles.size === 0) {
    return {
      isPending: false,
      error: null,
      result: previousResultsRef.current,
    };
  }

  const hookResults: UseConditionResult[] = [];

  for (const { bundle, config } of allConditions) {
    const module = preloadedBundles.get(bundle) as UseCondition | undefined;

    // bundle failed to be imported and thus not present, treat as error
    if (!module) {
      hookResults.push({
        isPending: false,
        error: new Error(`Bundle '${bundle}' not loaded`),
        result: undefined,
      });
      continue;
    }
    try {
      const result = module(config);

      hookResults.push(result);
    } catch (error) {
      hookResults.push({
        isPending: false,
        error: error as Error,
        result: undefined,
      });
    }
  }

  const isAnyPending = hookResults.some((result) => result.isPending);

  const currentResults: boolean[] = [];

  for (let i = 0; i < allConditions.length; i++) {
    const condition = allConditions[i];
    const asyncResult = hookResults[i];

    if (asyncResult.error) {
      console.error(
        `Failed to execute ${condition.bundle} with: ${asyncResult.error}`,
      );
    }

    // Default to false if pending or error
    const boolResult =
      asyncResult.isPending || asyncResult.error ? false : asyncResult.result;

    assert(
      i === condition.globalIndex,
      `Index mismatch: expected ${i} to equal globalIndex ${condition.globalIndex}`,
    );

    currentResults[condition.globalIndex] = boolResult;
  }

  // Check if the results are different from previous
  const previousResults = previousResultsRef.current;
  const hasChanged = !areArraysEqual(previousResults, currentResults);

  // Return stable reference if nothing changed
  const result = hasChanged ? currentResults : previousResults;

  // Update ref if changed
  if (hasChanged) {
    previousResultsRef.current = currentResults;
  }

  if (isAnyPending) {
    return {
      isPending: true,
      error: null,
      result: undefined,
    };
  }

  return {
    error: null,
    result,
    isPending: false,
  };
};
