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

import { AsyncContext } from "./shared/asyncContext";

interface AsyncTrueProviderProps extends PropsWithChildren {}

const AsyncProvider = ({ children }: AsyncTrueProviderProps) => {
  const value = useMemo(
    () => ({
      message: "Async Provider is active and visible after 0.5s delay.",
    }),
    [],
  );

  return (
    <AsyncContext.Provider value={value}>{children}</AsyncContext.Provider>
  );
};

export default AsyncProvider;
