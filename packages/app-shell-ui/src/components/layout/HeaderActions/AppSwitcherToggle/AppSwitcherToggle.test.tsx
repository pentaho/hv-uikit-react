import { act, screen } from "@testing-library/react";
import { HvAppShellAppSwitcherItemConfig } from "@hitachivantara/app-shell-shared";

import renderTestProvider from "../../../../tests/testUtils";
import AppSwitcherToggle from "./AppSwitcherToggle";

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
});
