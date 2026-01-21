import { useMemo } from "react";
import { escape } from "arquero";

import { HvChartData, HvChartFilter } from "../types";
import { Arrayable } from "../types/common";
import {
  getHvArqueroCombinedFilters,
  normalizeColumnName,
  processTableData,
} from "../utils";

interface HvDataHookProps {
  data: HvChartData;
  groupBy?: string;
  measures: Record<string, string | undefined>;
  filters?: Arrayable<HvChartFilter>;
}

export const useBoxplotData = ({
  data,
  groupBy: groupByProp,
  measures,
  filters: filtersProp,
}: HvDataHookProps) => {
  const chartData = useMemo(() => {
    // Converting data to arquero table data and normalizing the columns name
    const { data: processedData } = processTableData(data);
    let tableData = processedData;

    // Filter data right away
    if (filtersProp) {
      const filters = (
        Array.isArray(filtersProp) ? filtersProp : [filtersProp]
      ).map((filter) => ({
        ...filter,
        field: normalizeColumnName(filter.field), // normalize
      }));

      tableData = tableData.filter(
        escape((row: any) => getHvArqueroCombinedFilters(row, filters)),
      );
    }

    const normalizedGroupBy = normalizeColumnName(groupByProp || ""); // normalize
    const uniqueGroupBy = new Set(
      tableData.array(normalizedGroupBy) as string[],
    );

    const results: Record<string, Record<string, any[]>> = {};
    uniqueGroupBy.forEach((group) => {
      results[group] = {};
      Object.keys(measures).forEach((measure) => {
        results[group][measure] = tableData
          .params({ group, groupBy: normalizedGroupBy })
          .filter((d: any, $: any) => d[$.groupBy] === $.group)
          .array(normalizeColumnName(measure)); // normalize
      });
    });

    return results;
  }, [data, filtersProp, groupByProp, measures]);

  return chartData;
};
