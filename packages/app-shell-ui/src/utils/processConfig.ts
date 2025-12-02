import {
  HvAppShellConditionalConfig,
  HvAppShellConditionalModel,
  HvAppShellConditionModel,
  HvAppShellConfig,
  HvAppShellHeaderActionModel,
  HvAppShellMenuConfig,
  HvAppShellMenuModel,
  HvAppShellModel,
  HvAppShellProvidersModel,
  HvAppShellServiceProviderModel,
  HvAppShellServicesModel,
  HvAppShellViewsConfig,
  HvAppShellViewsModel,
} from "@hitachivantara/app-shell-shared";

// Generate a unique key for internal tracking
const generateKey = (): string => {
  return `${Date.now()}-${Math.round(1000 * Math.random())}`;
};

// Create a map of route -> conditions from views for menu inheritance
const createRouteConditionsMap = (
  views: HvAppShellViewsModel[],
): Map<string, HvAppShellConditionModel[]> => {
  const map = new Map<string, HvAppShellConditionModel[]>();

  const processView = (view: HvAppShellViewsModel) => {
    if (view.route && view.conditions) {
      const normalizedRoute = view.route.replace(/^\//, "");
      map.set(normalizedRoute, view.conditions);
    }
    if (view.views) {
      for (const nestedView of view.views) {
        processView(nestedView);
      }
    }
  };

  for (const view of views) {
    processView(view);
  }
  return map;
};

// Merges both explicit menu conditions and inherited view conditions using AND logic (inheritance logic)
const applyViewConditionsToMenus = (
  menus: HvAppShellMenuModel[],
  routeConditionsMap: Map<string, HvAppShellConditionModel[]>,
): HvAppShellMenuModel[] => {
  return menus.map((menu) => {
    let updatedMenu: HvAppShellMenuModel = menu;

    // If menu has a target, inherit conditions from matching view
    if (menu.target) {
      const normalizedTarget = menu.target.replace(/^\//, "");
      const viewConditions = routeConditionsMap.get(normalizedTarget);

      if (viewConditions) {
        // Merge explicit menu conditions with inherited view conditions
        // Reuse the same condition instances (same globalIndex)
        const mergedConditions = [
          ...(menu.conditions || []),
          ...viewConditions,
        ];

        if (mergedConditions.length > 0) {
          updatedMenu = { ...menu, conditions: mergedConditions };
        }
      }
    }

    if (menu.submenus) {
      const updatedSubmenus = applyViewConditionsToMenus(
        menu.submenus,
        routeConditionsMap,
      );

      if (updatedSubmenus !== menu.submenus) {
        updatedMenu = { ...updatedMenu, submenus: updatedSubmenus };
      }
    }

    return updatedMenu;
  });
};

/**
 * Process App Shell config into AppShellModel and adds key properties and globalIndex to conditions
 * Returns AppShellModel with internal configuration logic
 */
export default function processConfig(
  appShellConfig: HvAppShellConfig,
): HvAppShellModel {
  let globalIndex = 0;
  const allConditions: HvAppShellConditionModel[] = [];

  // Helper to add key and process conditions
  const registerElement = <
    T extends HvAppShellConditionalConfig,
    P extends HvAppShellConditionalModel,
  >(
    configElement: T,
  ): P => {
    const key = generateKey();

    const conditions = configElement.conditions?.map((condConfig) => {
      const conditionModel: HvAppShellConditionModel = {
        ...condConfig,
        globalIndex: globalIndex++,
      };
      allConditions.push(conditionModel);
      return conditionModel;
    });

    return {
      ...configElement,
      key,
      ...(conditions && { conditions }),
    } as unknown as P;
  };

  const processViews = (
    viewsConfig?: HvAppShellViewsConfig[],
  ): HvAppShellViewsModel[] => {
    if (!viewsConfig) {
      return [];
    }

    return viewsConfig.map((viewConfig) => {
      const viewModel = registerElement<
        typeof viewConfig,
        HvAppShellViewsModel
      >(viewConfig);
      if (viewConfig.views) {
        return {
          ...viewModel,
          views: processViews(viewConfig.views),
        };
      }
      return viewModel;
    });
  };

  const processMenus = (
    menusConfig?: HvAppShellMenuConfig[],
  ): HvAppShellMenuModel[] => {
    if (!menusConfig) {
      return [];
    }

    return menusConfig.map((menuConfig) => {
      const menuModel = registerElement<typeof menuConfig, HvAppShellMenuModel>(
        menuConfig,
      );
      if (menuConfig.submenus) {
        return {
          ...menuModel,
          submenus: processMenus(menuConfig.submenus),
        };
      }
      return menuModel;
    });
  };

  const config = { ...appShellConfig };

  // Process views first
  let viewsModel: HvAppShellViewsModel[] | undefined;
  if (appShellConfig.mainPanel?.views) {
    viewsModel = processViews(appShellConfig.mainPanel.views);
    config.mainPanel = {
      ...appShellConfig.mainPanel,
      views: viewsModel,
    };
  }

  // Process menus and apply view condition inheritance
  if (appShellConfig.menu) {
    let menusModel = processMenus(appShellConfig.menu);

    // Apply inheritance if we have views
    if (viewsModel) {
      const routeConditionsMap = createRouteConditionsMap(viewsModel);
      menusModel = applyViewConditionsToMenus(menusModel, routeConditionsMap);
    }

    config.menu = menusModel;
  }

  if (appShellConfig.header?.actions) {
    config.header = {
      ...appShellConfig.header,
      actions: appShellConfig.header.actions.map((action) =>
        registerElement<typeof action, HvAppShellHeaderActionModel>(action),
      ),
    };
  }

  if (appShellConfig.systemProviders) {
    config.systemProviders = appShellConfig.systemProviders.map((provider) => ({
      ...provider,
      key: generateKey(),
    }));
  }

  if (appShellConfig.providers) {
    config.providers = appShellConfig.providers.map((provider) =>
      registerElement<typeof provider, HvAppShellProvidersModel>(provider),
    );
  }

  if (appShellConfig.services) {
    const servicesModel: HvAppShellServicesModel = {};

    for (const [serviceId, configs] of Object.entries(
      appShellConfig.services,
    )) {
      servicesModel[serviceId] = configs.map((serviceConfig) =>
        registerElement<typeof serviceConfig, HvAppShellServiceProviderModel>(
          serviceConfig,
        ),
      );
    }

    config.services = servicesModel;
  }

  return Object.freeze({
    ...config,
    allConditions,
    preloadedBundles: new Map(),
  }) as HvAppShellModel;
}
