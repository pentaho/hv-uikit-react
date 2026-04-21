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
