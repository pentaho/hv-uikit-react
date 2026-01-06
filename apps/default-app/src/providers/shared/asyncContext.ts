import { createContext } from "react";

type AsyncContextValue = {
  message: string;
};

export const AsyncContext = createContext<AsyncContextValue>({
  message: "Async Provider default message!",
});
