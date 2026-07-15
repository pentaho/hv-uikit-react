import { useMemo, useRef } from "react";

/** `useMemo` that keeps the previous value if the new one is `undefined` */
export function useMemoFallback<T>(
  factory: () => T | undefined,
  deps: React.DependencyList,
): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  return useMemo(() => {
    const next = factory();
    if (next !== undefined) ref.current = next;
    return ref.current;
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, deps);
}
