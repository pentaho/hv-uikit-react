// @vitest-environment happy-dom
import LanguageDetector from "i18next-browser-languagedetector";
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

import createI18n, {
  ensureInit,
  getInitPromise,
  isI18nInitialized,
} from "../createI18n";
import {
  HttpResourcesBackend,
  type HttpResourcesBackendOptions,
} from "../HttpResourcesBackend";
import {
  BACKEND,
  BUNDLE_URL,
  createBareInstance,
  createInstance,
  initAndWait,
  server,
  SUPPORTED_LOCALES_URL,
} from "./helpers";

// #region test helpers

const originalLanguages = navigator.languages;

const setNavigatorLanguages = (languages: readonly string[]) => {
  Object.defineProperty(navigator, "languages", {
    value: languages,
    configurable: true,
  });
};

const restoreNavigatorLanguages = () => {
  Object.defineProperty(navigator, "languages", {
    value: originalLanguages,
    configurable: true,
  });
};

/**
 * Installs a spy on the bundle endpoint that records which `lng` values are
 * fetched. Returns the mock function so callers can assert on it.
 */
const spyOnBundleFetches = () => {
  const bundleFetched = vi.fn();
  server.use(
    http.get(BUNDLE_URL, ({ params }) => {
      bundleFetched(params.lng);
      return HttpResponse.json({});
    }),
  );
  return bundleFetched;
};

// #endregion

