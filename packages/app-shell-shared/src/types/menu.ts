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
import type { HvAppShellIcon } from "./Config";

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  data?: MenuItem[];
  icon?: HvAppShellIcon;
  parent?: MenuItem;
}

export interface MenuItemsContext {
  items: MenuItem[];
  selectedMenuItemId: string | undefined;
  rootMenuItemId: string | undefined;
}
