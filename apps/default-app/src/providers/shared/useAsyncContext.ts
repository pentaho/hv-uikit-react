import { useContext } from "react";

import { AsyncContext } from "./asyncContext";

export const useAsyncContext = () => {
  const ctx = useContext(AsyncContext);
  if (!ctx) {
    return null;
  }
  return ctx;
};
