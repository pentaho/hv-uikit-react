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
