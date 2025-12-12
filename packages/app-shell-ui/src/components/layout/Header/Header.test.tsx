import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import * as NavigationProvider from "../../../providers/NavigationProvider";
import useNavigationContextDefaultMock from "../../../tests/defaultMocks";
import renderTestProvider from "../../../tests/testUtils";
import Header from "./Header";

vi.mock("react-helmet-async", () => ({
  Helmet: vi.fn(),
}));

const navigationContextSpy = vi.spyOn(
  NavigationProvider,
  "useNavigationContext",
);

const navigateSpy = vi.fn();
vi.mock("@hitachivantara/app-shell-navigation", async () => {
  const mod = await vi.importActual("@hitachivantara/app-shell-navigation");
  return {
    ...mod,
    useHvNavigation: () => ({
      navigate: navigateSpy,
    }),
  };
});

describe("`Header` component", () => {
  describe("with empty menu configuration", () => {
    it("should not have an nav element", async () => {
      await renderTestProvider(<Header />);

      expect(await screen.findByRole("banner")).toBeInTheDocument();
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });
  });

  describe("with valid menu configuration", () => {
    const user = userEvent.setup();

    beforeEach(async () => {
      await renderTestProvider(<Header />, {
        menu: [
          {
            label: "errors",
            target: "/dummyTarget1",
          },
          {
            label: "dummyMenu2",
            submenus: [
              {
                label: "subDummyMenu2",
                icon: {
                  iconType: "uikit",
                  name: "Play",
                },
                target: "/subDummyTarget2",
              },
            ],
          },
        ],
      });
    });

    it("should have a navigation element with the correct menu items", () => {
      const headerElement = screen.getByRole("banner");

      expect(headerElement).toBeInTheDocument();

      const headerNavigationElement =
        within(headerElement).getByRole("navigation");
      expect(headerNavigationElement).toBeInTheDocument();

      const menuItemElements = within(headerNavigationElement).getAllByRole(
        "link",
      );

      expect(menuItemElements.length).toBe(2);
      expect(menuItemElements[0].textContent).toEqual("errors");
      expect(menuItemElements[1].textContent).toEqual("dummyMenu2");
    });

    it("should call `onClick` method on menu navigation", async () => {
      const dummySelectedItem = {
        href: "./subDummyTarget2",
        // TODO: should be 1-0, but not should be fixed when using the `route` property
        // and by relying on the HvHeader built-in fallback functionality
        id: "1",
      };

      const headerNavigationElement = screen.getByRole("navigation");
      const secondMenuItem = within(headerNavigationElement).getAllByRole(
        "link",
      )[1];

      await user.click(secondMenuItem);

      expect(navigateSpy).toHaveBeenCalledWith(dummySelectedItem.href, {
        state: { selectedItemId: dummySelectedItem.id },
      });
    });
  });

  describe("with translations", () => {
    it("should present value from `name` when no translation bundle with given key is provided", async () => {
      const { getByRole } = await renderTestProvider(<Header />, {
        name: "translationKey",
      });

      const headerElement = getByRole("banner");
      const headerBrand = within(headerElement).getByText("translationKey");

      expect(headerBrand).toBeInTheDocument();
    });

    it("should translate 'name' from translation bundle with given key", async () => {
      const translations = {
        en: {
          translationKey: "Tests App",
        },
      };
      const { getByRole } = await renderTestProvider(
        <Header />,
        {
          name: "translationKey",
        },
        translations,
      );

      const headerElement = getByRole("banner");
      const headerBrand = within(headerElement).getByText("Tests App");

      expect(headerBrand).toBeInTheDocument();
    });
  });

  describe("`Header` component with navigationMode set to `ONLY_LEFT`", () => {
    it("should not have a navigation element", async () => {
      await renderTestProvider(<Header />, {
        menu: [
          {
            label: "dummyMenu1",
            target: "/dummyTarget1",
          },
          {
            label: "dummyMenu2",
            submenus: [
              {
                label: "subDummyMenu2",
                icon: {
                  iconType: "uikit",
                  name: "Play",
                },
                target: "/subDummyTarget2",
              },
            ],
          },
        ],
        navigationMode: "ONLY_LEFT",
      });

      const headerElement = screen.getByRole("banner");
      expect(headerElement).toBeInTheDocument();

      const headerNavigationElement =
        within(headerElement).queryByRole("navigation");
      expect(headerNavigationElement).not.toBeInTheDocument();
    });
  });

  describe("`Header` with vertical navigation panel", () => {
    it("should display the button to toggle the vertical navigation menu in compact mode only if there are menu items", async () => {
      navigationContextSpy.mockImplementation(() => ({
        ...useNavigationContextDefaultMock,
        verticalNavigationItems: [
          {
            id: "1",
            label: "dummyMenu1",
            path: "/dummyTarget1",
          },
        ],
        hasVerticalNavigation: true,
        isCompactMode: true,
      }));

      const { queryByRole } = await renderTestProvider(<Header />);

      expect(
        queryByRole("button", {
          name: "Close navigation panel",
        }),
      ).toBeInTheDocument();
    });

    it("should not display the button to toggle the vertical navigation menu in compact mode if there are no menu items", async () => {
      navigationContextSpy.mockImplementation(() => ({
        ...useNavigationContextDefaultMock,
        hasVerticalNavigation: true,
        isCompactMode: true,
      }));

      const { queryByRole } = await renderTestProvider(<Header />);

      expect(
        queryByRole("button", {
          name: "Close navigation panel",
        }),
      ).not.toBeInTheDocument();
    });

    it("should have the open button with the correct aria-label when the panel is open", async () => {
      navigationContextSpy.mockImplementation(() => ({
        ...useNavigationContextDefaultMock,
        verticalNavigationItems: [
          {
            id: "1",
            label: "dummyMenu1",
            path: "/dummyTarget1",
          },
        ],
        hasVerticalNavigation: true,
        isCompactMode: true,
        verticalNavigationMode: "CLOSED",
      }));

      const { queryByRole } = await renderTestProvider(<Header />);

      expect(
        queryByRole("button", {
          name: "Open navigation panel",
        }),
      ).toBeInTheDocument();
    });

    it("should trigger the function to toggle the vertical navigation panel when clicking the toggle", async () => {
      const user = userEvent.setup();
      const switchVerticalNavigationModeMock = vi.fn();
      navigationContextSpy.mockImplementation(() => ({
        ...useNavigationContextDefaultMock,
        verticalNavigationItems: [
          {
            id: "1",
            label: "dummyMenu1",
            path: "/dummyTarget1",
          },
        ],
        hasVerticalNavigation: true,
        isCompactMode: true,
        verticalNavigationMode: "EXPANDED",
        switchVerticalNavigationMode: switchVerticalNavigationModeMock,
      }));

      const { getByRole } = await renderTestProvider(<Header />);

      const button = getByRole("button", {
        name: "Close navigation panel",
      });

      await user.click(button);

      expect(switchVerticalNavigationModeMock).toHaveBeenCalledTimes(1);
    });

    it("should not have a navigation element when in compact mode", async () => {
      navigationContextSpy.mockImplementation(() => ({
        ...useNavigationContextDefaultMock,
        items: [
          {
            id: "1",
            label: "dummyMenu1",
            path: "/dummyTarget1",
          },
        ],
        verticalNavigationItems: [
          {
            id: "1",
            label: "dummyMenu1",
            path: "/dummyTarget1",
          },
        ],
        hasVerticalNavigation: true,
        isCompactMode: true,
        verticalNavigationMode: "EXPANDED",
      }));

      const { getByRole } = await renderTestProvider(<Header />);

      const headerElement = getByRole("banner");
      expect(headerElement).toBeInTheDocument();

      expect(
        within(headerElement).queryByRole("navigation"),
      ).not.toBeInTheDocument();
    });
  });
});
