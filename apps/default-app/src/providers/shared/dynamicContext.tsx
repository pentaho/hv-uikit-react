import { createContext } from "react";

type DynamicContextValue = {
  message: string;
};

export const DynamicContext = createContext<DynamicContextValue | undefined>(
  undefined,
);
