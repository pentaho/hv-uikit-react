import { forwardRef, useEffect, useRef, useState } from "react";
import { useForkRef } from "@mui/material/utils";
import ReactECharts from "echarts-for-react/lib/core";
import { AriaComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import { useVizTheme } from "../providers/Provider";
import { HvChartCommonProps, HvEChartsOption } from "../types/common";

// Register chart components
echarts.use([CanvasRenderer, AriaComponent]);

export interface HvBaseChartProps extends Pick<HvChartCommonProps, "onEvents"> {
  /** ECharts option. */
  option: HvEChartsOption;
  /** Charts width. */
  width?: echarts.ResizeOpts["width"];
  /** Charts height. */
  height?: echarts.ResizeOpts["height"];
}

/**
 * Base chart.
 */
export const HvBaseChart = forwardRef<ReactECharts, HvBaseChartProps>(
  function HvBaseChart(props, ref) {
    const { option, width, height, onEvents, ...others } = props;

    const { theme, activeTheme } = useVizTheme();

    const currentTheme = useRef<string | undefined>(theme);
    const chartRef = useRef<ReactECharts>(null);

    const forkedRef = useForkRef<ReactECharts>(ref, chartRef);

    const [initialOption, setInitialOption] = useState<HvEChartsOption>(option);

    // Dispose the instance of the chart when the component unmounts. This ensures that
    // the chart theme will update when the theme changes.
    useEffect(() => {
      const instance = chartRef.current?.getEchartsInstance();

      if (!instance) return;

      return () => {
        instance.dispose();
      };
    }, [activeTheme]);

    useEffect(() => {
      // When the theme changes echarts destroys the chart and mounts it again
      // thus we need to reset the initial option
      if (theme !== currentTheme.current) {
        setInitialOption(option);
        currentTheme.current = theme;
        return;
      }

      const instance = chartRef.current?.getEchartsInstance();

      if (!instance) return;

      // More info: https://echarts.apache.org/en/api.html#echartsInstance.setOption
      instance.setOption(option, {
        replaceMerge: ["xAxis", "yAxis", "series", "dataset", "dataZoom"],
      });
    }, [theme, option]);

    return (
      <ReactECharts
        ref={forkedRef}
        echarts={echarts}
        option={initialOption}
        theme={theme}
        notMerge // When true all the current components will be removed and new components will be created according to the new option
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
        }}
        onEvents={onEvents}
        {...others}
      />
    );
  },
);
