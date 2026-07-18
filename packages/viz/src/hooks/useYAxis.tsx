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
import { useTheme } from "@hitachivantara/uikit-react-utils";

import type { HvChartAxisType } from "../types";
import type { HvEChartsOption, YAxis } from "../types/common";
import { getAxisType } from "../utils";

interface HvYAxisHookProps {
  axes?: YAxis[];
  defaultType?: HvChartAxisType;
}

export const useYAxis = ({
  axes,
  defaultType = "continuous",
}: HvYAxisHookProps) => {
  const { colors } = useTheme();

  const createAxis = useCallback(
    ({
      id,
      type,
      name,
      labelFormatter,
      labelRotation,
      maxValue,
      minValue,
      nameProps,
      data,
      position,
    }: YAxis) => {
      const nameStyleKeys = nameProps
        ? Object.keys(nameProps).filter((key) => key !== "location")
        : undefined;
      const nameStyle =
        nameProps && nameStyleKeys
          ? nameStyleKeys.reduce<Record<string, any>>((acc, curr) => {
              acc[curr] =
                (curr === "color" && colors?.[nameProps[curr] as string]) ||
                nameProps[curr as keyof typeof nameProps];
              return acc;
            }, {})
          : undefined;

      return {
        id,
        type: getAxisType(type) ?? getAxisType(defaultType),
        name,
        axisLabel: {
          rotate: labelRotation ?? 0,
          formatter: labelFormatter,
        },
        max: maxValue === "max" ? "dataMax" : maxValue,
        min: minValue === "min" ? "dataMin" : minValue,
        ...(nameProps?.location && {
          nameLocation: nameProps?.location,
        }),
        ...(nameStyle && {
          nameTextStyle: nameStyle,
        }),
        ...(data && { data }),
        ...(position && { position }),
      };
    },
    [colors, defaultType],
  );

  const option = useMemo<Pick<HvEChartsOption, "yAxis">>(() => {
    return {
      yAxis: Array.isArray(axes)
        ? axes.map((axis) => createAxis(axis))
        : [createAxis({})],
    };
  }, [axes, createAxis]);

  return option;
};
