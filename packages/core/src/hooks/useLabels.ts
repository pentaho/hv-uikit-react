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

import type { DeepPartial } from "../types/generic";
import { deepMerge } from "../utils/deepMerge";

export function useLabels<T>(defaultLabels: T, labels?: DeepPartial<T>): T {
  return useMemo(() => {
    return deepMerge(defaultLabels, labels);
  }, [defaultLabels, labels]);
}
