import { createContext, useContext, useMemo, useState } from "react";

export type LayoutProviderProps = {
  children: React.ReactNode;
};

export interface LayoutContextValue {
  bannerMaxHeight: number;
  setBannerMaxHeight: (height: number) => void;
  verticalNavigationWidth: number;
  setVerticalNavigationWidth: (height: number) => void;
}

const DEFAULT_VERTICAL_NAVIGATION_WIDTH = 280;

export const LayoutContext = createContext<LayoutContextValue>({
  bannerMaxHeight: 0,
  setBannerMaxHeight: () => {},
  verticalNavigationWidth: DEFAULT_VERTICAL_NAVIGATION_WIDTH,
  setVerticalNavigationWidth: () => {},
});

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [bannerMaxHeight, setBannerMaxHeight] = useState(0);
  const [verticalNavigationWidth, setVerticalNavigationWidth] = useState(
    DEFAULT_VERTICAL_NAVIGATION_WIDTH,
  );

  const value = useMemo(
    () => ({
      bannerMaxHeight,
      setBannerMaxHeight,
      verticalNavigationWidth,
      setVerticalNavigationWidth,
    }),
    [bannerMaxHeight, verticalNavigationWidth],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);

  if (!context) {
    console.error("LayoutContext was used outside of its Provider");
  }

  return context;
};
