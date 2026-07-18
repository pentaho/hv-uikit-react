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

import type { HvChartGrid } from "../types";
import type { HvEChartsOption } from "../types/common";

interface HvGridHookProps {
  top?: HvChartGrid["top"];
  bottom?: HvChartGrid["bottom"];
  left?: HvChartGrid["left"];
  right?: HvChartGrid["right"];
  width?: number | string;
  height?: number | string;
}

export const useGrid = ({
  top,
  left,
  right,
  bottom,
  width,
  height,
}: HvGridHookProps) => {
  const option = useMemo<Pick<HvEChartsOption, "grid">>(() => {
    return {
      // if no value is defined we shouldn't pass anything because echarts doesn't behave well otherwise
      grid: {
        ...(top != null && {
          top,
        }),
        ...(bottom != null && {
          bottom,
        }),
        ...(left != null && {
          left,
        }),
        ...(right != null && {
          right,
        }),
        ...(width != null && {
          width,
        }),
        ...(height != null && {
          height,
        }),
      },
    };
  }, [top, left, right, bottom, height, width]);

  return option;
};
