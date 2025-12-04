import type { UseConditionResult } from "@hitachivantara/app-shell-shared";

const useAlwaysTrue = (): UseConditionResult => {
  return {
    isPending: false,
    error: null,
    result: true,
  };
};

export default useAlwaysTrue;
