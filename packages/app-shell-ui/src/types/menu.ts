import type { MenuItem } from "@pentaho/app-shell-shared";

export interface NavigationMenuItem extends Omit<MenuItem, "icon" | "data"> {
  icon?: React.ReactNode;
  data?: NavigationMenuItem[];
}

export interface MenuItemsContext {
  items: NavigationMenuItem[];
  selectedMenuItemId: string | undefined;
  rootMenuItemId: string | undefined;
}
