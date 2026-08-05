import type { UseConditionResult } from "@pentaho/app-shell-shared";

const useAlwaysFalse = (): UseConditionResult => {
  return {
    isPending: false,
    error: null,
    result: false,
  };
};

export default useAlwaysFalse;
