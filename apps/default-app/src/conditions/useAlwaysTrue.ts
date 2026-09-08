import type { UseConditionResult } from "@pentaho/app-shell-shared";

const useAlwaysTrue = (): UseConditionResult => {
  return {
    isPending: false,
    error: null,
    result: true,
  };
};

export default useAlwaysTrue;
