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

import { DynamicContext } from "./shared/dynamicContext";

const DynamicProvider = ({ children }: React.PropsWithChildren) => {
  const value = useMemo(
    () => ({
      message: "Dynamic Provider is active and visible after 10s delay",
    }),
    [],
  );

  return (
    <DynamicContext.Provider value={value}>{children}</DynamicContext.Provider>
  );
};

export default DynamicProvider;
