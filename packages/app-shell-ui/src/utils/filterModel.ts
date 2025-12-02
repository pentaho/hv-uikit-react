import {
  HvAppShellConditionModel,
  HvAppShellHeaderActionModel,
  HvAppShellMenuModel,
  HvAppShellModel,
  HvAppShellProvidersModel,
  HvAppShellServiceProviderModel,
  HvAppShellServicesModel,
  HvAppShellViewsModel,
} from "@hitachivantara/app-shell-shared";

import type { ConditionResultsList } from "../hooks/useConditionsEvaluator";

const shouldInclude = (
  conditions: HvAppShellConditionModel[] | undefined,
  conditionResults: ConditionResultsList,
): boolean => {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  for (const condition of conditions) {
    if (!conditionResults[condition.globalIndex]) {
      return false;
    }
  }

  return true;
};

const filterViews = (
  views: HvAppShellViewsModel[],
  conditionResults: ConditionResultsList,
): [HvAppShellViewsModel[], boolean] => {
  const filteredViews: HvAppShellViewsModel[] = [];
  let hasChanged = false;

  for (const view of views) {
    const include = shouldInclude(view.conditions, conditionResults);

    if (!include) {
      hasChanged = true;
      continue;
    }

    if (!view.views) {
      filteredViews.push(view);
      continue;
    }

    const [filteredSubViews, subViewsChanged] = filterViews(
      view.views,
      conditionResults,
    );

    if (subViewsChanged) {
      filteredViews.push({ ...view, views: filteredSubViews });
      hasChanged = true;
    } else {
      filteredViews.push(view);
    }
  }

  return [hasChanged ? filteredViews : views, hasChanged];
};

const filterMenus = (
  menus: HvAppShellMenuModel[],
  conditionResults: ConditionResultsList,
): [HvAppShellMenuModel[], boolean] => {
  const filteredMenus: HvAppShellMenuModel[] = [];
  let hasChanged = false;

  for (const menu of menus) {
    const include = shouldInclude(menu.conditions, conditionResults);

    if (!include) {
      hasChanged = true;
      continue;
    }

    if (!menu.submenus) {
      filteredMenus.push(menu);
      continue;
    }

    const [filteredSubmenus, submenusChanged] = filterMenus(
      menu.submenus,
      conditionResults,
    );

    // Keep parent only if it has visible children
    if (filteredSubmenus.length === 0) {
      hasChanged = true;
      continue;
    }

    if (submenusChanged) {
      filteredMenus.push({
        ...menu,
        submenus: filteredSubmenus,
      });
      hasChanged = true;
    } else {
      filteredMenus.push(menu);
    }
  }

  return [hasChanged ? filteredMenus : menus, hasChanged];
};

const filterActions = (
  actions: HvAppShellHeaderActionModel[],
  conditionResults: ConditionResultsList,
): [HvAppShellHeaderActionModel[], boolean] => {
  const filteredHeaderActions: HvAppShellHeaderActionModel[] = [];

  for (const action of actions) {
    const include = shouldInclude(action.conditions, conditionResults);
    if (include) filteredHeaderActions.push(action);
  }

  const hasChanged = filteredHeaderActions.length !== actions.length;

  return [hasChanged ? filteredHeaderActions : actions, hasChanged];
};

const filterProviders = (
  providers: HvAppShellProvidersModel[],
  conditionResults: ConditionResultsList,
): [HvAppShellProvidersModel[], boolean] => {
  const filteredProviders: HvAppShellProvidersModel[] = [];

  for (const provider of providers) {
    const include = shouldInclude(provider.conditions, conditionResults);
    if (include) filteredProviders.push(provider);
  }

  const hasChanged = filteredProviders.length !== providers.length;

  return [hasChanged ? filteredProviders : providers, hasChanged];
};

const filterServices = (
  services: HvAppShellServicesModel,
  conditionResults: ConditionResultsList,
): [HvAppShellServicesModel, boolean] => {
  if (!services) {
    return [services, false];
  }

  const filteredServices: HvAppShellServicesModel = {};

  let hasChanged = false;

  for (const [serviceId, serviceProviderModels] of Object.entries(services)) {
    const result: HvAppShellServiceProviderModel[] = [];
    let localChanged = false;

    for (const serviceConfigModel of serviceProviderModels) {
      const include = shouldInclude(
        serviceConfigModel.conditions,
        conditionResults,
      );
      if (include) {
        result.push(serviceConfigModel);
      } else {
        localChanged = true;
      }
    }

    if (localChanged) hasChanged = true;

    filteredServices[serviceId] = localChanged ? result : serviceProviderModels;
  }

  return [hasChanged ? filteredServices : services, hasChanged];
};

// Filter model based on condition results. Preserves object references when possible to minimize re-renders
export default function filterModel(
  model: HvAppShellModel,
  conditionResults: ConditionResultsList,
): HvAppShellModel {
  let hasChanged = false;

  const filtered: HvAppShellModel = { ...model };

  if (model.mainPanel?.views) {
    const [filteredViews, viewsChanged] = filterViews(
      model.mainPanel.views,
      conditionResults,
    );

    if (viewsChanged) {
      filtered.mainPanel = {
        ...model.mainPanel,
        views: filteredViews,
      };
      hasChanged = true;
    }
  }

  if (model.menu) {
    const [filteredMenus, menusChanged] = filterMenus(
      model.menu,
      conditionResults,
    );

    if (menusChanged) {
      filtered.menu = filteredMenus;
      hasChanged = true;
    }
  }

  if (model.header?.actions) {
    const [filteredActions, actionsChanged] = filterActions(
      model.header.actions,
      conditionResults,
    );

    if (actionsChanged) {
      filtered.header = {
        ...model.header,
        actions: filteredActions,
      };
      hasChanged = true;
    }
  }

  if (model.providers) {
    const [filteredProviders, providersChanged] = filterProviders(
      model.providers,
      conditionResults,
    );

    if (providersChanged) {
      filtered.providers = filteredProviders;
      hasChanged = true;
    }
  }

  if (model.services) {
    const [filteredServices, servicesChanged] = filterServices(
      model.services,
      conditionResults,
    );

    if (servicesChanged) {
      filtered.services = filteredServices;
      hasChanged = true;
    }
  }

  return hasChanged ? filtered : model;
}
