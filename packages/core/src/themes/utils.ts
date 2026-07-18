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
import type { CSSObject } from "@emotion/serialize";

export type CSSClasses<Props> = Partial<Omit<Props, "classes">> & {
  classes?: Props extends { classes?: Record<string, any> }
    ? { [K in keyof NonNullable<Props["classes"]>]: CSSObject }
    : never;
};
