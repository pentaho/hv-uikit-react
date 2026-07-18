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
import { createContext, useContext } from "react";

import type { HvAppShellConfig } from "./types/Config";

export type HvAppShellContextValue = HvAppShellConfig;
export const HvAppShellContext = createContext<
  HvAppShellContextValue | undefined
>(undefined);

export const useHvAppShellConfig = (): HvAppShellContextValue => {
  return useContext(HvAppShellContext) as HvAppShellContextValue;
};
