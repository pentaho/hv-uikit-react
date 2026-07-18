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
import { useMemo } from "react";
import type { VisualMapComponentOption } from "echarts";

import type { HvChartLegend } from "../types";
import type { HvEChartsOption } from "../types/common";
import { getLegendIcon } from "../utils";

export type HvVisualMapHookProps = VisualMapComponentOption & {
  show?: boolean;
  pieces?: Record<string, string | number>[];
  max?: number;
  min?: number;
  colorScale?: string[];
  type?: "continuous" | "piecewise";
  // Uses the same props as the legend
  position?: HvChartLegend["position"];
  direction?: HvChartLegend["direction"];
};

export const useVisualMap = ({
  show = true,
  direction = "horizontal",
  type = "continuous",
  pieces,
  max,
  min,
  colorScale,
  position: positionProp,
  ...others
}: HvVisualMapHookProps) => {
  const option = useMemo<Pick<HvEChartsOption, "visualMap">>(() => {
    return {
      visualMap: {
        type,
        show,
        ...(pieces && {
          pieces,
        }),
        ...(type === "piecewise" && {
          itemSymbol: getLegendIcon("square"),
          itemGap: 20,
          itemHeight: 16,
          itemWidth: 16,
        }),
        ...(colorScale && {
          max,
          min,
          inRange: {
            color: colorScale,
          },
        }),
        orient: direction,
        top: positionProp?.y || "top",
        left: positionProp?.x || "center",
        ...others,
      },
    };
  }, [
    colorScale,
    direction,
    max,
    min,
    others,

    pieces,
    positionProp?.x,
    positionProp?.y,
    show,
    type,
  ]);

  return option;
};
