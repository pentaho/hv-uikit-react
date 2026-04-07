import type { HvColorAny } from "@hitachivantara/uikit-styles";

import { HvIcon } from "../icons";
import type { HvCalloutVariant } from "./Callout";

const variantIconMap = {
  success: "Success",
  warning: "Caution",
  error: "Fail",
  info: "Info",
} as const;

export const iconVariant = (variant: HvCalloutVariant, color?: HvColorAny) => {
  if (variant === "default" || variant === "accent") return null;

  return <HvIcon name={variantIconMap[variant]} color={color} />;
};
