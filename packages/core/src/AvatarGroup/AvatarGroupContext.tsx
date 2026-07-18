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
import type { HvSize } from "@hitachivantara/uikit-styles";

type HvAvatarGroupContextProviderProps = {
  size: HvSize;
  children: React.ReactNode;
};

type HvAvatarGroupContextProp = {
  size: HvSize;
};

export const HvAvatarGroupContext =
  createContext<HvAvatarGroupContextProp | null>(null);

export const HvAvatarGroupProvider = ({
  size,
  children,
}: HvAvatarGroupContextProviderProps) => {
  const value = useMemo(() => ({ size }), [size]);

  return (
    <HvAvatarGroupContext.Provider value={value}>
      {children}
    </HvAvatarGroupContext.Provider>
  );
};

export const useAvatarGroupContext = () => {
  const context = useContext(HvAvatarGroupContext);
  return context;
};
