import { useMemo } from "react";

import type { DeepPartial } from "../types/generic";
import { deepMerge } from "../utils/deepMerge";

export function useLabels<T>(defaultLabels: T, labels?: DeepPartial<T>): T {
  return useMemo(() => {
    return deepMerge(defaultLabels, labels);
  }, [defaultLabels, labels]);
}
