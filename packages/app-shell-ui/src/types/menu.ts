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
import type { MenuItem } from "@hitachivantara/app-shell-shared";

export interface NavigationMenuItem extends Omit<MenuItem, "icon" | "data"> {
  icon?: React.ReactNode;
  data?: NavigationMenuItem[];
}

export interface MenuItemsContext {
  items: NavigationMenuItem[];
  selectedMenuItemId: string | undefined;
  rootMenuItemId: string | undefined;
}
