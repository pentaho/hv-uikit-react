import { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

export interface NavigationData {
  id: string;
  label: string;
  path?: string;
  data?: NavigationData[];
}

export interface NavigationProviderProps {
  children: React.ReactNode;
  navigation: NavigationData[];
}

export interface NavigationContextValue {
  navigation: NavigationData[];
  activePath: NavigationData | undefined;
}

export const NavigationContext = createContext<NavigationContextValue>({
  navigation: [],
  activePath: undefined,
});

const getActivePath = (pathname: string, navigation: NavigationData[]) => {
  return navigation.reduce((acc, item) => {
    if (item.path && pathname.includes(item.path)) return item;
    if (item.data) {
      const found = item.data.find((child) => child.path === pathname);
      if (found) return found;
    }

    return acc;
  }, navigation[0]);
};

export const NavigationProvider = ({
  children,
  navigation,
}: NavigationProviderProps) => {
  const { pathname } = useLocation();

  const value = useMemo(
    () => ({
      navigation,
      activePath: getActivePath(pathname, navigation),
    }),
    [navigation, pathname],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationContext must be used within a NavigationProvider",
    );
  }
  return context;
}
