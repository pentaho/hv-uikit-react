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

export interface HvConfusionMatrixColorScale {
  color: HvColorAny;
  label: string;
  max?: number;
  min?: number;
  value?: number;
}

export interface HvConfusionMatrixValuesProps {
  /** Whether to show the prediction values inside the confusion matrix or not. Defaults to `true`. */
  show?: boolean;
  /** Prediction values label color. */
  color?: HvColorAny;
  /** Prediction values label font style. */
  fontStyle?: "normal" | "italic";
  /** Prediction values label font weight. */
  fontWeight?: number;
  /** Prediction values label font size. */
  fontSize?: number;
}

export type HvConfusionMatrixFormat = "square" | "landscape";
