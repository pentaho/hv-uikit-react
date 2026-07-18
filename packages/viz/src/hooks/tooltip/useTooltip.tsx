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
import { useCallback, useMemo } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import type { HvChartTooltip, HvChartTooltipParams } from "../../types";
import type { HvEChartsOption } from "../../types/common";
import { getMeasure, type SingleMeasure } from "../../utils";
import { useClasses } from "./styles";

export type HvChartTooltipClasses = ExtractNames<typeof useClasses>;

/** Echarts doesn't seem to have the type for the tooltip params */
interface EChartsTooltipParams {
  seriesName: string;
  value: (string | number)[];
  encode: Record<string, number[]>;
  color: string;
  dimensionNames: string[];
  name: string;
  seriesType: string;
}

interface HvTooltipHookProps {
  measuresMapping?: Record<string, SingleMeasure>;
  trigger?: "item" | "axis";
  classes?: HvChartTooltipClasses;
  horizontal?: boolean;
  show?: HvChartTooltip["show"];
  type?: HvChartTooltip["type"];
  component?: HvChartTooltip["component"];
  valueFormatter?: HvChartTooltip["valueFormatter"];
  titleFormatter?: HvChartTooltip["titleFormatter"];
  nameFormatter?: (value?: string) => string;
}

export const useTooltip = ({
  measuresMapping = {},
  classes,
  component,
  show = true,
  horizontal = false,
  trigger = "item",
  type = "multiple",
  valueFormatter,
  titleFormatter,
  nameFormatter,
}: HvTooltipHookProps) => {
  const { classes: hvClasses } = useClasses(classes);

  const renderTooltip = useCallback(
    (params: EChartsTooltipParams[]) => {
      const title =
        params[0].seriesType === "treemap" ||
        params[0].seriesType === "heatmap" ||
        params[0].seriesType === "boxplot"
          ? params[0].name
          : params[0].seriesType === "pie"
            ? params[0].seriesName
            : horizontal
              ? params[0].value[params[0].encode.y[0]]
              : params[0].value[params[0].encode.x[0]];

      const formattedTitle = titleFormatter ? titleFormatter(title) : title;

      if (type === "single") {
        const measure = getMeasure(
          params[0].seriesType === "pie" ||
            params[0].seriesType === "treemap" ||
            params[0].seriesType === "heatmap" ||
            params[0].seriesType === "boxplot"
            ? params[0].name
            : horizontal
              ? params[0].dimensionNames[params[0].encode.x[0]]
              : params[0].dimensionNames[params[0].encode.y[0]],
          measuresMapping,
        );

        const value =
          params[0].seriesType === "pie" ||
          params[0].seriesType === "treemap" ||
          params[0].seriesType === "heatmap"
            ? params[0].value[params[0].encode.value[0]]
            : horizontal
              ? params[0].value[params[0].encode.x[0]]
              : params[0].value[params[0].encode.y[0]];

        const formattedValue =
          measure && typeof measure !== "string" && measure.valueFormatter
            ? measure.valueFormatter(value)
            : valueFormatter
              ? valueFormatter(value)
              : value;

        return `
            <div class="${hvClasses?.singleTooltipRoot}">
              <p class="${hvClasses?.singleTooltipTitle}">${formattedTitle}</p>
              <p class="${hvClasses?.singleTooltipValue}">${formattedValue}</p>
            </div>
            `;
      }

      return `
        <div class="${hvClasses?.multipleTooltipRoot}">
          <div class="${hvClasses?.multipleTooltipTitleContainer}">
            <div>
              <p class="${hvClasses?.multipleTooltipTitle}">${formattedTitle}</p>
            </div>
          </div>
          <div class="${hvClasses?.multipleTooltipValuesContainer}">
            ${params
              .map((s) => {
                const measure = getMeasure(
                  s.seriesType === "pie"
                    ? s.name
                    : horizontal
                      ? s.dimensionNames[s.encode.x[0]]
                      : s.dimensionNames[s.encode.y[0]],
                  measuresMapping,
                );

                const value =
                  s.seriesType === "pie"
                    ? s.value[s.encode.value[0]]
                    : horizontal
                      ? s.value[s.encode.x[0]]
                      : s.value[s.encode.y[0]];

                const formattedValue =
                  typeof measure !== "string" && measure?.valueFormatter
                    ? measure.valueFormatter(value)
                    : valueFormatter
                      ? valueFormatter(value)
                      : value;

                const name = s.seriesType === "pie" ? s.name : s.seriesName;

                const formattedName = nameFormatter
                  ? nameFormatter(name)
                  : name;

                return `
                <div key="${s.seriesName}" class="${hvClasses?.multipleTooltipSeriesContainer}">
                  <div class="${hvClasses?.multipleTooltipSeriesNameContainer}">
                    <p style="background-color: ${s.color};" class="${hvClasses?.multipleTooltipSeriesColor}" />
                    <p class="${hvClasses?.multipleTooltipSeriesName}">${formattedName}</p>
                  </div>
                  <p class="${hvClasses?.multipleTooltipSeriesValue}">${formattedValue}</p>
                </div>
              `;
              })
              .join(" ")}
          </div>
        </div>
        `;
    },
    [
      hvClasses,
      horizontal,
      type,
      measuresMapping,
      nameFormatter,
      titleFormatter,
      valueFormatter,
    ],
  );

  const renderCustomTooltip = useCallback(
    (params: EChartsTooltipParams[]) => {
      if (typeof component === "function") {
        const values: HvChartTooltipParams = {
          title:
            params[0].seriesType === "boxplot"
              ? params[0].name
              : params[0].seriesType === "pie" ||
                  params[0].seriesType === "treemap" ||
                  params[0].seriesType === "heatmap"
                ? params[0].seriesName
                : horizontal
                  ? params[0].value[params[0].encode.y[0]]
                  : params[0].value[params[0].encode.x[0]],
          series: params.map((p) => {
            return {
              color: p.color,
              name:
                p.seriesType === "heatmap"
                  ? String(p.value[p.encode.y[0]])
                  : p.seriesType === "pie" || p.seriesType === "treemap"
                    ? p.name
                    : p.seriesName,
              value:
                p.seriesType === "pie" ||
                p.seriesType === "treemap" ||
                p.seriesType === "heatmap"
                  ? p.value[p.encode.value[0]]
                  : horizontal
                    ? p.value[p.encode.x[0]]
                    : p.value[p.encode.y[0]],
            };
          }),
          value: params[0].value,
        };

        return component(values);
      }

      return component;
    },
    [component, horizontal],
  );

  const option = useMemo<Pick<HvEChartsOption, "tooltip">>(() => {
    return {
      tooltip: {
        confine: false,
        show,
        trigger,
        position: (point: any, params: any, dom: any, rect: any, size: any) => {
          return [point[0], point[1] - size.contentSize[1]];
        },
        formatter: (params: any) => {
          const tooltipParams = Array.isArray(params) ? params : [params];

          return component
            ? renderCustomTooltip(tooltipParams)
            : renderTooltip(tooltipParams);
        },
      },
    };
  }, [trigger, component, show, renderTooltip, renderCustomTooltip]);

  return option;
};
