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
import type { HvChartLegend, HvChartLegendIcon } from "../types/legend";
import { getLegendIcon } from "../utils";

interface HvLegendHookProps {
  show?: HvChartLegend["show"];
  direction?: HvChartLegend["direction"];
  position?: HvChartLegend["position"];
  series?: Pick<HvEChartsOption, "series.series">;
  icon?: HvChartLegendIcon;
  formatter?: string | ((value?: string) => string);
}

export const useLegend = ({
  series,
  show,
  icon,
  formatter,
  position: positionProp,
  direction = "horizontal",
}: HvLegendHookProps) => {
  const option = useMemo<Pick<HvEChartsOption, "legend">>(() => {
    const position: Record<string, string> = {
      y: positionProp?.y ?? "top",
      x: positionProp?.x ?? "center",
    };

    return {
      legend: {
        show: show ?? (Array.isArray(series) && series.length > 1),
        itemGap: 20,
        formatter,
        orient: direction,
        ...position,
        ...(icon && { icon: getLegendIcon(icon) }),
        ...(!icon && {
          data:
            show !== false && Array.isArray(series)
              ? series.map((s) => {
                  let iconType: HvChartLegendIcon = "line";
                  if (s.areaStyle != null) {
                    iconType = "square";
                  }
                  if (s.type === "scatter") {
                    iconType = "circle";
                  }
                  return {
                    name: s.name as string,
                    icon: getLegendIcon(iconType),
                  };
                })
              : undefined,
        }),
      },
    };
  }, [series, show, icon, formatter, positionProp, direction]);

  return option;
};
