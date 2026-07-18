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

import type { HvStepProps } from "./Step";

export const getColor = (state: HvStepProps["state"]) =>
  ({
    Pending: theme.colors.warning ?? "warning",
    Failed: theme.colors.negative ?? "negative",
    Completed: theme.colors.positive ?? "positive",
    Current: theme.colors.text ?? "text",
    Disabled: theme.colors.textDisabled ?? "textDisabled",
    Enabled: theme.colors.text ?? "text",
  })[state];

export const getSemantic = (state: HvStepProps["state"]) =>
  ({
    Pending: "warning",
    Failed: "negative",
    Completed: "positive",
    Current: "text",
    Disabled: "textDisabled",
    Enabled: "text",
  })[state];

const EXTRA_SMALL = { container: 32, avatar: 24 };
const SMALL = { container: 40, avatar: 32 };
const MEDIUM = { container: 48, avatar: 40 };
const LARGE = { container: 60, avatar: 52 };
const EXTRA_LARGE = { container: 96, avatar: 88 };

export const stepSizes = {
  xs: EXTRA_SMALL,
  sm: SMALL,
  md: MEDIUM,
  lg: LARGE,
  xl: EXTRA_LARGE,
};
