import { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import TestProvider from "../tests/TestProvider";
import { useHvMenuItems } from "./useMenuItems";

const appShellModelSpy = vi.fn();
const appShellConfigSpy = vi.fn();
vi.mock("../AppShellContext", async () => {
  const mod = await vi.importActual("../AppShellContext");
  return {
    ...(mod as object),
    useHvAppShellModel: vi.fn(() => appShellModelSpy()),
    useHvAppShellConfig: vi.fn(() => appShellConfigSpy()),
  };
});

const locationMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...(mod as object),
    useLocation: () => locationMock(),
  };
});

locationMock.mockReturnValue({
  pathname: "/dummyTarget1",
  state: {},
  search: "",
  hash: "",
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <TestProvider>{children}</TestProvider>
);

describe("useHvMenuItems Hook", () => {
  describe("Empty config", () => {
    it("should return empty items array and no menu `id` to be selected", () => {
      appShellModelSpy.mockReturnValue({});
      const { result } = renderHook(useHvMenuItems, { wrapper });
      expect(result.current).toBeDefined();
      expect(result.current.items.length).toBe(0);
      expect(result.current.rootMenuItemId).toBeUndefined();
    });
  });

  describe("Non empty configuration", () => {
    beforeAll(() => {
      appShellModelSpy.mockReturnValue({
        menu: [
          {
            label: "dummyMenu1",
            target: "/dummyTarget1",
          },
          {
            label: "dummyMenu2",
            target: "/dummyTarget2",
          },
        ],
      });
    });

    it("should return items array and no menu `id` to be selected when non menu pathname", () => {
      locationMock.mockReturnValue({
        pathname: "/dummyTargetUnknown",
        state: {},
        search: "",
        hash: "",
      });

      const { result } = renderHook(useHvMenuItems, { wrapper });
      expect(result.current).toBeDefined();
      expect(result.current.items.length).toBe(2);
      expect(result.current.rootMenuItemId).toBeUndefined();
    });

    it("should return valid items array and one menu `ìd` to be selected (pathname from parent element)", () => {
      locationMock.mockReturnValue({
        pathname: "./dummyTarget2",
        state: {},
        search: "",
        hash: "",
      });

      const { result } = renderHook(useHvMenuItems, { wrapper });
      expect(result.current).toBeDefined();
      expect(result.current.items.length).toBe(2);
      // dependent of the mocked location.pathname
      expect(result.current.selectedMenuItemId).toBe("1");
      expect(result.current.rootMenuItemId).toBe("1");
    });

    it("should prune the non-necessary item when using ONLY_TOP", () => {
      appShellModelSpy.mockImplementation(() => ({
        menu: [
          {
            label: "TopMenu1",
            target: "/top-menu-1",
          },
          {
            label: "TopMenu2",
            submenus: [
              {
                label: "SubMenu2-1",
                submenus: [
                  {
                    label: "SubMenu2-1-1",
                    target: "/sub-menu-2-1-1",
                  },
                ],
              },
              {
                label: "SubMenu2-2",
                target: "/sub-menu-2-2",
              },
            ],
          },
        ],
        navigationMode: "ONLY_TOP",
      }));

      const { result } = renderHook(useHvMenuItems, { wrapper });

      expect(result.current.items).toMatchObject([
        {
          href: "./top-menu-1",
          icon: undefined,
          id: "0",
          label: "TopMenu1",
          parent: undefined,
        },
        {
          data: [
            {
              href: "./sub-menu-2-1-1",
              icon: undefined,
              id: "1-0",
              label: "SubMenu2-1",
            },
            {
              href: "./sub-menu-2-2",
              icon: undefined,
              id: "1-1",
              label: "SubMenu2-2",
            },
          ],
          href: "./sub-menu-2-1-1",
          icon: undefined,
          id: "1",
          label: "TopMenu2",
          parent: undefined,
        },
      ]);
    });

    it("should return valid items array and one menu `ìd` to be selected (pathname from child element)", async () => {
      appShellModelSpy.mockImplementation(() => ({
        menu: [
          {
            label: "Menu 1",
            submenus: [
              {
                label: "Menu 1-1",
                target: "/menu1-1",
              },
              {
                label: "Menu 1-2",
                target: "/menu1-2",
              },
              {
                label: "Menu 1-3",
                target: "/menu1-3",
              },
            ],
          },
          {
            label: "Menu 2",
            target: "/menu2",
          },
          {
            label: "Menu 3",
            submenus: [
              {
                label: "Menu 3-1",
                target: "/menu3-1",
              },
              {
                label: "Menu 3-2",
                target: "/menu3-2",
              },
              {
                label: "Menu 3-3",
                target: "/menu3-3",
              },
            ],
          },
        ],
        navigationMode: "TOP_AND_LEFT",
      }));

      locationMock.mockReturnValue({
        pathname: "/menu3-3",
      });

      const { result } = renderHook(useHvMenuItems, { wrapper });

      expect(result.current.rootMenuItemId).toBe("2");
      expect(result.current.selectedMenuItemId).toBe("2-2");
    });
  });

  describe("With selectedItemId in state", () => {
    beforeAll(() => {
      appShellModelSpy.mockImplementation(() => ({
        menu: [
          {
            label: "Menu 1",
            submenus: [
              {
                label: "Menu 1-1",
                target: "/menu1-1",
              },
              {
                label: "Menu 1-2",
                target: "/menu1-2",
              },
              {
                label: "Menu 1-3",
                target: "/menu1-3",
              },
            ],
          },
          {
            label: "Menu 2",
            target: "/menu2",
          },
          {
            label: "Menu 3",
            submenus: [
              {
                label: "Menu 3-1",
                target: "/menu3-1",
              },
              {
                label: "Menu 3-2",
                target: "/menu3-2",
              },
              {
                label: "Menu 3-3",
                target: "/menu3-3",
              },
            ],
          },
        ],
      }));
    });

    it("should return the correct selected item id - based on the state", () => {
      locationMock.mockReturnValue({
        pathname: "",
        state: { selectedItemId: "1" },
        search: "",
        hash: "",
      });
      const { result } = renderHook(useHvMenuItems, { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.rootMenuItemId).toBe("1");
      expect(result.current.selectedMenuItemId).toBe("1");
    });

    it("should return the correct root menu item - based on the state", () => {
      locationMock.mockReturnValue({
        pathname: "",
        state: { selectedItemId: "0-2" },
        search: "",
        hash: "",
      });
      const { result } = renderHook(useHvMenuItems, { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.rootMenuItemId).toBe("0");
      expect(result.current.selectedMenuItemId).toBe("0-2");
    });

    it("should return the selectedMenuItemId when selected a root menu - based on the state", () => {
      locationMock.mockReturnValue({
        pathname: "",
        state: { selectedItemId: "0" },
        search: "",
        hash: "",
      });
      const { result } = renderHook(useHvMenuItems, { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.rootMenuItemId).toBe("0");
      expect(result.current.selectedMenuItemId).toBe("0-0");
    });
  });
});
