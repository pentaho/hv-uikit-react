/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router";

import { navigationData } from "../navigation";

export interface NavigationData {
  id: string;
  label: string;
  path?: string;
  data?: NavigationData[];
}

export interface NavigationProviderProps {
  children: React.ReactNode;
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
    if (item.path === pathname) return item;
    if (item.data) {
      const found = item.data.find((child) => child.path === pathname);
      if (found) return found;
    }

    return acc;
  }, navigation[0]);
};

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const { pathname } = useLocation();

  const value = useMemo(
    () => ({
      navigation: navigationData,
      activePath: getActivePath(pathname, navigationData),
    }),
    [pathname],
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
