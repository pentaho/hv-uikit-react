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
