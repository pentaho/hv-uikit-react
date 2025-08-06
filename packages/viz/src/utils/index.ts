import { from, internal, table } from "arquero";
import type ColumnTable from "arquero/dist/types/table/column-table";

import type {
  HvBarChartMeasure,
  HvChartAxisType,
  HvChartData,
  HvChartFilter,
  HvChartFilterOperation,
  HvConfusionMatrixMeasure,
  HvDonutChartMeasure,
  HvLineChartMeasure,
} from "../types";
import { HvChartCommonProps } from "../types/common";
import { HvChartLegendIcon } from "../types/legend";
import { HvScatterPlotMeasure } from "../types/measures";

export const getAxisType = (type?: HvChartAxisType) => {
  switch (type) {
    case "categorical":
      return "category";
    case "time":
      return "time";
    case "continuous":
      return "value";
    default:
      return undefined;
  }
};

export const getGroupKey = (groupBy: HvChartCommonProps["groupBy"]) =>
  Array.isArray(groupBy) ? groupBy.join("_") : groupBy;

export const getLegendIcon = (icon: HvChartLegendIcon) => {
  switch (icon) {
    case "circle":
      return "circle";
    case "square":
      return "path://M0,0L16,0L16,16L0,16L0,0Z";
    case "line":
    default:
      return "path://M0,0L16,0L16,2L0,2Z";
  }
};

export type SingleMeasure =
  | HvLineChartMeasure
  | HvBarChartMeasure
  | HvScatterPlotMeasure
  | HvDonutChartMeasure
  | HvConfusionMatrixMeasure;

export const getMeasure = (
  name: string,
  mapping: Record<string, SingleMeasure>,
) => {
  // find the key that matches the most number of characters
  // we are not doing the first match because columns can be repeated if they use different agg functions
  let measure: SingleMeasure | undefined;
  let count = 0;
  for (const key of Object.keys(mapping)) {
    if (name.includes(key) && key.length >= count) {
      count = key.length;
      measure = mapping[key];
    }
  }
  // return the found measure in measures array or return the first one
  return measure ?? Object.values(mapping)[0];
};

export const getFilterFunction = (
  operation: HvChartFilterOperation,
  field: HvChartFilter["field"],
  value: HvChartFilter["value"],
) => {
  const valueArray = Array.isArray(value) ? value : [value];
  if (valueArray.length === 0) return () => true;

  switch (operation) {
    case "is": {
      return (row: any) => valueArray.includes(row[field]);
    }
    case "isNot": {
      return (row: any) => !valueArray.includes(row[field]);
    }
    case "contains":
      return (row: any) => {
        let include = false;
        for (const val of valueArray) {
          if (String(row[field]).includes(String(val))) {
            include = true;
          }
        }
        return include;
      };
    case "notContains":
      return (row: any) => {
        let include = true;
        for (const val of valueArray) {
          if (String(row[field]).includes(String(val))) {
            include = false;
          }
        }
        return include;
      };
    case "greaterThan":
      return (row: any) => {
        let include = false;
        for (const val of valueArray) {
          if (row[field] > val) {
            include = true;
          }
        }
        return include;
      };
    case "greaterThanOrEqual":
      return (row: any) => {
        let include = false;
        for (const val of valueArray) {
          if (row[field] >= val) {
            include = true;
          }
        }
        return include;
      };
    case "lessThan":
      return (row: any) => {
        let include = false;
        for (const val of valueArray) {
          if (row[field] < val) {
            include = true;
          }
        }
        return include;
      };
    case "lessThanOrEqual":
      return (row: any) => {
        let include = false;
        for (const val of valueArray) {
          if (row[field] <= val) {
            include = true;
          }
        }
        return include;
      };
    case "between":
      return (row: any) =>
        row[field] >= valueArray[0] && row[field] <= valueArray[1];
    case "ends":
      return (row: any) => {
        let include = false;
        for (const val of valueArray) {
          if (String(row[field]).endsWith(String(val))) {
            include = true;
          }
        }
        return include;
      };
    case "notEnds":
      return (row: any) => {
        let include = true;
        for (const val of valueArray) {
          if (String(row[field]).endsWith(String(val))) {
            include = false;
          }
        }
        return include;
      };
    case "starts":
      return (row: any) => {
        let include = false;
        for (const val of valueArray) {
          if (String(row[field]).startsWith(String(val))) {
            include = true;
          }
        }
        return include;
      };
    case "notStarts":
      return (row: any) => {
        let include = true;
        for (const val of valueArray) {
          if (String(row[field]).startsWith(String(val))) {
            include = false;
          }
        }
        return include;
      };

    default:
      throw new Error("Unsupported operation");
  }
};

// Note: Exported to the users
/**
 * Combine filter functions into a single function. Only rows that pass all filters will be included.
 * Should be used inside the `escape` function provided by Arquero.
 * */
export const getHvArqueroCombinedFilters = (
  row: any,
  filters: HvChartFilter[],
) => {
  return filters.every((filter) => {
    const { field, operation, value } = filter;
    const filterFunction = Object.hasOwn(row, field)
      ? getFilterFunction(operation, field, value)
      : () => true;
    return filterFunction(row);
  });
};

/**
 * Normalizes a column name by replacing all characters that are not letters or numbers by "__"
 */
export const normalizeColumnName = (string: string) => {
  return string.replace(/[^a-zA-Z0-9]/g, "__");
};

/**
 * Converts data to a arquero data table and normalizes the column names for data processing.
 * @param data Chart data
 * @returns Processed data and reversed columns mapping to switch the columns to their original name
 */
export const processTableData = (data: HvChartData) => {
  let tableData: ColumnTable;
  if (data instanceof internal.ColumnTable) {
    tableData = data;
  } else if (Array.isArray(data)) {
    tableData = from(data);
  } else {
    tableData = table(data);
  }

  // Normalize the column names to remove any special character and spaces since it can lead to errors during processing
  const nameMapping: Record<string, string> = {};
  const reversedNameMapping: Record<string, string> = {};
  for (const column of tableData.columnNames()) {
    const normalizedName = normalizeColumnName(column);
    nameMapping[column] = normalizedName;
    reversedNameMapping[normalizedName] = column;
  }

  return {
    data: tableData.select(nameMapping),
    mapping: reversedNameMapping,
  };
};
