import * as echarts from "echarts/core";
import type { HvTheme } from "@hitachivantara/uikit-react-utils";

export const registerTheme = (
  themeName: string,
  mode: string,
  themeStructure?: HvTheme,
) => {
  const colors = themeStructure?.colors[mode];
  // if theme & mode is invalid, exit (to use the default theme)
  if (!colors) return;

  const baseText = {
    color: colors?.text,
    fontWeight: themeStructure?.fontWeights.normal,
    fontSize: themeStructure?.fontSizes.sm,
    fontFamily: themeStructure?.fontFamily.body,
  };

  const customAxis = {
    nameTextStyle: {
      ...baseText,
      color: colors?.textSubtle,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: colors?.borderSubtle,
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: colors?.borderSubtle,
      },
    },
    axisLabel: {
      color: colors?.textSubtle,
      fontWeight: themeStructure?.fontWeights.normal,
      fontSize: themeStructure?.fontSizes.sm,
      fontFamily: themeStructure?.fontFamily.body,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: colors?.borderSubtle,
      },
    },
  };

  echarts.registerTheme(themeName, {
    color: [
      colors?.cat1,
      colors?.cat2,
      colors?.cat3,
      colors?.cat4,
      colors?.cat5,
      colors?.cat6,
      colors?.cat7,
      colors?.cat8,
      colors?.cat9,
      colors?.cat10,
      colors?.cat11,
      colors?.cat12,
    ],
    legend: {
      textStyle: {
        ...baseText,
      },
    },
    tooltip: {
      borderWidth: 0,
      padding: 0,
      textStyle: {
        ...baseText,
      },
      axisPointer: {
        lineStyle: {
          color: colors?.text,
          width: 1,
        },
      },
    },
    dataZoom: {
      textStyle: { ...baseText },
    },
    categoryAxis: {
      ...customAxis,
    },
    valueAxis: {
      ...customAxis,
    },
    logAxis: {
      ...customAxis,
    },
    timeAxis: {
      ...customAxis,
    },
    line: {
      lineStyle: {
        width: 2,
      },
    },
    visualMap: {
      textStyle: {
        ...baseText,
      },
    },
    heatmap: {
      label: {
        fontWeight: baseText.fontWeight,
        fontSize: baseText.fontSize,
        fontFamily: baseText.fontFamily,
      },
      itemStyle: {
        borderColor: colors?.borderSubtle,
        borderWidth: 1,
      },
    },
    treemap: {
      breadcrumb: {
        itemStyle: {
          color: colors?.text,
          textStyle: {
            color: colors?.bgContainer,
          },
        },
      },
    },
  });
};
