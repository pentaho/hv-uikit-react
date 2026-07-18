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
import type { HvThemeStructure } from "@hitachivantara/uikit-styles";

/** This type allows to pass undetermined extra props to components recursively */
type HvExtraDeepProps<T> = {
  [P in keyof T]: T[P] & Record<string, any>;
} & Record<string, any>;

/**
 * Theme structure
 */
export type HvTheme = HvExtraDeepProps<HvThemeStructure>;
