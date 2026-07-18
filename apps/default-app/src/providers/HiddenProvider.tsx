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
import { useMemo, type PropsWithChildren } from "react";

import { HiddenContext } from "./shared/hiddenContext";

interface HiddenProviderProps extends PropsWithChildren {}

const HiddenProvider = ({ children }: HiddenProviderProps) => {
  const value = useMemo(
    () => ({
      message: "ERROR: This message should NOT be visible!",
    }),
    [],
  );

  console.error("HiddenProvider mounted - THIS SHOULD NOT HAPPEN!");

  return (
    <HiddenContext.Provider value={value}>{children}</HiddenContext.Provider>
  );
};

export default HiddenProvider;
