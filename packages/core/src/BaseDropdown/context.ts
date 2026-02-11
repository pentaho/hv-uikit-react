import { createContext, useContext } from "react";
import type { Instance } from "@popperjs/core";

interface BaseDropdownValue {
  popper?: Instance | null;
}

export const BaseDropdownContext = createContext<BaseDropdownValue>({});

BaseDropdownContext.displayName = "BaseDropdownContext";

export const useBaseDropdownContext = () => useContext(BaseDropdownContext);
