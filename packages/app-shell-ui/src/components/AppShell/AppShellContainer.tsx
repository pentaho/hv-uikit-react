import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { HvAppShellConfig } from "@hitachivantara/app-shell-shared";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import createI18Next from "../../i18n";
import GenericError from "../../pages/GenericError";
import { LayoutProvider } from "../../providers/LayoutProvider";
import { HvAppShellProvider } from "../AppShellProvider/AppShellProvider";
import GlobalStyles from "../GlobalStyles";
import SnackbarProvider from "../SnackbarProvider";
import type { HvAppShellProps } from "./AppShell";

const { i18n } = createI18Next();

export interface HvAppShellContainerProps
  extends React.PropsWithChildren,
    HvAppShellProps {}

export function HvAppShellContainer({
  config: configProp,
  configUrl,
  children,
}: HvAppShellContainerProps) {
  const [loadedConfig, setLoadedConfig] = useState<HvAppShellConfig>();
  const [hasError, setHasError] = useState(false);

  // Load config from URL
  useEffect(() => {
    if (configProp || !configUrl) return;

    fetch(new URL(configUrl))
      .then((result) => result.json())
      .then((data) => setLoadedConfig(data))
      .catch((e) => {
        console.error(`Failed to obtain the context from: ${configUrl}`, e);
        setLoadedConfig(undefined);
        setHasError(true);
      });
  }, [configProp, configUrl]);

  const config = useMemo(
    () => configProp ?? loadedConfig,
    [configProp, loadedConfig],
  );

  if (hasError) {
    throw Error("Failed to obtain the configuration");
  }

  return (
    <HelmetProvider>
      <HvProvider>
        <GlobalStyles />
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary
            key="general"
            fallback={<GenericError fullPage includeFooter={false} />}
          >
            <HvAppShellProvider config={config}>
              <LayoutProvider>
                <SnackbarProvider>{children}</SnackbarProvider>
              </LayoutProvider>
            </HvAppShellProvider>
          </ErrorBoundary>
        </I18nextProvider>
      </HvProvider>
    </HelmetProvider>
  );
}
