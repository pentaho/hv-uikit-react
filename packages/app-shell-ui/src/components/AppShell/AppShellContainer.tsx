import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";
import { HvLoading, HvProvider } from "@hitachivantara/uikit-react-core";

import { createI18NextInstance, useI18nInit } from "../../i18n";
import GenericError from "../../pages/GenericError";
import { LayoutProvider } from "../../providers/LayoutProvider";
import { HvAppShellI18nProvider } from "../AppShellI18nProvider/AppShellI18nProvider";
import { HvAppShellProvider } from "../AppShellProvider/AppShellProvider";
import { GlobalStyles } from "../GlobalStyles";
import InitErrorFallback from "../InitErrorFallback/InitErrorFallback";
import SnackbarProvider from "../SnackbarProvider";
import type { HvAppShellProps } from "./AppShell";

const i18n = createI18NextInstance();

export interface HvAppShellContainerProps
  extends React.PropsWithChildren, HvAppShellProps {}

/**
 * Suspense-compatible config resolver.
 * Throws the fetch promise while pending so that the nearest `<Suspense>`
 * boundary shows a fallback. When the promise settles React re-renders
 * and the resolved config (or error) is returned synchronously.
 */
type ConfigRequest = {
  promise: Promise<void>;
  status: "pending" | "fulfilled" | "rejected";
  result?: HvAppShellConfig;
  error?: unknown;
};

const configRequests = new Map<string, ConfigRequest>();

function useConfig(
  configProp: HvAppShellConfig | undefined,
  configUrl: string | undefined,
): HvAppShellConfig | undefined {
  if (configProp) return configProp;
  if (!configUrl) return undefined;

  let cached = configRequests.get(configUrl);
  if (!cached) {
    const req: ConfigRequest = {
      status: "pending",
      promise: fetch(new URL(configUrl, document.baseURI))
        .then((r) => r.json() as Promise<HvAppShellConfig>)
        .then((data) => {
          req.status = "fulfilled";
          req.result = data;
        })
        .catch((err) => {
          req.status = "rejected";
          req.error = err;
        }),
    };
    configRequests.set(configUrl, req);
    cached = req;
  }

  if (cached.status === "fulfilled") return cached.result;
  if (cached.status === "rejected") throw cached.error;
  throw cached.promise;
}

/**
 * Inner component that resolves config, initializes i18n synchronously,
 * then renders the provider tree.
 *
 * Because it may throw a Promise (via `useConfig`), it MUST be wrapped in
 * a `<Suspense>` boundary by the parent `HvAppShellContainer`.
 */
function AppShellContainerInner({
  config: configProp,
  configUrl,
  children,
}: HvAppShellContainerProps) {
  const config = useConfig(
    configProp as HvAppShellConfig | undefined,
    configUrl,
  );

  // Initialize i18next with preloaded resources (including config translations).
  // useI18nInit is idempotent — safe on re-renders and in Strict Mode.
  useI18nInit(i18n, config, configUrl);

  return (
    <I18nextProvider i18n={i18n}>
      <HvAppShellI18nProvider>
        <ErrorBoundary
          key="general"
          fallback={<GenericError includeFooter={false} />}
        >
          <HvAppShellProvider config={config}>
            <LayoutProvider>
              <SnackbarProvider>{children}</SnackbarProvider>
            </LayoutProvider>
          </HvAppShellProvider>
        </ErrorBoundary>
      </HvAppShellI18nProvider>
    </I18nextProvider>
  );
}

/**
 * Top-level App Shell container.
 *
 * Wraps everything in global providers (Helmet, theme, styles) and a
 * `<Suspense>` boundary that shows a loading indicator while the config
 * is being fetched and i18next is being initialized.
 */
export function HvAppShellContainer({
  config,
  configUrl,
  children,
}: HvAppShellContainerProps) {
  return (
    <HelmetProvider>
      <HvProvider>
        <GlobalStyles />
        <ErrorBoundary fallback={<InitErrorFallback />}>
          <Suspense
            fallback={<HvLoading style={{ height: "100vh", width: "100%" }} />}
          >
            <AppShellContainerInner config={config} configUrl={configUrl}>
              {children}
            </AppShellContainerInner>
          </Suspense>
        </ErrorBoundary>
      </HvProvider>
    </HelmetProvider>
  );
}
