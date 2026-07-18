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

import type { HvEChartsOption } from "../types/common";

interface HvDataZoomHookProps {
  showHorizontal?: boolean;
}

export const useDataZoom = ({
  showHorizontal = false,
}: HvDataZoomHookProps) => {
  const option = useMemo<Pick<HvEChartsOption, "dataZoom">>(() => {
    return {
      dataZoom: showHorizontal
        ? [
            {
              show: true,
              type: "slider",
              orient: "horizontal",
            },
            {
              show: true,
              type: "inside",
              orient: "horizontal",
              zoomOnMouseWheel: "shift",
              moveOnMouseWheel: true,
            },
          ]
        : [],
    };
  }, [showHorizontal]);

  return option;
};
