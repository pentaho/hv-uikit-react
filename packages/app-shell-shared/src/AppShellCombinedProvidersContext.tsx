import {
  createContext,
  useContext,
  type ComponentType,
  type PropsWithChildren,
} from "react";

import type { HvAppShellProvidersModel } from "./types/Model";

export type HvAppShellProvidersComponent = Omit<
  HvAppShellProvidersModel,
  "bundle"
> & {
  component: ComponentType<PropsWithChildren>;
};

interface HvAppShellCombinedProvidersContextValue {
  providers?: HvAppShellProvidersComponent[];
}

export const HvAppShellCombinedProvidersContext = createContext<
  HvAppShellCombinedProvidersContextValue | undefined
>(undefined);

export const useHvAppShellCombinedProviders = () => {
  return useContext(HvAppShellCombinedProvidersContext)!;
};
