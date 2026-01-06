import { createContext, useContext } from "react";

import type { HvAppShellModel } from "./types/Model";

export interface HvAppShellModelContextValue extends HvAppShellModel {}

export const HvAppShellModelContext = createContext<
  HvAppShellModelContextValue | undefined
>(undefined);

export const useHvAppShellModel = (): HvAppShellModel => {
  const context = useContext(HvAppShellModelContext);

  if (!context) {
    throw new Error(
      "useHvAppShellModel must be used within HvAppShellModelContext.Provider",
    );
  }

  return context;
};
