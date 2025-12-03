"use client";

import { useLocalStorage } from "usehooks-ts";

export const useDocsTheme = () => {
  return useLocalStorage("uikit-docs-theme", "pentaho");
};
