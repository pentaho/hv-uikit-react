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
export interface HvKnobProperty {
  color?: string;
  defaultValue?: number;
  hidden?: boolean;
  fixed?: boolean;
  hoverColor?: string;
  trackColor?: string;
  dragColor?: string;
}

export interface HvMarkProperty {
  position?: number;
  label?: string;
}
