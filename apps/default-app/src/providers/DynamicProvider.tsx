import { useMemo } from "react";

import { DynamicContext } from "./shared/dynamicContext";

const DynamicProvider = ({ children }: React.PropsWithChildren) => {
  const value = useMemo(
    () => ({
      message: "Dynamic Provider is active and visible after 10s delay",
    }),
    [],
  );

  return (
    <DynamicContext.Provider value={value}>{children}</DynamicContext.Provider>
  );
};

export default DynamicProvider;
