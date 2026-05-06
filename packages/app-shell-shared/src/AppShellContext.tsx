import { createContext, useContext } from "react";

import type { HvAppShellConfig } from "./types/Config";

export type HvAppShellContextValue = HvAppShellConfig;
export const HvAppShellContext = createContext<
  HvAppShellContextValue | undefined
>(undefined);

export const useHvAppShellConfig = (): HvAppShellContextValue => {
  return useContext(HvAppShellContext)!;
};
