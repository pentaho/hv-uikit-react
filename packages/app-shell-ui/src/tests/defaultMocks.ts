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
