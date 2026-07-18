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
export interface HvListValue extends Record<string, any> {
  id?: string | number;
  label: React.ReactNode;
  searchValue?: string;
  selected?: boolean;
  disabled?: boolean;
  isHidden?: boolean;
  icon?:
    | React.ReactNode
    | ((params: {
        isDisabled?: boolean;
        isSelected?: boolean;
      }) => React.ReactNode);
  showNavIcon?: boolean;
  path?: string;
  params?: object;
  tabIndex?: number;
  /** Whether to show a separator after this list item */
  separator?: boolean;
}
