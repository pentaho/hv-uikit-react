import { PropsWithChildren, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  HvAppShellContext,
  HvAppShellRuntimeContext,
  useHvAppShellConfig,
  useHvAppShellModel,
} from "@hitachivantara/app-shell-shared";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import { addResourceBundles, createI18Next } from "./i18n";

interface TestProviderProps extends PropsWithChildren {
  bundles?: Record<string, object>;
}

const TestProvider = ({ children, bundles = {} }: TestProviderProps) => {
  const config = useHvAppShellConfig();
  const model = useHvAppShellModel();
  const { i18n } = createI18Next();
  if (bundles) {
    addResourceBundles(i18n, bundles, CONFIG_TRANSLATIONS_NAMESPACE);
  }
  return useMemo(() => {
    return (
      <HvProvider>
        <HvAppShellRuntimeContext.Provider value={{ i18n }}>
          <HvAppShellContext.Provider value={{ config, model }}>
            <ErrorBoundary fallback={<div>Generic Error</div>}>
              <BrowserRouter basename="/">{children}</BrowserRouter>
            </ErrorBoundary>
          </HvAppShellContext.Provider>
        </HvAppShellRuntimeContext.Provider>
      </HvProvider>
    );
  }, [children, i18n, config, model]);
};

export default TestProvider;
