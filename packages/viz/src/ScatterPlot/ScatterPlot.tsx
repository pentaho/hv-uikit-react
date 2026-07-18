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
import { forwardRef } from "react";
import type ReactECharts from "echarts-for-react";
import { ScatterChart } from "echarts/charts";
import {
  DatasetComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";

import { HvBaseChart } from "../BaseChart";
import {
  useData,
  useDataset,
  useDataZoom,
  useGrid,
  useLegend,
  useOption,
  useSeries,
  useTooltip,
  useXAxis,
  useYAxis,
  type HvChartTooltipClasses,
} from "../hooks";
import type {
  Arrayable,
  HvAxisChartCommonProps,
  HvChartCommonProps,
} from "../types/common";
import type { HvScatterPlotMeasure } from "../types/measures";

// Register chart components
echarts.use([
  ScatterChart,
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomSliderComponent,
  DataZoomInsideComponent,
  MarkLineComponent,
]);

export interface HvScatterPlotClasses extends HvChartTooltipClasses {}

export interface HvScatterPlotProps
  extends HvChartCommonProps, Omit<HvAxisChartCommonProps, "stack"> {
  /** Columns to measure on the plot. */
  measures: Arrayable<HvScatterPlotMeasure>;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvScatterPlotClasses;
}

/**
 * A scatter plot is a type of chart which displays dots to represent two numeric variables.
 * This type of chart is used to determine the relationship between two variables.
 */
export const HvScatterPlot = forwardRef<ReactECharts, HvScatterPlotProps>(
  function HvScatterPlot(props, ref) {
    const {
      yAxis,
      xAxis,
      horizontalRangeSlider,
      grid,
      data,
      groupBy,
      splitBy,
      sortBy,
      filters,
      measures,
      seriesNameFormatter,
      legend,
      classes,
      tooltip,
      width,
      height,
      onOptionChange,
      ...others
    } = props;

    const { data: chartData, mapping: measuresMapping } = useData({
      data,
      groupBy,
      measures,
      splitBy,
      sortBy,
      filters,
    });

    const chartDataset = useDataset(chartData);

    const chartYAxis = useYAxis({
      axes: Array.isArray(yAxis) || yAxis == null ? yAxis : [yAxis],
    });

    const chartXAxis = useXAxis({ type: "continuous", ...xAxis });

    const chartSlider = useDataZoom({
      showHorizontal: horizontalRangeSlider?.show,
    });

    const chartGrid = useGrid({ ...grid });

    const chartSeries = useSeries({
      type: "scatter",
      data: chartData,
      groupBy,
      measuresMapping,
      nameFormatter: seriesNameFormatter,
    });

    const chartLegend = useLegend({
      ...legend,
      series: chartSeries.series,
    });

    const chartTooltip = useTooltip({
      ...tooltip,
      trigger: "axis",
      measuresMapping,
      classes,
    });

    const option = useOption({
      option: {
        ...chartYAxis,
        ...chartXAxis,
        ...chartSlider,
        ...chartGrid,
        ...chartDataset,
        ...chartSeries,
        ...chartLegend,
        ...chartTooltip,
      },
      onOptionChange,
    });

    return (
      <HvBaseChart
        ref={ref}
        option={option}
        width={width}
        height={height}
        {...others}
      />
    );
  },
);
