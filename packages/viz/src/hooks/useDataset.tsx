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
