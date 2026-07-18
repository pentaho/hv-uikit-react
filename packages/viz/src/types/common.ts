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
import type { EChartsType } from "echarts";

import type { HvChartAxis } from "./axis";
import type { HvChartFilter } from "./filter";
import type { HvChartData } from "./generic";
import type { HvChartGrid } from "./grid";
import type { HvChartLegend } from "./legend";
import type { HvChartHorizontalRangeSlider } from "./slider";
import type { HvChartSortBy } from "./sort";
import type { HvChartTooltip } from "./tooltip";

// Note: These types should not be exported at the moment since they can change over time.

export type Arrayable<T> = T | T[];

// The "EChartsOption" type is set as "any" which is not very helpful.
// This type was created to have something a little bit more specific.
export type HvEChartsOption = Record<string, any>;

// Echarts doesn't provide much information about the params properties so we extend any object
interface EventParams extends Record<string, any> {
  componentIndex?: number;
  componentType?: string;
  dataIndex?: number;
  value?: any;
  targetType?: string;
  type?: string;
  event?: Record<string, any>;
}

/** Props common among all charts. */
export interface HvChartCommonProps {
  /** Chart data. */
  data: HvChartData;
  /** Columns to use to group the data. */
  groupBy: Arrayable<string>;
  /** Columns to use to sort the data points. */
  sortBy?: Arrayable<HvChartSortBy>;
  /** Filters to apply to the data. */
  filters?: Arrayable<HvChartFilter>;
  /** Tooltip options. */
  tooltip?: HvChartTooltip;
  /** Legend options. */
  legend?: HvChartLegend;
  /** Grid options. */
  grid?: HvChartGrid;
  /** Chart width. */
  width?: number;
  /** Chart height. */
  height?: number;
  /**
   * Callback called when the ECharts option changes.
   * This prop can be used to customize the option before rendering the chart.
   * For more information about the ECharts option and the available properties, take a look at their [documentation](https://echarts.apache.org/en/option.html).
   */
  onOptionChange?: (option: HvEChartsOption) => HvEChartsOption;
  /** Callback to bind events to the chart. */
  onEvents?: Record<
    string,
    (params: EventParams, instance?: EChartsType) => void
  >;
}

export interface HvChartXAxis extends HvChartAxis {
  /** Position of the axis. */
  position?: "top" | "bottom";
}

export interface HvChartYAxis extends HvChartAxis {
  /** Position of the axis. */
  position?: "left" | "right";
}

export interface YAxis extends HvChartYAxis {
  data?: string[];
}

export interface XAxis extends HvChartXAxis {
  data?: string[];
}

/** Axis charts (line and bar) common props  */
export interface HvAxisChartCommonProps {
  /** Columns to use to split the measures. */
  splitBy?: Arrayable<string>;
  /** Options for the xAxis, i.e. the horizontal axis. */
  xAxis?: HvChartXAxis;
  /** Options for the yAxis, i.e. the vertical axis. */
  yAxis?: HvChartYAxis | [HvChartYAxis, HvChartYAxis];
  /** Stack name to use when all the series should be stacked together. If not provided, the series are not stacked. */
  stack?: string;
  /** Ranger slider options for the horizontal axis. */
  horizontalRangeSlider?: HvChartHorizontalRangeSlider;
  /** Formatter for the series names used on the tooltips and legend. */
  seriesNameFormatter?: (value?: string) => string;
}
