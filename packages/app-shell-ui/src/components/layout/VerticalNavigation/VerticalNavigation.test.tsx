import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import { LOCAL_STORAGE_KEYS } from "../../../hooks/useLocalStorage";
import * as NavigationProvider from "../../../providers/NavigationProvider";
import useNavigationContextDefaultMock from "../../../tests/defaultMocks";
import renderTestProvider from "../../../tests/testUtils";
import { VerticalNavigation } from "./VerticalNavigation";

const navigationContextSpy = vi.spyOn(
  NavigationProvider,
  "useNavigationContext",
);
const navigateSpy = vi.fn();
vi.mock("@hitachivantara/app-shell-navigation", async () => {
  const mod = await vi.importActual("@hitachivantara/app-shell-navigation");
  return {
    ...(mod as object),
    useHvNavigation: vi.fn(() => {
      return {
        navigate: navigateSpy,
      };
    }),
  };
});

describe("VerticalNavigation", () => {
  afterEach(() => {
    navigateSpy.mockReset();
    // Always clean up localStorage so collapsed state never leaks between tests.
    localStorage.removeItem(LOCAL_STORAGE_KEYS.NAV_EXPANDED);
  });
  it("should have a navigation element on the page", async () => {
    await renderTestProvider(<VerticalNavigation />);

    expect(await screen.findByRole("navigation")).toBeInTheDocument();

    const collapseButton = screen.getByRole("button", {
      name: "Collapse vertical navigation",
    });

    expect(collapseButton).toBeInTheDocument();
  });

  it("should have a button element to collapse the panel", async () => {
    await renderTestProvider(<VerticalNavigation />);

    const collapseButton = await screen.findByRole("button", {
      name: "Collapse vertical navigation",
    });

    expect(collapseButton).toBeInTheDocument();
  });

  it("should collapse the menu when clicking on the button", async () => {
    await renderTestProvider(<VerticalNavigation />);

    const collapseButton = await screen.findByRole("button", {
      name: "Collapse vertical navigation",
    });

    await userEvent.click(collapseButton);

    expect(collapseButton).toBeInTheDocument();
  });

  it("should be collapsed according to localStorage", async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NAV_EXPANDED, "false");
    await renderTestProvider(<VerticalNavigation />);

    const collapseButton = await screen.findByRole("button", {
      name: "Expand vertical navigation",
    });

    expect(collapseButton).toBeInTheDocument();
    // Cleanup handled by afterEach.
  });

  describe("pentahoPlus theme", () => {
    it("should render the collapse action label", async () => {
      await renderTestProvider(<VerticalNavigation />, {
        theming: { theme: "pentaho" },
      });

      const collapseAction = await screen.findByText("Collapse Menu");
      expect(collapseAction).toBeInTheDocument();
    });

    it("should not render the standard header with title", async () => {
      await renderTestProvider(<VerticalNavigation />, {
        theming: { theme: "pentaho" },
      });

      await screen.findByRole("navigation");
      expect(screen.queryByText("Menu")).not.toBeInTheDocument();
    });
  });

  describe("non-pentaho theme", () => {
    it("should render the standard header with title and collapse button", async () => {
      await renderTestProvider(<VerticalNavigation />, {
        theming: { theme: "next" },
      });

      const header = await screen.findByText("Menu");
      expect(header).toBeInTheDocument();

      const collapseButton = screen.getByRole("button", {
        name: "Collapse vertical navigation",
      });
      expect(collapseButton).toBeInTheDocument();
      expect(collapseButton).toHaveAttribute("aria-expanded", "true");
    });

    it("should not render the pentaho collapse action", async () => {
      await renderTestProvider(<VerticalNavigation />, {
        theming: { theme: "next" },
      });

      await screen.findByRole("navigation");
      expect(screen.queryByText("Collapse Menu")).not.toBeInTheDocument();
    });
  });

  describe("actions", () => {
    const switchVerticalNavigationModeMock = vi.fn();
    const mockedConfigResponse: Partial<HvAppShellConfig> = {
      menu: [{ label: "Menu 1", target: "/menu1" }],
      navigationMode: "ONLY_LEFT",
    };

    it("should have a navigation item inside the panel", async () => {
      await renderTestProvider(<VerticalNavigation />, mockedConfigResponse);

      const navigationTree = await screen.findByRole("navigation");

      expect(navigationTree).toBeInTheDocument();

      const menuItem = within(navigationTree).getByText("Menu 1");

      expect(menuItem).toBeInTheDocument();
    });

    it("should navigate to target and keep panel open when not in compact mode", async () => {
      navigationContextSpy.mockImplementation(() => ({
        ...useNavigationContextDefaultMock,
        verticalNavigationItems: [
          { id: "0", label: "Menu 1", href: "/menu1" },
          {
            id: "1",
            label: "Menu 2",
            href: "/menu2",
          },
        ],
        hasVerticalNavigation: true,
        switchVerticalNavigationMode: switchVerticalNavigationModeMock,
      }));

      await renderTestProvider(<VerticalNavigation />, mockedConfigResponse);

      const navigationTree = await screen.findByRole("navigation");

      expect(navigationTree).toBeInTheDocument();

      const menuItem = await within(navigationTree).findByText("Menu 2");

      await userEvent.click(menuItem);
      expect(navigateSpy).toHaveBeenCalledWith("/menu2", {
        state: {
          selectedItemId: "1",
        },
      });
      expect(switchVerticalNavigationModeMock).not.toHaveBeenCalled();
    });

    it("should navigate to target and close the panel when in compact mode", async () => {
      navigationContextSpy.mockImplementation(() => ({
        ...useNavigationContextDefaultMock,
        verticalNavigationItems: [{ id: "0", label: "Menu 1", href: "/menu1" }],
        hasVerticalNavigation: true,
        isCompactMode: true,
        switchVerticalNavigationMode: switchVerticalNavigationModeMock,
      }));

      await renderTestProvider(<VerticalNavigation />, mockedConfigResponse);

      const navigationTree = await screen.findByRole("navigation");

      expect(navigationTree).toBeInTheDocument();

      const menuItem = await within(navigationTree).findByLabelText("Menu 1");

      await userEvent.click(menuItem);

      expect(navigateSpy).toHaveBeenCalledWith("/menu1", {
        state: {
          selectedItemId: "0",
        },
      });
      expect(switchVerticalNavigationModeMock).toHaveBeenCalledTimes(1);
    });
  });
});
