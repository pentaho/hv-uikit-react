import { useContext } from "react";

import { DynamicContext } from "./dynamicContext";

export const useDynamicContext = () => {
  const ctx = useContext(DynamicContext);
  if (!ctx) {
    return null;
  }
  return ctx;
};
