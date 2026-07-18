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
import {
  createContext,
  useContext,
  type ComponentType,
  type PropsWithChildren,
} from "react";

import type { HvAppShellProvidersModel } from "./types/Model";

export type HvAppShellProvidersComponent = Omit<
  HvAppShellProvidersModel,
  "bundle"
> & {
  component: ComponentType<PropsWithChildren>;
};

interface HvAppShellCombinedProvidersContextValue {
  providers?: HvAppShellProvidersComponent[];
}

export const HvAppShellCombinedProvidersContext = createContext<
  HvAppShellCombinedProvidersContextValue | undefined
>(undefined);

export const useHvAppShellCombinedProviders =
  (): HvAppShellCombinedProvidersContextValue => {
    return useContext(
      HvAppShellCombinedProvidersContext,
    ) as HvAppShellCombinedProvidersContextValue;
  };
