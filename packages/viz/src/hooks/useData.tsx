import { useMemo } from "react";
import { desc, escape, not } from "arquero";

import {
  HvBarChartMeasure,
  HvChartAggregation,
  HvChartData,
  HvChartOrder,
  HvConfusionMatrixMeasure,
  HvDonutChartMeasure,
  HvLineChartMeasure,
  HvScatterPlotMeasure,
} from "../types";
import {
  Arrayable,
  HvAxisChartCommonProps,
  HvChartCommonProps,
} from "../types/common";
import {
  getGroupKey,
  getHvArqueroCombinedFilters,
  normalizeColumnName,
  processTableData,
  SingleMeasure,
} from "../utils";

const getAgFunc = (func: HvChartAggregation, field: string) =>
  func === "count" ? "count()" : `${func}(d["${field}"])`;

interface HvDataHookProps {
  data: HvChartData;
  groupBy: HvChartCommonProps["groupBy"];
  measures:
    | Arrayable<HvLineChartMeasure | HvBarChartMeasure | HvScatterPlotMeasure>
    | HvDonutChartMeasure
    | HvConfusionMatrixMeasure;
  splitBy?: HvAxisChartCommonProps["splitBy"];
  sortBy?: HvChartCommonProps["sortBy"];
  filters?: HvChartCommonProps["filters"];
  delta?: string;
}

