import { Suspense, type ReactNode } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import i18next from "i18next";
import { http, HttpResponse } from "msw";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { I18nInstance } from "../createI18n";
import useI18n from "../useI18n";
import {
  BACKEND,
  BUNDLE_URL,
  createAndWait,
  createBareInstance,
  createInstance,
  server,
} from "./helpers";

// Restore the real react-i18next so useTranslation suspends while bundles load.
vi.unmock("react-i18next");

// #region test helpers

/**
 * Provides a real i18next instance to its subtree via `I18nextProvider`.
 * Inner `<Suspense fallback={null}>` absorbs suspension from `useTranslation`.
 */
const I18nProvider = ({
  instance,
  options,
  children,
}: {
  instance: I18nInstance;
  options?: Parameters<typeof useI18n>[1];
  children: React.ReactNode;
}) => {
  useI18n(instance, options);
  return (
    <I18nextProvider i18n={instance}>
      <Suspense fallback={null}>{children}</Suspense>
    </I18nextProvider>
  );
};

/** Same as I18nProvider but without the inner Suspense. */
const BareI18nProvider = ({
  instance,
  options,
  children,
}: {
  instance: I18nInstance;
  options?: Parameters<typeof useI18n>[1];
  children: ReactNode;
}) => {
  useI18n(instance, options);
  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
};

/**
 * Renders its subtree with `I18nextProvider` and exposes the hook's
 * `isInitialized` flag via `data-testid="initialized"`.
 */
const ProviderWithStatus = ({
  instance,
  options,
  children,
}: {
  instance: I18nInstance;
  options?: Parameters<typeof useI18n>[1];
  children: ReactNode;
}) => {
  const { isInitialized } = useI18n(instance, options);
  return (
    <I18nextProvider i18n={instance}>
      <span data-testid="initialized">{String(isInitialized)}</span>
      {children}
    </I18nextProvider>
  );
};

/** Renders the `"greeting"` key from the `"common"` namespace. */
const TranslatedContent = () => {
  const { t } = useTranslation("common");
  return <span data-testid="translated">{t("greeting")}</span>;
};

// #endregion

