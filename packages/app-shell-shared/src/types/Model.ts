import type {
  ServiceId,
  ServiceProviderConfig,
} from "@hitachivantara/app-shell-services";

import {
  HvAppShellConditionConfig,
  HvAppShellConfig,
  HvAppShellHeader,
  HvAppShellHeaderAction,
  HvAppShellMainPanelConfig,
  HvAppShellMenuConfig,
  HvAppShellProvidersConfig,
  HvAppShellSystemProvidersConfig,
  HvAppShellViewsConfig,
  ViewHvContainerProps,
} from "./Config";

export type PreloadedBundles = Map<string, unknown>;

// Condition model with globalIndex being a unique number for each condition in the config and used in results lookup
export interface HvAppShellConditionModel extends HvAppShellConditionConfig {
  globalIndex: number;
}

export interface HvAppShellConditionalModel {
  key: string;
  conditions?: HvAppShellConditionModel[];
}

export interface HvAppShellMenuModel
  extends HvAppShellConditionalModel,
    Omit<HvAppShellMenuConfig, "conditions" | "submenus"> {
  submenus?: HvAppShellMenuModel[];
}

export interface HvAppShellViewsModel
  extends HvAppShellConditionalModel,
    Omit<HvAppShellViewsConfig, "conditions" | "views"> {
  views: HvAppShellViewsModel[];
}

export interface HvAppShellTopViewModel
  extends HvAppShellViewsModel,
    Omit<ViewHvContainerProps, "key"> {}

export interface HvAppShellHeaderActionModel
  extends HvAppShellConditionalModel,
    Omit<HvAppShellHeaderAction, "conditions"> {}

export type HvAppShellSystemProvidersModel = HvAppShellSystemProvidersConfig & {
  key: string;
};

export interface HvAppShellProvidersModel
  extends HvAppShellConditionalModel,
    Omit<HvAppShellProvidersConfig, "conditions"> {}

export type HvAppShellServiceProviderModel = HvAppShellConditionalModel &
  ServiceProviderConfig;

export type HvAppShellServicesModel = Record<
  ServiceId,
  HvAppShellServiceProviderModel[]
>;

export interface HvAppShellMainPanelModel
  extends Omit<HvAppShellMainPanelConfig, "views"> {
  views?: HvAppShellTopViewModel[];
}

export interface HvAppShellHeaderModel
  extends Omit<HvAppShellHeader, "actions"> {
  actions: HvAppShellHeaderActionModel[];
}

export interface HvAppShellModel
  extends Omit<
    HvAppShellConfig,
    | "menu"
    | "mainPanel"
    | "header"
    | "systemProviders"
    | "providers"
    | "services"
  > {
  menu?: HvAppShellMenuModel[];
  mainPanel?: HvAppShellMainPanelModel;
  header?: HvAppShellHeaderModel;
  systemProviders?: HvAppShellSystemProvidersModel[];
  providers?: HvAppShellProvidersModel[];
  services?: HvAppShellServicesModel;
  /** All conditions present in the model, indexed by globalIndex */
  allConditions: HvAppShellConditionModel[];
  /** All preloaded bundles (conditions and providers) */
  preloadedBundles: PreloadedBundles;
}
