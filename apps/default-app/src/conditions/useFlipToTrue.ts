import { useEffect, useState } from "react";
import type { UseConditionResult } from "@hitachivantara/app-shell-shared";

const FLIP_DURATION = 10000;

/**
 * A condition hook that starts with a false result and automatically
 * flips to true after 10 seconds. Useful for demonstrating dynamic
 * conditions or delayed UI reveals.
 *
 * @returns UseConditionResult with isPending: false and result that
 *          transitions from false to true after 10 seconds
 */
const useFlipToTrue = (): UseConditionResult => {
  const [result, setResult] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setResult(true);
    }, FLIP_DURATION);

    return () => clearTimeout(timeout);
  }, []);

  return {
    isPending: false,
    error: null,
    result,
  };
};

export default useFlipToTrue;
