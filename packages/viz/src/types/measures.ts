import { HvChartEmptyCellMode } from "./generic";

/** Sampling functions */
export type HvChartSampling =
  | "none"
  | "average"
  | "min"
  | "max"
  | "sum"
  | "lttb";

/** Aggregation functions */
export type HvChartAggregation =
  | "sum"
  | "average"
  | "min"
  | "max"
  | "count"
  | "distinct"
  | "median"
  | "mode";

interface BaseMeasure {
  /** Column name. */
  field: string;
  /** Aggregation function to use. If no `agg` is defined, it will default to `sum`. */
  agg?: HvChartAggregation;
  /** Formatter for the value. This will be used in the tooltips and overrides the tooltip's value formatter. */
  valueFormatter?: (value?: string | number) => string;
}

interface AxisMeasure {
  /** Id of the yAxis. */
  yAxis?: string;
  /**
   * Stack name to use when the measure should be stacked.
   *
   * Measures stacked together have the same name.
   *
   * If not specified, it defaults to the global `stacked` prop.
   */
  stack?: string;
  /** Sampling function to use. */
  sampling?: HvChartSampling;
}

export interface LineFullMeasure extends BaseMeasure, AxisMeasure {
  /** Whether to hide the symbol for data points. Defaults to `false`. */
  hideSymbol?: boolean;
  /** Whether the area under the lines should be filled. If not specified, it defaults to the global `area` prop. */
  area?: boolean;
  /** Sets opacity of the filled area if `area` is true. If not specified, it defaults to the global `areaOpacity` prop. */
  areaOpacity?: number;
  /** Strategy to use when there are empty cells. If not specified, it defaults to the global `emptyCellMode` prop. */
  emptyCellMode?: HvChartEmptyCellMode;
}

export interface BarFullMeasure extends BaseMeasure, AxisMeasure {}

export interface DonutFullMeasure extends BaseMeasure {}

export interface ConfusionMatrixMeasure extends BaseMeasure {}

export interface BoxplotMeasure
  extends Omit<BaseMeasure, "agg" | "valueFormatter">,
    Omit<AxisMeasure, "stack" | "sampling"> {}

export interface ScatterPlotMeasure
  extends BaseMeasure,
    Pick<AxisMeasure, "yAxis"> {}

export type HvLineChartMeasure = string | LineFullMeasure;

export type HvBarChartMeasure = string | BarFullMeasure;

export type HvDonutChartMeasure = string | DonutFullMeasure;

export type HvConfusionMatrixMeasure = string | ConfusionMatrixMeasure;

export type HvScatterPlotMeasure = string | ScatterPlotMeasure;

export type HvBoxplotMeasure = string | BoxplotMeasure;
