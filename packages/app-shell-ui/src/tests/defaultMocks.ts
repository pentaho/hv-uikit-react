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
// eslint-disable-next-line import/no-extraneous-dependencies
import { vi } from "vitest";

import type { NavigationContextValue } from "../providers/NavigationProvider";

const useNavigationContextDefaultMock: NavigationContextValue = {
  selectedMenuItemId: undefined,
  rootMenuItemId: undefined,
  items: [],
  verticalNavigationItems: [],
  hasVerticalNavigation: false,
  showHeaderSubMenu: false,
  isCompactMode: false,
  verticalNavigationMode: "EXPANDED",
  switchVerticalNavigationMode: vi.fn,
};

export default useNavigationContextDefaultMock;
