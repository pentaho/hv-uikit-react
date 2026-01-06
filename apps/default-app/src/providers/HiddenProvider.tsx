import { PropsWithChildren, useMemo } from "react";

import { HiddenContext } from "./shared/hiddenContext";

interface HiddenProviderProps extends PropsWithChildren {}

const HiddenProvider = ({ children }: HiddenProviderProps) => {
  const value = useMemo(
    () => ({
      message: "ERROR: This message should NOT be visible!",
    }),
    [],
  );

  console.error("HiddenProvider mounted - THIS SHOULD NOT HAPPEN!");

  return (
    <HiddenContext.Provider value={value}>{children}</HiddenContext.Provider>
  );
};

export default HiddenProvider;
