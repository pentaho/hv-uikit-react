import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHvMenuItems } from "./useMenuItems";

const mockUseLocation = vi.fn();
const mockUseHvAppShellModel = vi.fn();
const mockUseContext = vi.fn();

vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...(mod as object),
    useLocation: () => mockUseLocation(),
  };
});

vi.mock("../AppShellModelContext", () => ({
  useHvAppShellModel: () => mockUseHvAppShellModel(),
}));

// Mock React's useContext to provide i18n
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...(actual as object),
    useContext: (context: unknown) => mockUseContext(context),
  };
});

describe("useHvMenuItems", () => {
  beforeEach(() => {
    // Default mocks
    mockUseLocation.mockReturnValue({
      pathname: "/test",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });

    mockUseHvAppShellModel.mockReturnValue({
      menu: [],
      navigationMode: "TOP_AND_LEFT",
    });

    // Mock i18n context - return identity function for translations
    mockUseContext.mockReturnValue({
      i18n: {
        language: "en",
        getFixedT: () => (key: string) => key,
      },
    });
  });

  afterEach(() => {
    mockUseLocation.mockReset();
    mockUseHvAppShellModel.mockReset();
    mockUseContext.mockReset();
  });

  describe("empty configuration", () => {
    it("should return empty items array when no menu is configured", () => {
      mockUseHvAppShellModel.mockReturnValue({});

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.items).toEqual([]);
      expect(result.current.rootMenuItemId).toBeUndefined();
      expect(result.current.selectedMenuItemId).toBeUndefined();
    });

    it("should return empty items when menu is empty array", () => {
      mockUseHvAppShellModel.mockReturnValue({ menu: [] });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.items).toEqual([]);
      expect(result.current.rootMenuItemId).toBeUndefined();
      expect(result.current.selectedMenuItemId).toBeUndefined();
    });
  });

  describe("basic menu configuration", () => {
    beforeEach(() => {
      mockUseHvAppShellModel.mockReturnValue({
        menu: [
          { label: "Home", target: "/home" },
          { label: "About", target: "/about" },
          { label: "Contact", target: "/contact" },
        ],
        navigationMode: "TOP_AND_LEFT",
      });
    });

    it("should create menu items from configuration", () => {
      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.items).toHaveLength(3);
      expect(result.current.items[0].label).toBe("Home");
      expect(result.current.items[0].href).toBe("./home");
      expect(result.current.items[0].id).toBe("0");
      expect(result.current.items[1].label).toBe("About");
      expect(result.current.items[1].href).toBe("./about");
      expect(result.current.items[1].id).toBe("1");
    });

    it("should select menu item based on pathname", () => {
      mockUseLocation.mockReturnValue({
        pathname: "/about",
        search: "",
        hash: "",
        state: null,
        key: "default",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.selectedMenuItemId).toBe("1");
      expect(result.current.rootMenuItemId).toBe("1");
    });

    it("should not select any item when pathname doesn't match", () => {
      mockUseLocation.mockReturnValue({
        pathname: "/unknown",
        search: "",
        hash: "",
        state: null,
        key: "default",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.selectedMenuItemId).toBeUndefined();
      expect(result.current.rootMenuItemId).toBeUndefined();
    });

    it("should handle pathname with ./ prefix", () => {
      mockUseLocation.mockReturnValue({
        pathname: "./contact",
        search: "",
        hash: "",
        state: null,
        key: "default",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.selectedMenuItemId).toBe("2");
      expect(result.current.rootMenuItemId).toBe("2");
    });
  });

  describe("nested menu (submenus)", () => {
    beforeEach(() => {
      mockUseHvAppShellModel.mockReturnValue({
        menu: [
          {
            label: "Products",
            submenus: [
              { label: "Hardware", target: "/products/hardware" },
              { label: "Software", target: "/products/software" },
              { label: "Services", target: "/products/services" },
            ],
          },
          { label: "About", target: "/about" },
        ],
        navigationMode: "TOP_AND_LEFT",
      });
    });

    it("should create nested menu structure", () => {
      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].label).toBe("Products");
      expect(result.current.items[0].data).toHaveLength(3);
      expect(result.current.items[0].data?.[0].label).toBe("Hardware");
      expect(result.current.items[0].data?.[0].id).toBe("0-0");
    });

    it("should select submenu item and set correct root", () => {
      mockUseLocation.mockReturnValue({
        pathname: "/products/software",
        search: "",
        hash: "",
        state: null,
        key: "default",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.selectedMenuItemId).toBe("0-1");
      expect(result.current.rootMenuItemId).toBe("0");
    });
  });

  describe("navigationMode: ONLY_TOP", () => {
    it("should prune nested items beyond max depth", () => {
      mockUseHvAppShellModel.mockReturnValue({
        menu: [
          { label: "Home", target: "/home" },
          {
            label: "Products",
            submenus: [
              {
                label: "Category",
                submenus: [
                  {
                    label: "SubCategory",
                    target: "/products/category/sub",
                  },
                ],
              },
              { label: "All", target: "/products/all" },
            ],
          },
        ],
        navigationMode: "ONLY_TOP",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[1].data).toHaveLength(2);
      // Should flatten the third level
      expect(result.current.items[1].data?.[0].label).toBe("Category");
      expect(result.current.items[1].data?.[0].href).toBe(
        "./products/category/sub",
      );
      // Should not have nested data beyond max depth
      expect(result.current.items[1].data?.[0].data).toBeUndefined();
    });
  });

  describe("location state with selectedItemId", () => {
    beforeEach(() => {
      mockUseHvAppShellModel.mockReturnValue({
        menu: [
          {
            label: "Dashboard",
            submenus: [
              { label: "Overview", target: "/dashboard/overview" },
              { label: "Analytics", target: "/dashboard/analytics" },
              { label: "Reports", target: "/dashboard/reports" },
            ],
          },
          { label: "Settings", target: "/settings" },
        ],
        navigationMode: "TOP_AND_LEFT",
      });
    });

    it("should use selectedItemId from location state", () => {
      mockUseLocation.mockReturnValue({
        pathname: "/some/path",
        search: "",
        hash: "",
        state: { selectedItemId: "0-1" },
        key: "default",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.selectedMenuItemId).toBe("0-1");
      expect(result.current.rootMenuItemId).toBe("0");
    });

    it("should select first leaf item when selectedItemId has children", () => {
      mockUseLocation.mockReturnValue({
        pathname: "/some/path",
        search: "",
        hash: "",
        state: { selectedItemId: "0" },
        key: "default",
      });

      const { result } = renderHook(() => useHvMenuItems());

      // Should select first child (0-0) instead of parent (0)
      expect(result.current.selectedMenuItemId).toBe("0-0");
      expect(result.current.rootMenuItemId).toBe("0");
    });

    it("should handle leaf item selection from state", () => {
      mockUseLocation.mockReturnValue({
        pathname: "/some/path",
        search: "",
        hash: "",
        state: { selectedItemId: "1" },
        key: "default",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.selectedMenuItemId).toBe("1");
      expect(result.current.rootMenuItemId).toBe("1");
    });
  });

  describe("search parameter matching", () => {
    beforeEach(() => {
      mockUseHvAppShellModel.mockReturnValue({
        menu: [
          { label: "Dashboard", target: "/dashboard" },
          { label: "Reports", target: "/reports?tab=summary" },
        ],
        navigationMode: "TOP_AND_LEFT",
      });
    });

    it("should match menu item with search parameters", () => {
      mockUseLocation.mockReturnValue({
        pathname: "/reports",
        search: "?tab=summary",
        hash: "",
        state: null,
        key: "default",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.selectedMenuItemId).toBe("1");
    });
  });

  describe("updates on location change", () => {
    beforeEach(() => {
      mockUseHvAppShellModel.mockReturnValue({
        menu: [
          { label: "Home", target: "/home" },
          { label: "About", target: "/about" },
        ],
        navigationMode: "TOP_AND_LEFT",
      });
    });

    it("should update selectedMenuItemId when pathname changes", () => {
      mockUseLocation.mockReturnValue({
        pathname: "/home",
        search: "",
        hash: "",
        state: null,
        key: "default",
      });

      const { result, rerender } = renderHook(() => useHvMenuItems());

      expect(result.current.selectedMenuItemId).toBe("0");

      mockUseLocation.mockReturnValue({
        pathname: "/about",
        search: "",
        hash: "",
        state: null,
        key: "default",
      });

      rerender();

      expect(result.current.selectedMenuItemId).toBe("1");
    });
  });

  describe("i18n translations", () => {
    it("should use i18n for label translation", () => {
      const mockTranslate = vi.fn((key: string) => `translated_${key}`);

      mockUseContext.mockReturnValue({
        i18n: {
          language: "pt",
          getFixedT: () => mockTranslate,
        },
      });

      mockUseHvAppShellModel.mockReturnValue({
        menu: [{ label: "home", target: "/home" }],
        navigationMode: "TOP_AND_LEFT",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.items[0].label).toBe("translated_home");
      expect(mockTranslate).toHaveBeenCalledWith("home");
    });

    it("should fallback to identity function when i18n is not available", () => {
      mockUseContext.mockReturnValue(undefined);

      mockUseHvAppShellModel.mockReturnValue({
        menu: [{ label: "home", target: "/home" }],
        navigationMode: "TOP_AND_LEFT",
      });

      const { result } = renderHook(() => useHvMenuItems());

      expect(result.current.items[0].label).toBe("home");
    });
  });
});