describe("createI18n", () => {
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterEach(() => {
    server.resetHandlers();
    restoreNavigatorLanguages();
  });
  afterAll(() => server.close());

  // #region initialization

  describe("initialization", () => {
    it("should return an initialized instance after init settles", async () => {
      const i18n = createInstance();

      await initAndWait(i18n);

      expect(i18n.isInitialized).toBe(true);
    });

    it("should initialize with the provided language", async () => {
      const i18n = createInstance({ lng: "pt" });

      await initAndWait(i18n);

      expect(i18n.language).toBe("pt");
    });

    it("should create distinct instances per call", async () => {
      const a = createInstance();
      const b = createInstance();

      expect(a).not.toBe(b);

      await initAndWait(a);
      await initAndWait(b);
    });

    it("should complete init even when backend returns errors", async () => {
      server.use(
        http.get(BUNDLE_URL, () => new HttpResponse(null, { status: 500 })),
      );

      const i18n = createInstance({ fallbackLng: false });

      await initAndWait(i18n);

      // i18next always sets isInitialized regardless of load outcomes.
      expect(i18n.isInitialized).toBe(true);
    });
  });

  // #endregion

  // #region ensureInit guards

  describe("ensureInit guards", () => {
    it("should throw when the instance was already initialized externally", async () => {
      const i18n = createInstance();

      // Initialize externally — bypassing ensureInit.
      await i18n.init();

      expect(() => ensureInit(i18n)).toThrow(/already initialized externally/);
    });

    it("should throw when the instance is currently initializing externally", () => {
      const i18n = createInstance();

      // Start init externally — it's still in-flight.
      i18n.init();

      expect(i18n.isInitializing).toBe(true);
      expect(() => ensureInit(i18n)).toThrow(/already initialized externally/);
    });
  });

  // #endregion

  // #region isI18nInitialized

  describe("isI18nInitialized", () => {
    it("should return false before init is triggered", () => {
      const i18n = createInstance();

      expect(isI18nInitialized(i18n)).toBe(false);
    });

    it("should return true after init settles", async () => {
      const i18n = createInstance();

      await initAndWait(i18n);

      expect(isI18nInitialized(i18n)).toBe(true);
    });

    it("should return true even when backend returns errors", async () => {
      server.use(
        http.get(BUNDLE_URL, () => new HttpResponse(null, { status: 500 })),
      );

      const i18n = createInstance({ fallbackLng: false });

      await initAndWait(i18n);

      expect(isI18nInitialized(i18n)).toBe(true);
    });
  });

  // #endregion

  // #region getInitPromise

  describe("getInitPromise", () => {
    it("should return undefined before ensureInit is called", () => {
      const i18n = createInstance();

      expect(getInitPromise(i18n)).toBeUndefined();
    });

    it("should return a promise after ensureInit is called", () => {
      const i18n = createInstance();

      ensureInit(i18n);

      expect(getInitPromise(i18n)).toBeInstanceOf(Promise);
    });

    it("should resolve after init completes", async () => {
      const i18n = createInstance();

      ensureInit(i18n);
      await getInitPromise(i18n);

      expect(isI18nInitialized(i18n)).toBe(true);
    });

    it("should resolve even when backend returns errors", async () => {
      server.use(
        http.get(BUNDLE_URL, () => new HttpResponse(null, { status: 500 })),
      );

      const i18n = createInstance({ fallbackLng: false });

      ensureInit(i18n);
      await getInitPromise(i18n);

      // The promise always resolves — errors are not propagated.
      expect(isI18nInitialized(i18n)).toBe(true);
    });
  });

  // #endregion

  // #region isInitializing (intermediate state)

  describe("isInitializing (intermediate state)", () => {
    it("should be in an initializing state after ensureInit but before init completes", async () => {
      server.use(
        http.get(BUNDLE_URL, async () => {
          await new Promise((r) => setTimeout(r, 50));
          return HttpResponse.json({});
        }),
      );

      const i18n = createInstance();

      ensureInit(i18n);

      // Init has been triggered, but hasn't settled yet.
      expect(isI18nInitialized(i18n)).toBe(false);
      expect(getInitPromise(i18n)).toBeDefined();

      // Wait for it to finish.
      await getInitPromise(i18n);

      expect(isI18nInitialized(i18n)).toBe(true);
    });

    it("should not be in an initializing state before ensureInit is called", () => {
      const i18n = createInstance();

      expect(isI18nInitialized(i18n)).toBe(false);
      expect(getInitPromise(i18n)).toBeUndefined();
    });
  });

  // #endregion

  // #region option defaults

  describe("option defaults", () => {
    describe("defaultNS", () => {
      it("should default to the first namespace when not specified", async () => {
        const i18n = createInstance({ ns: ["common", "dashboard"] });

        await initAndWait(i18n);

        expect(i18n.options.defaultNS).toBe("common");
      });

      it("should use the provided defaultNS when specified", async () => {
        const i18n = createInstance({
          ns: ["common", "dashboard"],
          defaultNS: "dashboard" as const,
        });

        await initAndWait(i18n);

        expect(i18n.options.defaultNS).toBe("dashboard");
      });
    });

    describe("fallbackLng", () => {
      it("should use navigator.languages as the fallback chain", async () => {
        setNavigatorLanguages(["fr", "pt"]);

        const i18n = createInstance();

        await initAndWait(i18n);

        const fallback = i18n.options.fallbackLng as string[];
        expect(fallback).toContain("fr");
        expect(fallback).toContain("pt");
      });

      it("should append 'en' when navigator.languages does not include it", async () => {
        setNavigatorLanguages(["fr", "pt"]);

        const i18n = createInstance({ lng: "fr" });

        await initAndWait(i18n);

        const fallback = i18n.options.fallbackLng as string[];
        expect(fallback).toEqual(["fr", "pt", "en"]);
      });

      it("should not duplicate 'en' when navigator.languages already includes it", async () => {
        setNavigatorLanguages(["fr", "en", "pt"]);

        const i18n = createInstance({ lng: "fr" });

        await initAndWait(i18n);

        const fallback = i18n.options.fallbackLng as string[];
        expect(fallback).toEqual(["fr", "en", "pt"]);
      });

      it("should use the provided fallbackLng when specified", async () => {
        setNavigatorLanguages(["fr", "pt"]);

        const i18n = createInstance({ fallbackLng: "pt" });

        await initAndWait(i18n);

        expect(i18n.options.fallbackLng).toEqual(["pt"]);
      });

      it("should fall back to ['en'] when navigator.languages is empty", async () => {
        setNavigatorLanguages([]);

        const i18n = createInstance({ lng: "fr" });

        await initAndWait(i18n);

        const fallback = i18n.options.fallbackLng as string[];
        expect(fallback).toEqual(["en"]);
      });
    });

    it("should set interpolation.escapeValue to false", async () => {
      const i18n = createInstance();

      await initAndWait(i18n);

      expect(i18n.options.interpolation?.escapeValue).toBe(false);
    });

    it("should allow overriding interpolation options", async () => {
      const i18n = createInstance({
        interpolation: { prefix: "<<", suffix: ">>" },
      });

      await initAndWait(i18n);

      expect(i18n.options.interpolation?.escapeValue).toBe(false);
      expect(i18n.options.interpolation?.prefix).toBe("<<");
      expect(i18n.options.interpolation?.suffix).toBe(">>");
    });
  });

  // #endregion

  // #region browser language detection

  describe("browser language detection (uncontrolled mode)", () => {
    it("should detect language from navigator when lng is omitted", async () => {
      setNavigatorLanguages(["pt", "en"]);

      const i18n = createI18n<HttpResourcesBackendOptions>({
        backend: BACKEND,
        ns: ["common"],
        detection: { order: ["navigator"] },
      })
        .use(LanguageDetector)
        .use(HttpResourcesBackend);

      await initAndWait(i18n);

      expect(i18n.language).toBe("pt");
    });
  });

  // #endregion

  // #region supported-locales manifest (backend)

  describe("supported-locales manifest", () => {
    it("should filter unsupported languages without a network request", async () => {
      server.use(
        http.get(SUPPORTED_LOCALES_URL, () => HttpResponse.json(["en", "fr"])),
      );

      const bundleFetched = spyOnBundleFetches();

      const i18n = createInstance({
        lng: "de",
        fallbackLng: "en",
      });

      await initAndWait(i18n);

      expect(bundleFetched).not.toHaveBeenCalledWith("de");
      expect(bundleFetched).toHaveBeenCalledWith("en");
    });

    it.each([
      {
        scenario: "the manifest returns 404",
        manifestHandler: () => new HttpResponse(null, { status: 404 }),
        lng: "ja",
      },
      {
        scenario: "the manifest is malformed",
        manifestHandler: () => HttpResponse.json({ notAnArray: true }),
        lng: "ja",
      },
      {
        scenario: "the manifest is an empty array",
        manifestHandler: () => HttpResponse.json([]),
        lng: "en",
      },
      {
        scenario: "a network error occurs",
        manifestHandler: () => HttpResponse.error(),
        lng: "en",
      },
    ])(
      "should allow all languages when $scenario",
      async ({ manifestHandler, lng }) => {
        server.use(http.get(SUPPORTED_LOCALES_URL, manifestHandler));

        const bundleFetched = spyOnBundleFetches();

        const i18n = createInstance({ lng, fallbackLng: false });

        await initAndWait(i18n);

        expect(bundleFetched).toHaveBeenCalledWith(lng);
      },
    );
  });

  // #endregion

  // #region backend URL normalization

  describe("backend URL normalization", () => {
    it("should normalize baseUrl by appending a trailing slash", async () => {
      const bundleFetched = vi.fn();

      server.use(
        http.get(BUNDLE_URL, ({ request }) => {
          bundleFetched(new URL(request.url).pathname);
          return HttpResponse.json({});
        }),
      );

      const i18n = createI18n<HttpResourcesBackendOptions>({
        lng: "en",
        backend: { baseUrl: "/test-app" }, // no trailing slash
        ns: ["common"],
      }).use(HttpResourcesBackend);

      await initAndWait(i18n);

      expect(bundleFetched).toHaveBeenCalledWith(
        "/test-app/locales/en/common.json",
      );
    });
  });

  // #endregion

  // #region translations

  describe("translations", () => {
    it("should resolve translation keys from the loaded bundle", async () => {
      server.use(
        http.get(BUNDLE_URL, ({ params }) => {
          if (params.lng === "fr" && params.ns === "common") {
            return HttpResponse.json({ greeting: "Bonjour" });
          }
          return HttpResponse.json({});
        }),
      );

      const i18n = createInstance({ lng: "fr" });

      await initAndWait(i18n);

      expect(i18n.t("greeting")).toBe("Bonjour");
    });

    it("should fall back to fallbackLng for missing keys", async () => {
      server.use(
        http.get(BUNDLE_URL, ({ params }) => {
          if (params.lng === "en") {
            return HttpResponse.json({ greeting: "Hello" });
          }
          return HttpResponse.json({});
        }),
      );

      const i18n = createInstance({ lng: "pt", fallbackLng: "en" });

      await initAndWait(i18n);

      expect(i18n.t("greeting")).toBe("Hello");
    });

    it("should load multiple namespaces", async () => {
      server.use(
        http.get(BUNDLE_URL, ({ params }) => {
          if (params.lng === "en" && params.ns === "common") {
            return HttpResponse.json({ greeting: "Hello" });
          }
          if (params.lng === "en" && params.ns === "dashboard") {
            return HttpResponse.json({ title: "Dashboard" });
          }
          return HttpResponse.json({});
        }),
      );

      const i18n = createInstance({ ns: ["common", "dashboard"] });

      await initAndWait(i18n);

      expect(i18n.t("greeting")).toBe("Hello");
      expect(i18n.t("dashboard:title")).toBe("Dashboard");
    });

    it("should gracefully degrade to fallback when primary language fails", async () => {
      server.use(
        http.get(BUNDLE_URL, ({ params }) => {
          if (params.lng === "en")
            return HttpResponse.json({ greeting: "Hello" });
          return new HttpResponse(null, { status: 500 });
        }),
      );

      const i18n = createInstance({ lng: "fr", fallbackLng: "en" });

      await initAndWait(i18n);

      // Fallback worked — no error, translations available.
      expect(i18n.t("greeting")).toBe("Hello");
    });
  });

  // #endregion

  // #region deferred init options (ensureInit with options)

  describe("deferred init options (ensureInit with options)", () => {
    it("should apply init options passed to ensureInit", async () => {
      // Create instance without backend or ns — defer them to ensureInit.
      const i18n = createBareInstance({ lng: "en" });

      await initAndWait(i18n, {
        backend: BACKEND,
        ns: ["common"],
      });

      expect(i18n.isInitialized).toBe(true);
      expect(i18n.options.ns).toContain("common");
    });

    it("should derive defaultNS from ns when ns is provided without defaultNS", async () => {
      const i18n = createBareInstance({ lng: "en" });

      await initAndWait(i18n, {
        backend: BACKEND,
        ns: ["dashboard", "common"],
      });

      expect(i18n.options.defaultNS).toBe("dashboard");
    });

    it("should not override an explicit defaultNS even when ns is provided", async () => {
      const i18n = createBareInstance({ lng: "en" });

      await initAndWait(i18n, {
        backend: BACKEND,
        ns: ["dashboard", "common"],
        defaultNS: "common",
      });

      expect(i18n.options.defaultNS).toBe("common");
    });

    it("should not touch defaultNS when ns is not provided in ensureInit options", async () => {
      // createI18n sets defaultNS from its own ns.
      const i18n = createInstance({ ns: ["admin"] });

      await initAndWait(i18n);

      expect(i18n.options.defaultNS).toBe("admin");
    });

    it("should preserve createI18n defaults (fallbackLng, load, interpolation) when ensureInit provides additional options", async () => {
      setNavigatorLanguages(["fr", "pt"]);

      const i18n = createBareInstance();

      await initAndWait(i18n, {
        lng: "en",
        backend: BACKEND,
        ns: ["common"],
      });

      expect(i18n.options.load).toBe("all");
      expect(i18n.options.interpolation?.escapeValue).toBe(false);
      const fallback = i18n.options.fallbackLng as string[];
      expect(fallback).toContain("fr");
      expect(fallback).toContain("en");
    });

    it("should be idempotent — second ensureInit call is a no-op", async () => {
      const i18n = createInstance();

      ensureInit(i18n, { lng: "en" });
      // Second call with different options — should be ignored.
      ensureInit(i18n, { lng: "fr" });

      await getInitPromise(i18n);

      expect(i18n.language).toBe("en");
    });

    it("should force initAsync: true even if caller passes false", async () => {
      const i18n = createInstance();

      // Passing initAsync: false should be overridden.
      ensureInit(i18n, { initAsync: false });

      // If initAsync were not forced, this would throw synchronously.
      // The fact that we can await the promise means it was async.
      await getInitPromise(i18n);

      expect(i18n.isInitialized).toBe(true);
    });
  });

  // #endregion
});
