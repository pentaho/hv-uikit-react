import { useMemo } from "react";
import { GaugeChart } from "echarts/charts";
import * as echarts from "echarts/core";
import { useTheme } from "@hitachivantara/uikit-react-core";
import { HvBaseChart } from "@hitachivantara/uikit-react-viz";

echarts.use([GaugeChart]);

export default function Demo() {
  const { colors } = useTheme();

  const optionGauge = useMemo(
    () => ({
      series: [
        {
          type: "gauge",
          startAngle: 225,
          endAngle: -45,
          pointer: {
            show: false,
          },
          progress: {
            show: true,
            width: 20,
            itemStyle: {
              color: colors?.negative,
            },
          },
          axisLine: {
            lineStyle: {
              width: 20,
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            formatter: (value: number) =>
              ["{l|High Risk}", "{v|" + value + "%}"].join("\n"),
            rich: {
              v: {
                fontSize: 48,
                color: colors?.text,
              },
              l: {
                fontSize: 16,
                color: colors?.text,
              },
            },
          },
          data: [
            {
              value: 80,
            },
          ],
        },
        {
          type: "gauge",
          startAngle: 225,
          endAngle: -45,
          pointer: {
            show: true,
            icon: "rect",
            length: "25%",
            offsetCenter: [0, "-80%"],
            width: 1,
            itemStyle: {
              color: "#000",
            },
          },
          axisLine: {
            show: false,
          },
          progress: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          data: [
            {
              value: 65,
            },
          ],
          detail: {
            show: true,
            offsetCenter: ["75%", "-90%"],
            formatter: (value: number) => `${value}%`,
            fontSize: 14,
            color: "#000",
          },
          z: 10,
        },
      ],
    }),
    [colors],
  );

  return (
    <div className="flex justify-center size-full">
      <HvBaseChart width={400} height={300} option={optionGauge} />
    </div>
  );
}
