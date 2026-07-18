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
import type { internal } from "arquero";

import type { HvEChartsOption } from "../types/common";

export const useDataset = (data: internal.ColumnTable) => {
  return useMemo<Pick<HvEChartsOption, "dataset">>(() => {
    return {
      dataset: {
        source: data.columnNames().reduce<Record<string, any>>((acc, c) => {
          acc[c] = data.array(c);
          return acc;
        }, {}),
      },
    };
  }, [data]);
};
