import ReactChart from "react-google-charts";

import type { TrendData } from "./data";

interface IndicatorProps {
  data?: TrendData;
  variation?: string;
}

export const Indicator = ({ data, variation }: IndicatorProps) => (
  <div style={{ pointerEvents: "none", marginRight: -4 }}>
    <ReactChart
      width="50px"
      height="32px"
      chartType="AreaChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        legend: "none",
        colors: variation === "up" ? ["green"] : ["red"],
        tooltip: {
          trigger: "none",
        },
        hAxis: {
          minValue: 0,
          maxValue: 10,
          gridlines: {
            color: "transparent",
          },
          baselineColor: "transparent",
        },
        backgroundColor: "transparent",
        vAxis: {
          gridlines: {
            color: "transparent",
          },
          baselineColor: "transparent",
        },
      }}
    />
  </div>
);
