import { useMemo } from "react";
import {
  HvAppShellViewContext,
  type HvAppShellViewContextValue,
} from "@pentaho/app-shell-shared";

export type AppShellViewProviderProps = {
  children: React.ReactNode;
  id: string;
};

const AppShellViewProvider = ({ children, id }: AppShellViewProviderProps) => {
  const value: HvAppShellViewContextValue = useMemo(() => ({ id }), [id]);

  return (
    <HvAppShellViewContext.Provider value={value}>
      {children}
    </HvAppShellViewContext.Provider>
  );
};

export default AppShellViewProvider;
