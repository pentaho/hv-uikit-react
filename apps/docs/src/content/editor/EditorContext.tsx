"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import {
  createTheme,
  DeepPartial,
  HvTheme,
} from "@hitachivantara/uikit-react-core";
import { HvThemeStructure, mergeTheme } from "@hitachivantara/uikit-styles";

export type ColorMode = "dawn" | "wicked";

interface EditorContextValue {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;

  customTheme: HvTheme | HvThemeStructure;
  updateCustomTheme: (
    changes: DeepPartial<HvTheme | HvThemeStructure>,
    options?: Record<string, any>,
  ) => void;
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  defaultColorMode?: ColorMode;
}

const initialTheme = createTheme({ name: "customTheme", base: "pentahoPlus" });

export const EditorProvider = ({
  children,
  defaultColorMode = "dawn",
}: EditorProviderProps) => {
  const [colorMode, setColorMode] = useState<ColorMode>(defaultColorMode);
  const [customTheme, setCustomTheme] = useState(initialTheme);

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === "dawn" ? "wicked" : "dawn"));
  };

  const updateCustomTheme = useCallback(
    (changes: DeepPartial<HvTheme | HvThemeStructure>) => {
      setCustomTheme((prev) => {
        if (Object.keys(changes).length === 0) return initialTheme;
        const newTheme = mergeTheme(prev, changes);
        return newTheme;
      });
    },
    [],
  );

  const value: EditorContextValue = {
    colorMode,
    setColorMode,
    toggleColorMode,
    customTheme,
    updateCustomTheme,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditorContext = (): EditorContextValue => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within a EditorProvider");
  }
  return context;
};
