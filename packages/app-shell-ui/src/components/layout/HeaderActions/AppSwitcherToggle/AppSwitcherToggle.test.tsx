import { act, screen } from "@testing-library/react";
import {
  HvAppShellAppSwitcherItemConfig,
  type UseDynamicAppsResult,
} from "@hitachivantara/app-shell-shared";

import renderTestProvider from "../../../../tests/testUtils";
import AppSwitcherToggle from "./AppSwitcherToggle";

const mockPreloadedBundles = new Map<string, unknown>();

vi.mock("@hitachivantara/app-shell-shared", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@hitachivantara/app-shell-shared")>();
  return {
    ...actual,
    useHvAppShellModel: () => ({
      preloadedBundles: mockPreloadedBundles,
      allConditions: [],
      logo: undefined,
    }),
  };
});

describe("AppSwitcherToggle", () => {
  const title = "DummyAppSwitcherTitle";
  const apps: HvAppShellAppSwitcherItemConfig[] = [
    {
      label: "dummyApp1",
      description: "dummyAppDescription1",
      url: "dummyAppUrl2",
      target: "SELF",
      icon: {
        iconType: "uikit",
        name: "Warehouse",
      },
    },
  ];

  it("should have an app switcher toggle button", async () => {
    renderTestProvider(<AppSwitcherToggle title={title} apps={apps} />);

    const appSwitcherToggle = await screen.findByRole("button", {
      name: "DummyAppSwitcherTitle",
    });

    expect(appSwitcherToggle).toBeInTheDocument();
  });

  it("should toggle the app switcher panel when clicking the toggle button", async () => {
    renderTestProvider(<AppSwitcherToggle title={title} apps={apps} />);

    const appSwitcherToggle = await screen.findByRole("button", {
      name: "DummyAppSwitcherTitle",
    });

    expect(appSwitcherToggle).toBeInTheDocument();
    expect(screen.queryAllByRole("region").length).toBe(0);

    // Clicking on the button the first time should open the panel
    act(() => {
      appSwitcherToggle?.click();
    });

    expect(screen.getAllByRole("region").length).toBe(1);

    // Clicking on the button the second time should close the panel
    act(() => {
      appSwitcherToggle?.click();
    });
    expect(screen.queryAllByRole("region").length).toBe(0);
  });

  it("should have an app switcher toggle button with the default title when none is provided", async () => {
    renderTestProvider(
      <AppSwitcherToggle
        apps={[
          {
            label: "dummyApp1",
            description: "dummyAppDescription1",
            url: "dummyAppUrl2",
            target: "SELF",
            icon: {
              iconType: "uikit",
              name: "Warehouse",
            },
          },
        ]}
      />,
    );

    const appSwitcherToggle = await screen.findByRole("button", {
      name: "Apps",
    });

    expect(appSwitcherToggle).toBeInTheDocument();
  });

  it("should not show the brand logo next to the app switcher by default", async () => {
    renderTestProvider(<AppSwitcherToggle title={title} apps={apps} />);

    const appSwitcherToggle = await screen.findByRole("button", {
      name: "DummyAppSwitcherTitle",
    });
    const logo = screen.queryByLabelText("Hitachi logo");

    expect(appSwitcherToggle).toBeInTheDocument();
    expect(logo).not.toBeInTheDocument();
  });

  it("should show the brand logo next to the app switcher when showLogo is true", async () => {
    renderTestProvider(
      <AppSwitcherToggle title={title} apps={apps} showLogo />,
    );

    const appSwitcherToggle = await screen.findByRole("button", {
      name: "DummyAppSwitcherTitle",
    });
    const logo = screen.getByLabelText("Hitachi logo");

    expect(appSwitcherToggle).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
  });

  const useAppsSuccessMock = (): UseDynamicAppsResult => ({
    isPending: false,
    error: null,
    result: [
      {
        label: "Dynamic App",
        url: "https://example.com/dynamic",
        target: "NEW",
      },
    ],
  });

  it("should render apps from a dynamicApps hook bundle", async () => {
    mockPreloadedBundles.set(
      "@self/hooks/useExternalApps.js",
      useAppsSuccessMock,
    );

    renderTestProvider(
      <AppSwitcherToggle
        title={title}
        dynamicApps={{ bundle: "@self/hooks/useExternalApps.js" }}
      />,
    );

    const appSwitcherToggle = await screen.findByRole("button", {
      name: "DummyAppSwitcherTitle",
    });

    expect(appSwitcherToggle).toBeInTheDocument();

    act(() => {
      appSwitcherToggle.click();
    });

    expect(screen.getByText("Dynamic App")).toBeInTheDocument();

    mockPreloadedBundles.clear();
  });

  it("should merge static and dynamic apps", async () => {
    mockPreloadedBundles.set(
      "@self/hooks/useExternalApps.js",
      useAppsSuccessMock,
    );

    renderTestProvider(
      <AppSwitcherToggle
        title={title}
        apps={apps}
        dynamicApps={{ bundle: "@self/hooks/useExternalApps.js" }}
      />,
    );

    const appSwitcherToggle = await screen.findByRole("button", {
      name: "DummyAppSwitcherTitle",
    });

    act(() => {
      appSwitcherToggle.click();
    });

    expect(screen.getByText("dummyApp1")).toBeInTheDocument();
    expect(screen.getByText("Dynamic App")).toBeInTheDocument();

    mockPreloadedBundles.clear();
  });

  it("should not render when dynamicApps hook is pending", async () => {
    const useAppsMock = (): UseDynamicAppsResult => ({
      isPending: true,
      error: null,
      result: undefined,
    });

    mockPreloadedBundles.set("@self/hooks/useExternalApps.js", useAppsMock);

    renderTestProvider(
      <AppSwitcherToggle
        title={title}
        dynamicApps={{ bundle: "@self/hooks/useExternalApps.js" }}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "DummyAppSwitcherTitle" }),
    ).not.toBeInTheDocument();

    mockPreloadedBundles.clear();
  });
});