describe("useI18n", () => {
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  // #region isInitialized

  describe("isInitialized", () => {
    it("should be false before initialization completes and true after", async () => {
      server.use(
        http.get(BUNDLE_URL, async () => {
          await new Promise((r) => setTimeout(r, 50));
          return HttpResponse.json({});
        }),
      );

      const instance = createInstance();

      const { result } = renderHook(() => useI18n(instance));

      expect(result.current.isInitialized).toBe(false);

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
    });

    it("should be true immediately when the instance is already initialized", async () => {
      const instance = await createAndWait();

      const { result } = renderHook(() => useI18n(instance));

      expect(result.current.isInitialized).toBe(true);
    });

    it("should be true after init even when backend returns errors", async () => {
      server.use(
        http.get(BUNDLE_URL, () => new HttpResponse(null, { status: 500 })),
      );

      const instance = createInstance({ fallbackLng: false });

      const { result } = renderHook(() => useI18n(instance));

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
    });
  });

  // #endregion

  // #region language switching

  describe("language switching", () => {
    it("should switch language in-place (controlled)", async () => {
      const instance = await createAndWait();

      const { rerender } = renderHook(
        ({ lng }: { lng: string }) => useI18n(instance, { lng }),
        { initialProps: { lng: "en" } },
      );

      expect(instance.language).toBe("en");

      await act(async () => {
        rerender({ lng: "fr" });
      });

      await waitFor(() => {
        expect(instance.language).toBe("fr");
      });
    });

    it("should not call changeLanguage when lng has not changed", async () => {
      const instance = await createAndWait();

      const { rerender } = renderHook(
        ({ lng }: { lng: string }) => useI18n(instance, { lng }),
        { initialProps: { lng: "en" } },
      );

      const spy = vi.spyOn(instance, "changeLanguage");

      rerender({ lng: "en" });

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("should support uncontrolled → controlled transition", async () => {
      const instance = await createAndWait({ lng: "fr" });

      const { rerender } = renderHook(
        ({ lng }: { lng?: string }) => useI18n(instance, { lng }),
        { initialProps: { lng: undefined as string | undefined } },
      );

      expect(instance.language).toBe("fr");

      await act(async () => {
        rerender({ lng: "pt" });
      });

      await waitFor(() => {
        expect(instance.language).toBe("pt");
      });
    });
  });

  // #endregion

  // #region suspense behavior

  describe("suspense behavior", () => {
    it("should suspend, then resolve, without recreating the i18n instance", async () => {
      server.use(
        http.get(BUNDLE_URL, async () => {
          await new Promise((r) => setTimeout(r, 20));
          return HttpResponse.json({ greeting: "Hello" });
        }),
      );

      const instance = createInstance({ fallbackLng: false });

      const createInstanceSpy = vi.spyOn(i18next, "createInstance");

      render(
        <Suspense fallback={<span data-testid="fallback">Loading…</span>}>
          <BareI18nProvider instance={instance}>
            <TranslatedContent />
          </BareI18nProvider>
        </Suspense>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("fallback")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("translated")).toHaveTextContent("Hello");
      });

      expect(screen.queryByTestId("fallback")).not.toBeInTheDocument();

      // The spy only counts instances created DURING the test, not in
      // createI18n above. The hook must not recreate the instance.
      expect(createInstanceSpy).not.toHaveBeenCalled();
      createInstanceSpy.mockRestore();
    });

    it("should keep static siblings visible while the translation loads when Suspense is placed below the hook", async () => {
      server.use(
        http.get(BUNDLE_URL, async () => {
          await new Promise((r) => setTimeout(r, 50));
          return HttpResponse.json({ greeting: "Hello" });
        }),
      );

      const instance = createInstance({ fallbackLng: false });

      render(
        <I18nProvider instance={instance}>
          <span data-testid="static">Always visible</span>
          <Suspense fallback={<span data-testid="fallback">Loading…</span>}>
            <TranslatedContent />
          </Suspense>
        </I18nProvider>,
      );

      expect(screen.getByTestId("static")).toBeInTheDocument();
      expect(screen.getByTestId("fallback")).toBeInTheDocument();
      expect(screen.queryByTestId("translated")).not.toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId("translated")).toHaveTextContent("Hello");
      });
      expect(screen.getByTestId("static")).toBeInTheDocument();
      expect(screen.queryByTestId("fallback")).not.toBeInTheDocument();
    });

    it("should not activate an outer Suspense boundary when an inner one is present", async () => {
      server.use(
        http.get(BUNDLE_URL, async () => {
          await new Promise((r) => setTimeout(r, 50));
          return HttpResponse.json({ greeting: "Hello" });
        }),
      );

      const instance = createInstance({ fallbackLng: false });

      render(
        <Suspense fallback={<span data-testid="outer-fallback">Loading…</span>}>
          <BareI18nProvider instance={instance}>
            <Suspense
              fallback={<span data-testid="inner-fallback">Loading…</span>}
            >
              <TranslatedContent />
            </Suspense>
          </BareI18nProvider>
        </Suspense>,
      );

      expect(screen.queryByTestId("outer-fallback")).not.toBeInTheDocument();
      expect(screen.getByTestId("inner-fallback")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId("translated")).toHaveTextContent("Hello");
      });
      expect(screen.queryByTestId("outer-fallback")).not.toBeInTheDocument();
      expect(screen.queryByTestId("inner-fallback")).not.toBeInTheDocument();
    });

    it("should render immediately with useSuspense:false and update when ready", async () => {
      server.use(
        http.get(BUNDLE_URL, async () => {
          await new Promise((r) => setTimeout(r, 20));
          return HttpResponse.json({ greeting: "Hello" });
        }),
      );

      const instance = createInstance({ fallbackLng: false });

      const NonSuspenseContent = () => {
        const { t } = useTranslation("common", { useSuspense: false });
        return <span data-testid="translated">{t("greeting")}</span>;
      };

      render(
        <ProviderWithStatus instance={instance}>
          <NonSuspenseContent />
        </ProviderWithStatus>,
      );

      expect(screen.getByTestId("initialized")).toHaveTextContent("false");
      expect(screen.getByTestId("translated")).toHaveTextContent("greeting");

      await waitFor(() => {
        expect(screen.getByTestId("initialized")).toHaveTextContent("true");
        expect(screen.getByTestId("translated")).toHaveTextContent("Hello");
      });
    });
  });

  // #endregion

  // #region deferred init options

  describe("deferred init options", () => {
    it("should initialize with options provided at render time", async () => {
      server.use(
        http.get(BUNDLE_URL, ({ params }) => {
          if (params.lng === "en" && params.ns === "common") {
            return HttpResponse.json({ greeting: "Hello" });
          }
          return HttpResponse.json({});
        }),
      );

      // Create instance without backend — defer it to useI18n.
      const instance = createBareInstance();

      render(
        <Suspense fallback={<span data-testid="fallback">Loading…</span>}>
          <BareI18nProvider
            instance={instance}
            options={{ lng: "en", backend: BACKEND, ns: ["common"] }}
          >
            <TranslatedContent />
          </BareI18nProvider>
        </Suspense>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("translated")).toHaveTextContent("Hello");
      });
    });

    it("should derive defaultNS from ns passed in useI18n options", async () => {
      server.use(http.get(BUNDLE_URL, () => HttpResponse.json({})));

      const instance = createBareInstance();

      renderHook(() =>
        useI18n(instance, {
          lng: "en",
          backend: BACKEND,
          ns: ["dashboard", "common"],
        }),
      );

      await waitFor(() => {
        expect(instance.isInitialized).toBe(true);
      });

      expect(instance.options.defaultNS).toBe("dashboard");
    });

    it("should ignore init options on subsequent renders (only lng is reactive)", async () => {
      const instance = createInstance();

      const { rerender } = renderHook(
        ({ lng }: { lng: string }) => useI18n(instance, { lng }),
        { initialProps: { lng: "en" } },
      );

      await waitFor(() => {
        expect(instance.isInitialized).toBe(true);
      });

      // The first ensureInit already ran. Verify ns is "common" from createInstance.
      expect(instance.options.ns).toContain("common");

      // Rerender with different lng — only lng should be reactive.
      await act(async () => {
        rerender({ lng: "fr" });
      });

      await waitFor(() => {
        expect(instance.language).toBe("fr");
      });

      // ns is still from the first init.
      expect(instance.options.ns).toContain("common");
    });
  });

  // #endregion
});
