import { useContext } from "react";

import { HiddenContext } from "./hiddenContext";

export const useHiddenContext = () => {
  const ctx = useContext(HiddenContext);
  if (!ctx) {
    return null;
  }
  return ctx;
};
