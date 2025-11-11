import { useEffect, useState } from "react";
import type { UseConditionResult } from "@hitachivantara/app-shell-shared";

/**
 * Makes usage of the isPending to simulate a backend call while enforcing
 * the need for the consumers to wait on this to resolve (true).
 * Wait time is only 0.5 seconds
 */
const useAsyncTrue = (): UseConditionResult => {
  const [isPending, setIsPending] = useState(true);
  const [result, setResult] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResult(true);
      setIsPending(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isPending) {
    return {
      isPending: true,
      error: null,
      result: undefined,
    };
  }

  return {
    isPending: false,
    error: null,
    result: result,
  };
};

export default useAsyncTrue;
