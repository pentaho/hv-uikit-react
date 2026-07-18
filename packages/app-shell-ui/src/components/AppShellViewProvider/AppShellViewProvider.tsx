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
import { useMemo } from "react";
import {
  HvAppShellViewContext,
  type HvAppShellViewContextValue,
} from "@hitachivantara/app-shell-shared";

export type AppShellViewProviderProps = {
  children: React.ReactNode;
  id: string;
};

const AppShellViewProvider = ({ children, id }: AppShellViewProviderProps) => {
  const value: HvAppShellViewContextValue = useMemo(() => ({ id }), [id]);

  return (
    <HvAppShellViewContext.Provider value={value}>
      {children}
    </HvAppShellViewContext.Provider>
  );
};

export default AppShellViewProvider;
