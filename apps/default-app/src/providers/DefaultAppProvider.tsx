import { createContext, PropsWithChildren, useMemo, useState } from "react";
import { useHvAppShellConfig } from "@hitachivantara/app-shell-shared";

type DefaultAppContextValue = {
  text: string;
  setText: (text: string) => void;
};

export const DefaultAppContext = createContext<DefaultAppContextValue>({
  text: "Default default-app context value",
  setText: () => {
    // Empty function
  },
});

interface DefaultAppProviderProps extends PropsWithChildren {}

let clickNumber = 0;

const DefaultAppProvider = ({ children }: DefaultAppProviderProps) => {
  const [text, setText] = useState<string>("Initial default-app context value");
  const { menu } = useHvAppShellConfig();

  const value = useMemo(
    () => ({
      text,
      setText: (value: string) => {
        clickNumber += 1;
        const prefixedText = `[${clickNumber}] ${value}`;
        setText(prefixedText);

        console.info("From App Shell context:", JSON.stringify(menu));
      },
    }),
    [menu, text],
  );
  return (
    <DefaultAppContext.Provider value={value}>
      {children}
    </DefaultAppContext.Provider>
  );
};

export default DefaultAppProvider;
