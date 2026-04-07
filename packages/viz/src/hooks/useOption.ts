import { useMemo } from "react";

import type { HvChartCommonProps, HvEChartsOption } from "../types/common";

interface HvOptionHookProps {
  option: HvEChartsOption;
  onOptionChange?: HvChartCommonProps["onOptionChange"];
}

export const useOption = ({
  option: optionProp,
  onOptionChange,
}: HvOptionHookProps) => {
  const option = useMemo<HvEChartsOption>(() => {
    // Common properties to all charts
    const baseOption = {
      aria: {
        enabled: true,
      },
      animation: false,
    };

    const opt = { ...baseOption, ...optionProp };

    return onOptionChange ? onOptionChange(opt) : opt;
  }, [onOptionChange, optionProp]);

  return option;
};
