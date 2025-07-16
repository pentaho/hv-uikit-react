import { useId } from "react";

export const useUniqueId = (deterministicId?: string): string => {
  const id = useId();

  return deterministicId ?? id;
};
