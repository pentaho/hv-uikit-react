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
import { useRef, useState } from "react";

export const useComputation = (valueFn: Function, valueFallback?: Function) => {
  const computed = useRef<any>(null);
  const [value, setValue] = useState(valueFallback);

  const computeValue = () => {
    if (!computed.current) {
      setValue(valueFn?.());
      computed.current = true;
    }
  };

  return [value, computeValue];
};
