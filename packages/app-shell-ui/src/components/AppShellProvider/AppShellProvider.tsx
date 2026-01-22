import { useContext, useEffect, useMemo, useState } from "react";
import { I18nContext } from "react-i18next";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  HvAppShellCombinedProvidersContext,
  HvAppShellContext,
  HvAppShellModelContext,
  HvAppShellProvidersComponent,
  HvAppShellRuntimeContext,
  type HvAppShellConfig,
  type HvAppShellModel,
} from "@hitachivantara/app-shell-shared";
import {
  themes as baseThemes,
  HvProvider,
} from "@hitachivantara/uikit-react-core";
import {
  HvThemeColorMode,
  HvThemeStructure,
} from "@hitachivantara/uikit-styles";

import { useFilteredModel } from "../../hooks/useFilteredModel";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useModelFromConfig } from "../../hooks/useModelFromConfig";
import { addResourceBundles } from "../../i18n";
import CombinedProviders from "../../utils/CombinedProviders";

interface AppShellProviderInnerProps extends React.PropsWithChildren {
  config: HvAppShellConfig;
  model: HvAppShellModel;
}

const AppShellProviderInner = ({
  config,
  model,
  children,
}: AppShellProviderInnerProps) => {
  const { value: storedColorModeValue } = useLocalStorage("COLOR_MODE");
  const { i18n } = useContext(I18nContext);

  const { isPending: isModelPending, model: filteredModel } =
    useFilteredModel(model);

  if (filteredModel?.translations) {
    addResourceBundles(
      i18n,
      filteredModel.translations,
      CONFIG_TRANSLATIONS_NAMESPACE,
    );
  }

  const [theme, setTheme] = useState<HvThemeStructure>();

  useEffect(() => {
    const theme = filteredModel?.theming?.theme;
    if (!theme) return;

    if (baseThemes[theme as keyof typeof baseThemes]) {
      setTheme(baseThemes[theme as keyof typeof baseThemes]);
      return;
    }

    import(/* @vite-ignore */ theme)
      .then((module) => {
        setTheme(module.default);
      })
      .catch((e) => {
        console.error(`Import of theme bundle ${theme} failed! ${e}`);
      });
  }, [filteredModel?.theming?.theme]);

  const providers = useMemo(() => {
    if (!filteredModel?.providers) {
      return;
    }

    const providersComponents: HvAppShellProvidersComponent[] = [];

    for (const { bundle, key, config } of filteredModel.providers) {
      const component = model.preloadedBundles.get(
        bundle,
      ) as React.ComponentType<React.PropsWithChildren>;

      providersComponents.push({
        key,
        component,
        config,
      });
    }

    return providersComponents;
  }, [filteredModel?.providers, model.preloadedBundles]);

  const runtimeContext = useMemo(
    () => ({
      i18n,
    }),
    [i18n],
  );

  const providersContext = useMemo(
    () => ({
      providers,
    }),
    [providers],
  );

  const appShellConfigContextValue = useMemo(() => config, [config]);

  const appShellModelContextValue = useMemo(
    () => filteredModel,
    [filteredModel],
  );

  if (
    isModelPending ||
    !filteredModel ||
    (filteredModel.theming?.theme && !theme)
  ) {
    return null;
  }

  return (
    <HvAppShellContext.Provider value={appShellConfigContextValue}>
      <HvAppShellModelContext.Provider value={appShellModelContextValue}>
        <HvAppShellRuntimeContext.Provider value={runtimeContext}>
          <HvProvider
            theme={theme}
            colorMode={
              (storedColorModeValue as HvThemeColorMode) ??
              filteredModel.theming?.colorMode
            }
          >
            <HvAppShellCombinedProvidersContext.Provider
              value={providersContext}
            >
              {children}
            </HvAppShellCombinedProvidersContext.Provider>
          </HvProvider>
        </HvAppShellRuntimeContext.Provider>
      </HvAppShellModelContext.Provider>
    </HvAppShellContext.Provider>
  );
};

interface AppShellProviderProps extends React.PropsWithChildren {
  config?: Partial<HvAppShellConfig>;
  configUrl?: string;
}

export function HvAppShellProvider({
  children,
  config: configProp,
}: AppShellProviderProps) {
  const { model, isPending: areBundlesLoading } =
    useModelFromConfig(configProp);

  const systemProviders = useMemo(() => {
    if (!model?.systemProviders) return undefined;

    return model.systemProviders.map(({ key, bundle, config }) => ({
      key,
      component: model.preloadedBundles.get(bundle) as React.ComponentType,
      config,
    }));
  }, [model?.systemProviders, model?.preloadedBundles]);

  // Wait for config and condition bundles to load
  if (!configProp || !model || areBundlesLoading) {
    return null;
  }

  return (
    <CombinedProviders providers={systemProviders}>
      <AppShellProviderInner config={configProp} model={model}>
        {children}
      </AppShellProviderInner>
    </CombinedProviders>
  );
}