export const useData = ({
  data,
  groupBy,
  measures,
  sortBy,
  splitBy,
  filters: filtersProp,
  delta,
}: HvDataHookProps) => {
  const groupByKey = getGroupKey(groupBy);

  return useMemo(() => {
    // Converting data to Arquero table data and normalizing the columns name
    const { data: processedData, mapping } = processTableData(data);
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

    const groupByFields = (
      groupBy ? (Array.isArray(groupBy) ? groupBy : [groupBy]) : []
    ).map((value) => normalizeColumnName(value)); // normalize

    const splitByFields = (
      Array.isArray(splitBy) ? splitBy : splitBy != null ? [splitBy] : []
    ).map((value) => normalizeColumnName(value)); // normalize

    // keeps track of fields (table columns) used as measures
    const measuresFields: string[] = [];
    // keeps track of the measures specs provided by the user for each derived column; non-normalized names are used as this will be exported;
    const measuresMapping: Record<string, SingleMeasure> = {};
    // defines the new columns to be derived and their agg function
    let measuresColumns: Record<string, string> = {};
    if (typeof measures === "string") {
      measuresMapping[measures] = measures;
      const normalizedMeasure = normalizeColumnName(measures); // normalize
      measuresColumns[normalizedMeasure] = getAgFunc("sum", normalizedMeasure);
      measuresFields.push(normalizedMeasure);
    } else if (Array.isArray(measures)) {
      measuresColumns = measures.reduce<Record<string, string>>(
        (acc, value) => {
          let field: string;
          let agFunction: HvChartAggregation;
          let columnName: string;
          if (typeof value === "string") {
            measuresMapping[value] = value;
            field = normalizeColumnName(value); // normalize
            agFunction = "sum";
            columnName = field;
          } else {
            // finds out if there are more measures for the same field
            const notUnique =
              measures.filter((m) =>
                typeof m === "string"
                  ? m === value.field
                  : m.field === value.field,
              ).length > 1;
            const appendAgg = notUnique && value.agg && value.agg !== "sum";
            measuresMapping[
              appendAgg ? `${value.field}_${value.agg}` : value.field
            ] = value;
            field = normalizeColumnName(value.field); // normalize
            agFunction = value.agg ?? "sum";
            columnName = appendAgg ? `${field}_${value.agg}` : field;
          }

          measuresFields.push(field);
          acc[columnName] = getAgFunc(agFunction, field);
          return acc;
        },
        {},
      );
    } else if (measures != null) {
      measuresMapping[measures.field] = measures;
      const normalizedMeasure = normalizeColumnName(measures.field); // normalize
      measuresColumns[normalizedMeasure] = getAgFunc(
        measures.agg ?? "sum",
        normalizedMeasure,
      );
      measuresFields.push(normalizedMeasure);
    }

    let sortByFields: Record<string, HvChartOrder> = {};
    if (typeof sortBy === "string") {
      const normalizedSort = normalizeColumnName(sortBy); // normalize
      sortByFields[normalizedSort] = "asc";
    } else if (Array.isArray(sortBy)) {
      sortByFields = sortBy.reduce<Record<string, HvChartOrder>>(
        (acc, value) => {
          let field: string;
          let orderFunction: HvChartOrder;
          if (typeof value === "string") {
            field = normalizeColumnName(value); // normalize;
            orderFunction = "asc";
          } else {
            field = normalizeColumnName(value.field); // normalize
            orderFunction = value.order ?? "asc";
          }
          acc[field] = orderFunction;
          return acc;
        },
        {},
      );
    } else if (sortBy != null) {
      const normalizedSort = normalizeColumnName(sortBy.field); // normalize
      sortByFields[normalizedSort] = sortBy.order ?? "asc";
    }

    const allFields = [...groupByFields, ...splitByFields, ...measuresFields];

    // --- Confusion matrix ---
    // Recalculate the measures columns according to the delta column
    if (delta) {
      const deltaExpression = Object.keys(measuresColumns).reduce<
        Record<string, string>
      >((acc, curr) => {
        const normalizedMeasure = normalizeColumnName(curr); // normalize
        const normalizedDelta = normalizeColumnName(delta); // normalize
        acc[normalizedMeasure] =
          `d => d.${normalizedMeasure} - d.${normalizedDelta}`;
        return acc;
      }, {});

      tableData = tableData.derive(deltaExpression);
    }

    // remove unneeded fields
    tableData = tableData.select(...allFields);

    // group by groupBy fields
    if (groupByFields.length > 0) {
      tableData = tableData.groupby(groupByFields);
    }

    if (splitByFields.length > 0) {
      // pivot by splitBy fields
      tableData = tableData.pivot(splitByFields, measuresColumns);
    } else {
      // if there is no splitBy fields, just aggregate measures fields
      tableData = tableData.rollup(measuresColumns);
    }

    // if grouped by multiple fields, create a new joint field
    // as the line chart doesn't implement hierarchical axis label grouping
    if (groupByFields.length > 1) {
      const expression = `d => ${groupByFields
        .map((field) => `d.${field}`)
        .join(" + '_' + ")}`;

      tableData = tableData.derive(
        { [groupByKey]: expression },
        { after: groupByFields[groupByFields.length - 1] },
      );
    }

    // sort by sortBy fields
    if (Object.keys(sortByFields).length > 0) {
      tableData = tableData.orderby(
        ...Object.keys(sortByFields)
          // only sort by fields that are in the table, ignore the rest
          .filter((key) => allFields.includes(key))
          .map((key) => (sortByFields[key] === "desc" ? desc(key) : key)),
      );
    }

    // revert the normalized names to the ones given by the user
    const reversedMapping: Record<string, string> = {};
    for (const column of tableData.columnNames()) {
      if (mapping[column] != null) {
        // use the original name (not normalized)
        reversedMapping[column] = mapping[column];
      } else {
        const found = Object.entries(mapping).find(([key]) =>
          column.includes(key),
        );
        if (found) {
          const [key, value] = found;
          // replace partially with the original name (not normalized)
          reversedMapping[column] = column.replace(key, value as string);
        } else {
          // keep the current name
          reversedMapping[column] = column;
        }
      }
    }

    tableData = tableData.select(reversedMapping);

    // if a derived field was created, remove the original fields
    if (groupByFields.length > 1) {
      tableData = tableData.select(not(...groupByFields));
    }

    return { data: tableData, mapping: measuresMapping };
  }, [
    data,
    filtersProp,
    groupBy,
    splitBy,
    measures,
    sortBy,
    delta,
    groupByKey,
  ]);
};
