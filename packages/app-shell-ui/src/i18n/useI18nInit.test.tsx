import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  createI18n,
  type I18nInstance,
} from "@hitachivantara/app-shell-i18next";
import { CONFIG_TRANSLATIONS_NAMESPACE } from "@hitachivantara/app-shell-shared";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import InitErrorFallback from "../components/InitErrorFallback/InitErrorFallback";
import { APP_SHELL_NAMESPACE, useI18nInit } from "../i18n";

// Restore the real react-i18next so useTranslation/Suspense work as expected.
vi.unmock("react-i18next");

// Mock fetch globally to avoid ECONNREFUSED when HttpResourcesBackend tries
// to load bundles from localhost during the "backend enabled" tests.
const fetchMock = vi.fn(() =>
  Promise.resolve(new Response(JSON.stringify({}), { status: 200 })),
);

beforeAll(() => {
  vi.stubGlobal("fetch", fetchMock);
});
afterAll(() => {
  vi.unstubAllGlobals();
});

/**
 * Creates a minimal i18n instance without any backend.
 * Used for tests where translationsBaseUrl: false (no HTTP).
 */
const createNoBackendInstance = (): I18nInstance =>
  createI18n({
    lng: "en",
    ns: [APP_SHELL_NAMESPACE, CONFIG_TRANSLATIONS_NAMESPACE],
    fallbackLng: "en",
    partialBundledLanguages: true,
  }) as I18nInstance;

/**
 * Test wrapper that mirrors the production AppShellContainer structure:
 *   ErrorBoundary(InitErrorFallback) > Suspense > useI18nInit > I18nextProvider
 */
function TestShell({
  i18n,
  config,
  configUrl,
  children,
}: {
  i18n: I18nInstance;
  config?: Parameters<typeof useI18nInit>[1];
  configUrl?: string;
  children?: React.ReactNode;
}) {
  return (
    <HvProvider>
      <ErrorBoundary fallback={<InitErrorFallback />}>
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <TestShellInner i18n={i18n} config={config} configUrl={configUrl}>
            {children}
          </TestShellInner>
        </Suspense>
      </ErrorBoundary>
    </HvProvider>
  );
}

function TestShellInner({
  i18n,
  config,
  configUrl,
  children,
}: {
  i18n: I18nInstance;
  config?: Parameters<typeof useI18nInit>[1];
  configUrl?: string;
  children?: React.ReactNode;
}) {
  useI18nInit(i18n, config, configUrl);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

describe("useI18nInit", () => {
  describe("pre-loaded config translations", () => {
    it("should make config translations available in the i18n store after init", async () => {
      const i18n = createNoBackendInstance();

      const config = {
        translationsBaseUrl: false as const,
        translations: {
          en: { myKey: "My Value" },
          pt: { myKey: "Meu Valor" },
        },
      };

      render(<TestShell i18n={i18n} config={config} />);

      await waitFor(() => {
        expect(i18n.isInitialized).toBe(true);
      });

      expect(
        i18n.getResourceBundle("en", CONFIG_TRANSLATIONS_NAMESPACE),
      ).toMatchObject({ myKey: "My Value" });
      expect(
        i18n.getResourceBundle("pt", CONFIG_TRANSLATIONS_NAMESPACE),
      ).toMatchObject({ myKey: "Meu Valor" });
    });

    it("should pre-load appShell English translations", async () => {
      const i18n = createNoBackendInstance();

      render(<TestShell i18n={i18n} config={{ translationsBaseUrl: false }} />);

      await waitFor(() => {
        expect(i18n.isInitialized).toBe(true);
      });

      const bundle = i18n.getResourceBundle("en", APP_SHELL_NAMESPACE);
      expect(bundle).toBeDefined();
      expect(Object.keys(bundle)).not.toHaveLength(0);
    });
  });

  describe("backend disabled (translationsBaseUrl: false)", () => {
    it("should initialize without error and not trigger reloadResources", async () => {
      const i18n = createNoBackendInstance();
      const reloadSpy = vi.spyOn(i18n, "reloadResources");

      render(<TestShell i18n={i18n} config={{ translationsBaseUrl: false }} />);

      await waitFor(() => {
        expect(i18n.isInitialized).toBe(true);
      });

      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it("should not render error fallback", async () => {
      const i18n = createNoBackendInstance();

      render(
        <TestShell i18n={i18n} config={{ translationsBaseUrl: false }}>
          <div data-testid="content">Loaded</div>
        </TestShell>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("content")).toBeInTheDocument();
      });

      expect(
        screen.queryByText("Initialization Error"),
      ).not.toBeInTheDocument();
    });
  });

  describe("backend enabled", () => {
    it("should trigger reloadResources for en namespaces on first render", () => {
      const i18n = createNoBackendInstance();
      const reloadSpy = vi
        .spyOn(i18n, "reloadResources")
        .mockResolvedValue(undefined as never);

      render(<TestShell i18n={i18n} config={{}} />);

      expect(reloadSpy).toHaveBeenCalledWith("en", [
        APP_SHELL_NAMESPACE,
        CONFIG_TRANSLATIONS_NAMESPACE,
      ]);
    });
  });
});

describe("InitErrorFallback", () => {
  it("should render the error fallback when a child component throws", () => {
    const ThrowingComponent = () => {
      throw new Error("Init failed");
    };

    render(
      <HvProvider>
        <ErrorBoundary fallback={<InitErrorFallback />}>
          <ThrowingComponent />
        </ErrorBoundary>
      </HvProvider>,
    );

    expect(screen.getByText("Initialization Error")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Something went wrong during initialization. Please try again later.",
      ),
    ).toBeInTheDocument();
  });

  it("should not depend on any i18n provider", () => {
    // Render InitErrorFallback directly without I18nextProvider.
    // If it used useTranslation, this would throw.
    render(
      <HvProvider>
        <InitErrorFallback />
      </HvProvider>,
    );

    expect(screen.getByText("Initialization Error")).toBeInTheDocument();
  });
});
