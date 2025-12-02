import { useContext, useEffect, useMemo, useState } from "react";
import { I18nContext } from "react-i18next";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  HvAppShellCombinedProvidersContext,
  HvAppShellContext,
  HvAppShellProvidersComponent,
  HvAppShellRuntimeContext,
  type HvAppShellConfig,
  type HvAppShellModel,
} from "@hitachivantara/app-shell-shared";
import {
  themes as baseThemes,
  HvProvider,
  HvProviderProps,
} from "@hitachivantara/uikit-react-core";

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

  const [themes, setThemes] = useState<HvProviderProps["themes"]>(undefined);

  useEffect(() => {
    if (filteredModel?.theming?.themes) {
      Promise.all(
        filteredModel.theming.themes.map(async (bundle: string) => {
          const baseTheme = baseThemes[bundle as keyof typeof baseThemes];

          if (baseTheme) {
            return baseTheme;
          }

          try {
            const module = await import(/* @vite-ignore */ bundle);
            return module.default;
          } catch (e) {
            console.error(`Import of theme bundle ${bundle} failed! ${e}`);
            return null;
          }
        }),
      )
        .then((loadedThemes) => {
          setThemes(loadedThemes.filter((theme) => !!theme));
        })
        .catch((e) => {
          console.error(`Import of themes failed! ${e}`);
        });
    }
  }, [filteredModel?.theming?.themes]);

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

  const appShellContextValue = useMemo(
    () => ({
      config,
      model: filteredModel!,
    }),
    [config, filteredModel],
  );

  if (
    isModelPending ||
    !filteredModel ||
    (filteredModel.theming?.themes && !themes)
  ) {
    return null;
  }

  return (
    <HvAppShellContext.Provider value={appShellContextValue}>
      <HvAppShellRuntimeContext.Provider value={runtimeContext}>
        <HvProvider
          themes={themes}
          theme={filteredModel.theming?.theme}
          colorMode={storedColorModeValue ?? filteredModel.theming?.colorMode}
        >
          <HvAppShellCombinedProvidersContext.Provider value={providersContext}>
            {children}
          </HvAppShellCombinedProvidersContext.Provider>
        </HvProvider>
      </HvAppShellRuntimeContext.Provider>
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
  const [loadedConfig, setLoadedConfig] = useState<
    HvAppShellConfig | undefined
  >(undefined);
  const [hasError, setHasError] = useState<boolean>(false);

  // Load config from URL
  useEffect(() => {
    if (!localConfig && configUrl) {
      fetch(new URL(configUrl))
        .then((result) => result.json())
        .then((data) => setLoadedConfig(data))
        .catch((e) => {
          console.error(
            `It was not possible to obtain the context from: ${configUrl}`,
            e,
          );
          setLoadedConfig(undefined);
          setHasError(true);
        });
    }
  }, [localConfig, configUrl]);

  const rawConfig = useMemo(
    () => localConfig ?? loadedConfig,
    [localConfig, loadedConfig],
  );

  // Store the config once it's loaded
  const [initialConfig, setInitialConfig] = useState<
    HvAppShellConfig | undefined
  >(undefined);

  useEffect(() => {
    if (rawConfig && !initialConfig) {
      setInitialConfig(rawConfig);
    }
  }, [rawConfig, initialConfig]);

  const { model, isPending: areBundlesLoading } =
    useModelFromConfig(initialConfig);

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
    throw new Error("It was not possible to obtain the configuration");
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
