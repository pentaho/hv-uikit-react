import { useContext, useEffect, useMemo, useState } from "react";
import { I18nContext } from "react-i18next";
import {
  HvAppShellCombinedProvidersContext,
  HvAppShellContext,
  HvAppShellModelContext,
  HvAppShellRuntimeContext,
  type HvAppShellConfig,
  type HvAppShellModel,
  type HvAppShellProvidersComponent,
} from "@hitachivantara/app-shell-shared";
import {
  themes as baseThemes,
  HvProvider,
} from "@hitachivantara/uikit-react-core";
import type {
  HvThemeColorMode,
  HvThemeStructure,
} from "@hitachivantara/uikit-styles";

import { useFilteredModel } from "../../hooks/useFilteredModel";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useModelFromConfig } from "../../hooks/useModelFromConfig";
import CombinedProviders from "../../utils/CombinedProviders";

interface AppShellProviderInnerProps extends React.PropsWithChildren {
  config: HvAppShellConfig;
  model: HvAppShellModel;
}

const AppShellProviderInner = ({
  config: configProp,
  model,
  children,
}: AppShellProviderInnerProps) => {
  const { value: storedColorModeValue } = useLocalStorage("COLOR_MODE");

  const { isPending: isModelPending, model: filteredModel } =
    useFilteredModel(model);

  const [theme, setTheme] = useState<HvThemeStructure>();

  useEffect(() => {
    const newTheme = filteredModel?.theming?.theme as keyof typeof baseThemes;
    if (!newTheme) return;

    if (baseThemes[newTheme]) {
      setTheme(baseThemes[newTheme]);
      return;
    }

    import(/* @vite-ignore */ newTheme)
      .then((module) => {
        setTheme(module.default);
      })
      .catch((e) => {
        console.error(`Import of theme bundle ${newTheme} failed! ${e}`);
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

  const providersContext = useMemo(
    () => ({
      providers,
    }),
    [providers],
  );

  const appShellConfigContextValue = useMemo(() => configProp, [configProp]);

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
        <HvProvider
          theme={theme}
          colorMode={
            (storedColorModeValue as HvThemeColorMode) ??
            filteredModel.theming?.colorMode
          }
        >
          <HvAppShellCombinedProvidersContext.Provider value={providersContext}>
            {children}
          </HvAppShellCombinedProvidersContext.Provider>
        </HvProvider>
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
  const { i18n } = useContext(I18nContext);

  const runtimeContext = useMemo(() => ({ i18n }), [i18n]);

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
    <HvAppShellRuntimeContext.Provider value={runtimeContext}>
      <CombinedProviders providers={systemProviders}>
        <AppShellProviderInner config={configProp} model={model}>
          {children}
        </AppShellProviderInner>
      </CombinedProviders>
    </HvAppShellRuntimeContext.Provider>
  );
}
