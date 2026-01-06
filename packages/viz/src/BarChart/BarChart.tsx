import { forwardRef } from "react";
import ReactECharts from "echarts-for-react/lib/core";
import { BarChart } from "echarts/charts";
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
  HvChartTooltipClasses,
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
} from "../hooks";
import { HvBarChartMeasure } from "../types";
import {
  Arrayable,
  HvAxisChartCommonProps,
  HvChartCommonProps,
} from "../types/common";

// Register chart components
echarts.use([
  BarChart,
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomSliderComponent,
  DataZoomInsideComponent,
  MarkLineComponent,
]);

export interface HvBarChartClasses extends HvChartTooltipClasses {}

export interface HvBarChartProps
  extends HvAxisChartCommonProps,
    HvChartCommonProps {
  /**  Columns to measure on the chart. */
  measures: Arrayable<HvBarChartMeasure>;
  /** Whether the bar chart should be horizontal. Defaults to `false`. */
  horizontal?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvBarChartClasses;
}

/**
 * A bar chart is a chart or graph that presents categorical data with rectangular bars.
 */
export const HvBarChart = forwardRef<ReactECharts, HvBarChartProps>(
  function HvBarChart(props, ref) {
    const {
      yAxis,
      xAxis,
      horizontal = false,
      horizontalRangeSlider,
      grid,
      data,
      groupBy,
      splitBy,
      sortBy,
      filters,
      stack,
      seriesNameFormatter,
      measures,
      legend,
      tooltip,
      classes,
      height,
      width,
      onOptionChange,
      ...others
    } = props;

    const { data: chartData, mapping: measuresMapping } = useData({
      data,
      groupBy,
      sortBy,
      splitBy,
      measures,
      filters,
    });

    const chartDataset = useDataset(chartData);

    const chartYAxis = useYAxis({
      axes: Array.isArray(yAxis) || yAxis == null ? yAxis : [yAxis],
      defaultType: horizontal ? "categorical" : "continuous",
    });

    const chartXAxis = useXAxis({
      type: horizontal ? "continuous" : "categorical",
      ...xAxis,
    });

    const chartSlider = useDataZoom({
      showHorizontal: horizontalRangeSlider?.show,
    });

    const chartGrid = useGrid({ ...grid });

    const chartSeries = useSeries({
      type: "bar",
      data: chartData,
      groupBy,
      measuresMapping,
      stack,
      nameFormatter: seriesNameFormatter,
      horizontal,
    });

    const chartLegend = useLegend({
      ...legend,
      series: chartSeries.series,
      icon: "square",
    });

    const chartTooltip = useTooltip({
      ...tooltip,
      trigger: "axis",
      measuresMapping,
      classes,
      horizontal,
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
