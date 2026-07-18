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
import { useTheme } from "@hitachivantara/uikit-react-utils";

import type { HvChartXAxis, HvEChartsOption } from "../types/common";
import { getAxisType } from "../utils";

interface HvXAxisHookProps extends HvChartXAxis {
  scale?: boolean;
  data?: string[];
}

export const useXAxis = ({
  id,
  type = "categorical",
  labelFormatter,
  labelRotation,
  name,
  maxValue,
  minValue,
  scale = false,
  data,
  position,
  nameProps,
}: HvXAxisHookProps) => {
  const { colors } = useTheme();

  const option = useMemo<Pick<HvEChartsOption, "xAxis">>(() => {
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
      xAxis: {
        id,
        type: getAxisType(type),
        name,
        scale,
        axisLabel: {
          rotate: labelRotation ?? 0,
          formatter: labelFormatter,
        },
        max: maxValue === "max" ? "dataMax" : maxValue,
        min: minValue === "min" ? "dataMin" : minValue,
        ...(nameProps?.location && {
          nameLocation: nameProps.location,
        }),
        ...(nameStyle && {
          nameTextStyle: nameStyle,
        }),
        ...(data && { data }),
        ...(position && { position }),
      },
    };
  }, [
    nameProps,
    id,
    type,
    name,
    scale,
    labelRotation,
    labelFormatter,
    maxValue,
    minValue,
    data,
    position,
    colors,
  ]);

  return option;
};
