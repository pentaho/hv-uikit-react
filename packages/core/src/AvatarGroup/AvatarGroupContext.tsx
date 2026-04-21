import { createContext, useContext, useMemo } from "react";
import type { HvSize } from "@hitachivantara/uikit-styles";

type HvAvatarGroupContextProviderProps = {
  size: HvSize;
  children: React.ReactNode;
};

type HvAvatarGroupContextProp = {
  size: HvSize;
};

export const HvAvatarGroupContext =
  createContext<HvAvatarGroupContextProp | null>(null);

export const HvAvatarGroupProvider = ({
  size,
  children,
}: HvAvatarGroupContextProviderProps) => {
  const value = useMemo(() => ({ size }), [size]);

  return (
    <HvAvatarGroupContext.Provider value={value}>
      {children}
    </HvAvatarGroupContext.Provider>
  );
};

export const useAvatarGroupContext = () => {
  const context = useContext(HvAvatarGroupContext);
  return context;
};
