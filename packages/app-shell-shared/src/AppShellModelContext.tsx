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

import type { HvAppShellModel } from "./types/Model";

export interface HvAppShellModelContextValue extends HvAppShellModel {}

export const HvAppShellModelContext = createContext<
  HvAppShellModelContextValue | undefined
>(undefined);

export const useHvAppShellModel = (): HvAppShellModel => {
  const context = useContext(HvAppShellModelContext);

  if (!context) {
    throw new Error(
      "useHvAppShellModel must be used within HvAppShellModelContext.Provider",
    );
  }

  return context;
};
