import { HvThemeColorMode } from "@hitachivantara/uikit-styles";

const STORAGE_KEY = "sb-uikit-mode";

export const setLocalMode = (value: HvThemeColorMode) => {
  localStorage?.setItem(STORAGE_KEY, value);
};

export const getLocalMode = () => {
  return localStorage?.getItem(STORAGE_KEY);
};

export const getInitialMode = (): HvThemeColorMode => {
  const localMode = getLocalMode();

  if (localMode) return localMode as HvThemeColorMode;

  const prefersDark = window?.matchMedia?.(
    "(prefers-color-scheme: dark)",
  )?.matches;

  return prefersDark ? "dark" : "light";
};
