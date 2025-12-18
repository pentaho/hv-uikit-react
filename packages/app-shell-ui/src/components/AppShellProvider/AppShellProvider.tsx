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

const AppShellProvider = ({
  children,
  config: localConfig,
  configUrl,
}: AppShellProviderProps) => {
  const [loadedConfig, setLoadedConfig] = useState<HvAppShellConfig>();
  const [hasError, setHasError] = useState(false);

  // Load config from URL
  useEffect(() => {
    if (!localConfig && configUrl) {
      fetch(new URL(configUrl))
        .then((result) => result.json())
        .then((data) => setLoadedConfig(data))
        .catch((e) => {
          console.error(`Failed to obtain the context from: ${configUrl}`, e);
          setLoadedConfig(undefined);
          setHasError(true);
        });
    }
  }, [localConfig, configUrl]);

  const rawConfig = useMemo(
    () => localConfig ?? loadedConfig,
    [localConfig, loadedConfig],
  );
  const { model, isPending: areBundlesLoading } = useModelFromConfig(rawConfig);

  const systemProviders = useMemo(() => {
    if (!model?.systemProviders) {
      return undefined;
    }

    const providersComponents: HvAppShellProvidersComponent[] = [];

    for (const provider of model.systemProviders) {
      const component = model.preloadedBundles.get(
        provider.bundle,
      ) as React.ComponentType<React.PropsWithChildren>;

      providersComponents.push({
        key: provider.key,
        component,
        config: provider.config,
      });
    }

    return providersComponents;
  }, [model?.systemProviders, model?.preloadedBundles]);

  if (hasError) {
    throw Error("Failed to obtain the configuration");
  }

  // Wait for config and condition bundles to load
  if (!rawConfig || !model || areBundlesLoading) {
    return null;
  }

  return (
    <CombinedProviders providers={systemProviders}>
      <AppShellProviderInner config={rawConfig} model={model}>
        {children}
      </AppShellProviderInner>
    </CombinedProviders>
  );
};

export default AppShellProvider;
