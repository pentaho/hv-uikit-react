import { PropsWithChildren, useMemo } from "react";

import { AsyncContext } from "./shared/asyncContext";

interface AsyncTrueProviderProps extends PropsWithChildren {}

const AsyncProvider = ({ children }: AsyncTrueProviderProps) => {
  const value = useMemo(
    () => ({
      message: "Async Provider is active and visible after 0.5s delay.",
    }),
    [],
  );

  return (
    <AsyncContext.Provider value={value}>{children}</AsyncContext.Provider>
  );
};

export default AsyncProvider;
