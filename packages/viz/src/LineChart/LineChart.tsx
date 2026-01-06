import { forwardRef } from "react";
import ReactECharts from "echarts-for-react/lib/core";
import { LineChart } from "echarts/charts";
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
import { HvChartEmptyCellMode, HvLineChartMeasure } from "../types";
import {
  Arrayable,
  HvAxisChartCommonProps,
  HvChartCommonProps,
} from "../types/common";

// Register chart components
echarts.use([
  LineChart,
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomSliderComponent,
  DataZoomInsideComponent,
  MarkLineComponent,
]);

export interface HvLineChartClasses extends HvChartTooltipClasses {}

export interface HvLineChartProps
  extends HvAxisChartCommonProps,
    HvChartCommonProps {
  /** Columns to measure on the chart. */
  measures: Arrayable<HvLineChartMeasure>;
  /** Strategy to use when there are empty cells. Defaults to `void`. */
  emptyCellMode?: HvChartEmptyCellMode;
  /** Whether the area under the lines should be filled. Defaults to `false`. */
  area?: boolean;
  /** Sets opacity of the filled area if `area` is true. Defaults to `0.5`. */
  areaOpacity?: number;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvLineChartClasses;
}

/**
 * A line chart or line plot or line graph is a type of chart which displays information as a series of data points
 * connected by straight line segments.
 */
export const HvLineChart = forwardRef<ReactECharts, HvLineChartProps>(
  function HvLineChart(props, ref) {
    const {
      area = false,
      emptyCellMode = "void",
      areaOpacity = 0.5,
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
      stack,
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

    const chartXAxis = useXAxis({ ...xAxis, scale: true });

    const chartSlider = useDataZoom({
      showHorizontal: horizontalRangeSlider?.show,
    });

    const chartGrid = useGrid({ ...grid });

    const chartSeries = useSeries({
      type: "line",
      data: chartData,
      groupBy,
      measuresMapping,
      area,
      areaOpacity,
      emptyCellMode,
      stack,
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
