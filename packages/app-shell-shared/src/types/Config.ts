import type {
  ServiceId,
  ServiceProviderConfig,
} from "@hitachivantara/app-shell-services";
import type {
  HvBaseTheme,
  HvContainerProps,
  HvThemeColorMode,
} from "@hitachivantara/uikit-react-core";

export interface ViewHvContainerProps
  extends Omit<HvContainerProps, "children"> {}

export interface HvAppShellConditionConfig {
  bundle: string;
  config?: Record<string, unknown>;
}

export interface HvAppShellConditionalConfig {
  conditions?: HvAppShellConditionConfig[];
}

// Extend ServiceConfig to add conditions at the App Shell level
export type HvAppShellServiceProviderConfig = ServiceProviderConfig &
  HvAppShellConditionalConfig;

// App Shell's version of ServicesConfig with condition support
export interface HvAppShellServicesConfig
  extends Record<ServiceId, HvAppShellServiceProviderConfig[]> {}

export interface HvAppShellLogo {
  name?: "LUMADA" | "HITACHI" | "PENTAHO+" | "PENTAHO";
  description?: string;
}

export interface HvAppShellIcon {
  iconType: "uikit";
  name: string;
}

export interface HvAppShellMenuConfig extends HvAppShellConditionalConfig {
  label: string;
  icon?: HvAppShellIcon;
  target?: string;
  submenus?: HvAppShellMenuConfig[];
}

type RouteString = `/${string}`;

export interface HvAppShellViewsConfig extends HvAppShellConditionalConfig {
  bundle: string;
  route: RouteString;
  config?: Record<string, unknown>;
  views?: HvAppShellViewsConfig[];
}

export interface HvAppShellTopViewConfig
  extends HvAppShellViewsConfig,
    ViewHvContainerProps {}

export interface HvAppShellHelp {
  url: string;
  description?: string;
}

export interface HvAppShellMainPanelConfig extends ViewHvContainerProps {
  views?: HvAppShellTopViewConfig[];
}

export interface HvAppShellProvidersBaseConfig {
  bundle: string;
  config?: Record<string, unknown>;
}

export interface HvAppShellSystemProvidersConfig
  extends HvAppShellProvidersBaseConfig {}

export interface HvAppShellProvidersConfig
  extends HvAppShellProvidersBaseConfig,
    HvAppShellConditionalConfig {}

export interface HvAppShellConfig {
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
  systemProviders?: HvAppShellSystemProvidersConfig[];
  providers?: HvAppShellProvidersConfig[];
  services?: HvAppShellServicesConfig;
}

export type HvAppShellThemingConfig = {
  theme?: HvBaseTheme | (string & {});
  colorMode?: HvThemeColorMode;
};

export interface HvAppShellAppSwitcherConfig {
  title?: string;
  showLogo?: boolean;
  apps: HvAppShellAppSwitcherItemConfig[];
}

export interface HvAppShellAppSwitcherItemConfig {
  label: string;
  description?: string;
  url: string;
  target: "NEW" | "SELF";
  icon?: HvAppShellIcon;
}

export interface HvAppShellHeader {
  actions: HvAppShellHeaderAction[];
}

export interface HvAppShellHeaderAction extends HvAppShellConditionalConfig {
  bundle: string;
  config?:
    | HvAppShellHelp
    | HvAppShellAppSwitcherConfig
    | Record<string, unknown>;
}
