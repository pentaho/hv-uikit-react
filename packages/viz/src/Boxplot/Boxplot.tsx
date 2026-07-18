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
import { BoxplotChart } from "echarts/charts";
import { TooltipComponent, VisualMapComponent } from "echarts/components";
import * as echarts from "echarts/core";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvBaseChart } from "../BaseChart";
import {
  useGrid,
  useLegend,
  useOption,
  useTooltip,
  useXAxis,
  useYAxis,
} from "../hooks";
import type { HvBoxplotMeasure, HvChartTooltip } from "../types";
import type {
  Arrayable,
  HvAxisChartCommonProps,
  HvChartCommonProps,
} from "../types/common";
import { useClasses } from "./Boxplot.styles";
import { useBoxplot } from "./useBoxplot";

// Register chart components
echarts.use([BoxplotChart, TooltipComponent, VisualMapComponent]);

export type HvBoxplotClasses = ExtractNames<typeof useClasses>;

export interface HvBoxplotProps
  extends
    Omit<
      HvAxisChartCommonProps,
      "splitBy" | "horizontalRangeSlider" | "seriesNameFormatter" | "stack"
    >,
    Omit<HvChartCommonProps, "groupBy" | "sortBy"> {
  /** The name of the heatmap */
  name?: string;
  /** Columns to measure on the chart. */
  measures: Arrayable<HvBoxplotMeasure>;
  /** Columns to use to group the data. */
  groupBy?: string;
  /** The tooltip options. */
  tooltip?: Omit<HvChartTooltip, "type" | "valueFormatter" | "titleFormatter">;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvBoxplotClasses;
}

/**
 * A Boxplot chart visually summarizes the distribution of a dataset by depicting key statistical measures such as the median, quartiles, and outliers.
 */
export const HvBoxplot = forwardRef<ReactECharts, HvBoxplotProps>(
  function HvBoxplot(props, ref) {
    const {
      name,
      data,
      xAxis,
      yAxis,
      grid,
      legend,
      measures,
      groupBy,
      tooltip,
      width,
      height,
      filters,
      classes: classesProp,
      onOptionChange,
      ...others
    } = props;

    const { classes } = useClasses(classesProp);

    const chartTooltip = useTooltip({
      component: (params) => {
        const title = params?.title;
        const upper = params?.value?.[5];
        const q3 = params?.value?.[4];
        const median = params?.value?.[3];
        const q1 = params?.value?.[2];
        const lower = params?.value?.[1];

        return `
          <div class="${classes.tooltipRoot}">
            <div class="${classes.tooltipContainer}">
              <div>
              <p class="${classes.tooltipText}">${title}</p>
              <p class="${classes.tooltipText}">Upper: ${upper}</p>
              <p class="${classes.tooltipText}">Q3: ${q3}</p>
              <p class="${classes.tooltipText}">Median: ${median}</p>
              <p class="${classes.tooltipText}">Q1: ${q1}</p>
              <p class="${classes.tooltipText}">Lower: ${lower}</p>
              </div>
            </div>
          </div>`;
      },
      ...tooltip,
    });

    const chartGrid = useGrid({ ...grid });

    const chartLegend = useLegend({
      ...legend,
      icon: "square",
    });

    const chartXAxis = useXAxis({
      ...xAxis,
    });

    const chartYAxis = useYAxis({
      axes: Array.isArray(yAxis) || yAxis == null ? yAxis : [yAxis],
      defaultType: "continuous",
      ...yAxis,
    });

    const chartBoxplot = useBoxplot({ data, groupBy, measures, filters });

    const chartOption = useOption({
      option: {
        ...chartBoxplot,
        ...chartGrid,
        ...chartLegend,
        ...chartTooltip,
        ...chartXAxis,
        ...chartYAxis,
      },
    });

    return (
      <HvBaseChart
        ref={ref}
        option={chartOption}
        width={width}
        height={height}
        {...others}
      />
    );
  },
);
