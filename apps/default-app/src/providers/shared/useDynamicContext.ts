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
import { useContext } from "react";

import { DynamicContext } from "./dynamicContext";

export const useDynamicContext = () => {
  const ctx = useContext(DynamicContext);
  if (!ctx) {
    return null;
  }
  return ctx;
};
