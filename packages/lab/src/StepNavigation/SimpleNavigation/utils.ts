import { theme } from "@hitachivantara/uikit-styles";

import type { HvStepProps } from "../DefaultNavigation";

export const dotSizes = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
};

export const getColor = (state: HvStepProps["state"]) =>
  state === "Disabled" ? theme.colors.textDisabled : theme.colors.text;
