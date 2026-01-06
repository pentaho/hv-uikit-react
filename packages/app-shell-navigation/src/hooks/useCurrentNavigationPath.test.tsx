import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHvCurrentNavigationPath } from "./useCurrentNavigationPath";

// Mock only direct dependencies
const mockUseHvMenuItems = vi.fn();

vi.mock("@hitachivantara/app-shell-shared", () => ({
  useHvMenuItems: () => mockUseHvMenuItems(),
}));

describe("useHvCurrentNavigationPath", () => {
  beforeEach(() => {
    mockUseHvMenuItems.mockReset();
  });

  describe("empty or no selection", () => {
    it("should return empty array when no menu item is selected", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [],
        selectedMenuItemId: undefined,
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current).toEqual([]);
    });

    it("should return empty array when selectedMenuItemId is null", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [{ label: "Home", href: "/home" }],
        selectedMenuItemId: null,
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current).toEqual([]);
    });

    it("should return empty array when selectedMenuItemId is empty string", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [{ label: "Home", href: "/home" }],
        selectedMenuItemId: "",
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current).toEqual([]);
    });
  });

  describe("single level navigation", () => {
    it("should return path for single selected item", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [
          { label: "Home", href: "/home" },
          { label: "About", href: "/about" },
        ],
        selectedMenuItemId: "0",
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current).toEqual([{ label: "Home", path: "/home" }]);
    });

    it("should return path for different selected item", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [
          { label: "Home", href: "/home" },
          { label: "About", href: "/about" },
        ],
        selectedMenuItemId: "1",
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current).toEqual([{ label: "About", path: "/about" }]);
    });
  });

  describe("multi-level navigation", () => {
    it("should return breadcrumb path for nested items", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [
          {
            label: "Products",
            data: [
              { label: "Category A", href: "/products/category-a" },
              { label: "Category B", href: "/products/category-b" },
            ],
          },
        ],
        selectedMenuItemId: "0-0",
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current).toEqual([
        { label: "Products", path: undefined },
        { label: "Category A", path: "/products/category-a" },
      ]);
    });

    it("should handle deeply nested navigation paths", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [
          {
            label: "Products",
            data: [
              {
                label: "Electronics",
                data: [
                  { label: "Phones", href: "/products/electronics/phones" },
                  { label: "Laptops", href: "/products/electronics/laptops" },
                ],
              },
              { label: "Clothing", href: "/products/clothing" },
            ],
          },
        ],
        selectedMenuItemId: "0-0-1",
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current).toEqual([
        { label: "Products", path: undefined },
        { label: "Electronics", path: undefined },
        { label: "Laptops", path: "/products/electronics/laptops" },
      ]);
    });

    it("should handle path with parent items without href", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [
          {
            label: "Settings",
            data: [
              {
                label: "User",
                data: [
                  { label: "Profile", href: "/settings/user/profile" },
                  { label: "Preferences", href: "/settings/user/preferences" },
                ],
              },
            ],
          },
        ],
        selectedMenuItemId: "0-0-0",
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current).toEqual([
        { label: "Settings", path: undefined },
        { label: "User", path: undefined },
        { label: "Profile", path: "/settings/user/profile" },
      ]);
    });
  });

  describe("path property handling", () => {
    it("should set path to undefined for items with data (submenus)", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [
          {
            label: "Parent",
            data: [{ label: "Child", href: "/parent/child" }],
          },
        ],
        selectedMenuItemId: "0-0",
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current[0]).toEqual({ label: "Parent", path: undefined });
      expect(result.current[1]).toEqual({
        label: "Child",
        path: "/parent/child",
      });
    });

    it("should set path to href for leaf items", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [{ label: "Contact", href: "/contact" }],
        selectedMenuItemId: "0",
      });

      const { result } = renderHook(() => useHvCurrentNavigationPath());

      expect(result.current).toEqual([{ label: "Contact", path: "/contact" }]);
    });
  });

  describe("memoization", () => {
    it("should return same reference when inputs don't change", () => {
      const menuData = {
        items: [{ label: "Home", href: "/home" }],
        selectedMenuItemId: "0",
      };

      mockUseHvMenuItems.mockReturnValue(menuData);

      const { result, rerender } = renderHook(() =>
        useHvCurrentNavigationPath(),
      );
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it("should return new reference when selectedMenuItemId changes", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [
          { label: "Home", href: "/home" },
          { label: "About", href: "/about" },
        ],
        selectedMenuItemId: "0",
      });

      const { result, rerender } = renderHook(() =>
        useHvCurrentNavigationPath(),
      );
      const firstResult = result.current;

      mockUseHvMenuItems.mockReturnValue({
        items: [
          { label: "Home", href: "/home" },
          { label: "About", href: "/about" },
        ],
        selectedMenuItemId: "1",
      });

      rerender();
      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
      expect(firstResult).toEqual([{ label: "Home", path: "/home" }]);
      expect(secondResult).toEqual([{ label: "About", path: "/about" }]);
    });

    it("should return new reference when items change", () => {
      mockUseHvMenuItems.mockReturnValue({
        items: [{ label: "Home", href: "/home" }],
        selectedMenuItemId: "0",
      });

      const { result, rerender } = renderHook(() =>
        useHvCurrentNavigationPath(),
      );
      const firstResult = result.current;

      mockUseHvMenuItems.mockReturnValue({
        items: [{ label: "Dashboard", href: "/dashboard" }],
        selectedMenuItemId: "0",
      });

      rerender();
      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
      expect(firstResult).toEqual([{ label: "Home", path: "/home" }]);
      expect(secondResult).toEqual([
        { label: "Dashboard", path: "/dashboard" },
      ]);
    });
  });
});
