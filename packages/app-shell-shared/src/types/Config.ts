import type { ServicesConfig as HvAppShellServicesConfig } from "@hitachivantara/app-shell-services";
import type {
  HvBaseTheme,
  HvContainerProps,
  HvThemeColorMode,
} from "@hitachivantara/uikit-react-core";

export type { HvAppShellServicesConfig };

type ViewHvContainerProps = Omit<HvContainerProps, "children">;

export type HvAppShellLogo = {
  name?: "LUMADA" | "HITACHI" | "PENTAHO+" | "PENTAHO";
  description?: string;
};

export type HvAppShellIcon = {
  iconType: "uikit";
  name: string;
};

export type HvAppShellMenuConfig = {
  label: string;
  icon?: HvAppShellIcon;
  target?: string;
  submenus?: HvAppShellMenuConfig[];
};

type RouteString = `/${string}`;

export type HvAppShellViewsConfig = {
  bundle: string;
  route: RouteString;
  config?: Record<string, unknown>;
  views?: HvAppShellViewsConfig[];
};

export interface HvAppShellTopViewConfig
  extends HvAppShellViewsConfig,
    ViewHvContainerProps {}

export type HvAppShellHelp = {
  url: string;
  description?: string;
};

export interface HvAppShellMainPanelConfig extends ViewHvContainerProps {
  views?: HvAppShellTopViewConfig[];
}

export type HvAppShellProvidersConfig = {
  bundle: string;
  config?: Record<string, unknown>;
};

export type HvAppShellConfig = {
  baseUrl?: string;
  name?: string;
  logo?: HvAppShellLogo | null;
  apps?: Record<string, string>;
  menu?: HvAppShellMenuConfig[];
  translations?: Record<string, object>;
  navigationMode?: "TOP_AND_LEFT" | "ONLY_TOP" | "ONLY_LEFT";
  mainPanel?: HvAppShellMainPanelConfig;
  theming?: HvAppShellThemingConfig;
  header?: HvAppShellHeader;
  providers?: HvAppShellProvidersConfig[];
  services?: HvAppShellServicesConfig;
};

export type HvAppShellThemingConfig = {
  theme?: HvBaseTheme | (string & {});
  colorMode?: HvThemeColorMode;
};

export type HvAppShellAppSwitcherConfig = {
  title?: string;
  showLogo?: boolean;
  apps: HvAppShellAppSwitcherItemConfig[];
};

export type HvAppShellAppSwitcherItemConfig = {
  label: string;
  description?: string;
  url: string;
  target: "NEW" | "SELF";
  icon?: HvAppShellIcon;
};

export type HvAppShellHeader = {
  actions: HvAppShellHeaderAction[];
};

export type HvAppShellHeaderAction = {
  bundle: string;
  config?:
    | HvAppShellHelp
    | HvAppShellAppSwitcherConfig
    | Record<string, unknown>;
};
