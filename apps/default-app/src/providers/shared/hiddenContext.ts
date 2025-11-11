import { createContext } from "react";

type HiddenContextValue = {
  message: string;
};

export const HiddenContext = createContext<HiddenContextValue>({
  message:
    "Hidden Provider default message! Should not change as provider should not be loaded, ever!",
});
