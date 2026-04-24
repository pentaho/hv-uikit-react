import { useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";
import i18next from "i18next";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import AppShell from "./AppShell";

// Mock useI18nInit and createI18NextInstance so the module-level `i18n`
// constant in AppShellContainer is a pre-initialized, backend-free instance.
//
// Why: the real createI18NextInstance uses createI18n (which bakes in
// initAsync:true). When useI18nInit calls useI18n → ensureInit, the async
// init causes a brief window where isInitialized is false. react-i18next
// suspends during that window, the Suspense boundary shows <HvLoading/>,
// and findBy times out before the banner or navigation ever appears.
//
// By returning an already-initialized synchronous instance here,
// useI18nInit is a no-op and the very first render sees a ready i18n instance.
vi.mock("../../i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../i18n")>();
  return {
    ...mod,
    useI18nInit: () => ({ isInitialized: true }),
    createI18NextInstance: () => {
      const instance = i18next.createInstance();
      instance.init({
        lng: "en",
        fallbackLng: "en",
        ns: ["appShell", "app"],
        defaultNS: "appShell",
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
        initAsync: false,
      });
      return instance;
    },
  };
});

function useMenu(): HvAppShellConfig["menu"] {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return [];

  return [
    { target: "/home", label: "Home" },
    { target: "/options", label: "Options" },
  ];
}

function AppWithAsyncConfig() {
  const menu = useMenu();
  return (
    <AppShell
      config={{ navigationMode: "ONLY_TOP", menu, translationsBaseUrl: false }}
    />
  );
}

describe("AppShell", () => {
  it("renders the Header when a minimum configuration is provided", async () => {
    render(<AppShell config={{ translationsBaseUrl: false }} />);
    expect(await screen.findByRole("banner")).toBeInTheDocument();
  });

  it("renders the navigation when a minimum configuration is provided", async () => {
    render(
      <AppShell
        config={{
          navigationMode: "ONLY_TOP",
          menu: [
            { target: "/home", label: "Home" },
            { target: "/options", label: "Options" },
          ],
          translationsBaseUrl: false,
        }}
      />,
    );

    expect(await screen.findByRole("navigation")).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Home" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Options" }),
    ).toBeInTheDocument();
  });

  it("renders correctly when configuration is loaded async", async () => {
    render(<AppWithAsyncConfig />);

    expect(await screen.findByRole("navigation")).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Home" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Options" }),
    ).toBeInTheDocument();
  });
});
