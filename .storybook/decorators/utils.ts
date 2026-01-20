import { useEffect, useRef } from "react";
import {
  HvThemeColorMode,
  HvThemeStructure,
} from "@hitachivantara/uikit-styles";

export interface Theme {
  label: string;
  mode: string;
}

export const getInitialMode = (): HvThemeColorMode => {
  const prefersDark = window?.matchMedia?.(
    "(prefers-color-scheme: dark)",
  )?.matches;

  return prefersDark ? "dark" : "light";
};

/** Return a `ref` that adds/removes `dark` class variant depending on `mode` */
export const useDarkClass = <T extends HTMLElement = HTMLDivElement>(
  mode: string,
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (mode === "dark") {
      ref.current?.classList.add("dark");
    } else {
      ref.current?.classList.remove("dark");
    }
  }, [mode]);

  return ref;
};

/** Returns an array with the available themes */
export const getThemesList = (themes: Record<string, HvThemeStructure>) => {
  return Object.keys(themes).reduce<Theme[]>((acc, themeName) => {
    const colorModes: HvThemeColorMode[] = ["light", "dark"];
    colorModes.forEach((colorMode) => {
      acc.push({
        label: `${themeName} ${colorMode}`,
        mode: colorMode,
      });
    });
    return acc;
  }, []);
};
