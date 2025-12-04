import type { Path } from "react-router-dom";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import { useHvNavigation } from "./useNavigation";

const mockUseHvAppShellModel = vi.fn();
const mockUseNavigate = vi.fn();
const mockUseLocation = vi.fn();
let mockViewContext = { id: "testApp" };

vi.mock("@hitachivantara/app-shell-shared", () => ({
  useHvAppShellModel: () => mockUseHvAppShellModel(),
  HvAppShellViewContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...(mod as object),
    useNavigate: () => mockUseNavigate,
    useLocation: () => mockUseLocation(),
  };
});

// Mock React context for view context
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...(actual as object),
    useContext: vi.fn(() => mockViewContext),
  };
});

const consoleMock = vi.spyOn(console, "warn").mockImplementation(() => ({}));

describe("useHvNavigation", () => {
  beforeEach(() => {
    mockUseNavigate.mockReset();
    mockUseLocation.mockReset();
    mockUseHvAppShellModel.mockReset();
    consoleMock.mockClear();
    mockViewContext = { id: "testApp" };

    // Default location mock
    mockUseLocation.mockReturnValue({
      pathname: "/test",
      search: "",
      hash: "",
      state: null,
      key: "default",
      views: [],
    });
  });

  describe("getViewRoute", () => {
    describe("basic navigation", () => {
      beforeEach(() => {
        mockUseHvAppShellModel.mockReturnValue({
          mainPanel: {
            views: [
              { bundle: "testApp/pages/Home.js", route: "/home" },
              { bundle: "testApp/pages/About.js", route: "/about" },
              { bundle: "testApp/pages/Contact.js", route: "/contact" },
            ],
          },
        } satisfies Partial<HvAppShellConfig>);
      });

      it("should return route for a simple view", () => {
        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        expect(getViewRoute("testApp/pages/Home.js")).toBe("/home");
        expect(getViewRoute("testApp/pages/About.js")).toBe("/about");
      });

      it("should return undefined for non-existent view", () => {
        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        expect(getViewRoute("testApp/pages/NonExistent.js")).toBeUndefined();
      });

      it("should work with bundle names without .js extension", () => {
        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        expect(getViewRoute("testApp/pages/Home")).toBe("/home");
      });
    });

    describe("app-internal navigation (/ prefix)", () => {
      beforeEach(() => {
        mockViewContext = { id: "testApp" };
        mockUseHvAppShellModel.mockReturnValue({
          mainPanel: {
            views: [
              { bundle: "testApp/pages/Dashboard.js", route: "/dashboard" },
              { bundle: "testApp/pages/Settings.js", route: "/settings" },
              {
                bundle: "otherApp/pages/Dashboard.js",
                route: "/other-dashboard",
              },
            ],
          },
        } satisfies Partial<HvAppShellConfig>);
      });

      it("should resolve local paths using app context", () => {
        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        expect(getViewRoute("/pages/Dashboard")).toBe("/dashboard");
        expect(getViewRoute("/pages/Settings")).toBe("/settings");
      });

      it("should not return routes from other apps", () => {
        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        // Should not match otherApp's dashboard
        expect(getViewRoute("/pages/Dashboard")).toBe("/dashboard");
      });
    });

    describe("path parameters", () => {
      beforeEach(() => {
        mockUseHvAppShellModel.mockReturnValue({
          mainPanel: {
            views: [
              { bundle: "testApp/pages/User.js", route: "/users/:userId" },
              {
                bundle: "testApp/pages/Product.js",
                route: "/products/:productId",
              },
            ],
          },
        } satisfies Partial<HvAppShellConfig>);
      });

      it("should compile route with path parameters", () => {
        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        expect(
          getViewRoute({
            viewBundle: "testApp/pages/User.js",
            pathParams: { userId: "123" },
          }),
        ).toBe("/users/123");

        expect(
          getViewRoute({
            viewBundle: "testApp/pages/Product.js",
            pathParams: { productId: "abc" },
          }),
        ).toBe("/products/abc");
      });

      it("should include search and hash in compiled route", () => {
        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        expect(
          getViewRoute({
            viewBundle: "testApp/pages/User.js",
            pathParams: { userId: "123" },
            search: "?tab=profile",
            hash: "#section",
          }),
        ).toBe("/users/123?tab=profile#section");
      });
    });

    describe("nested views", () => {
      beforeEach(() => {
        mockUseHvAppShellModel.mockReturnValue({
          mainPanel: {
            views: [
              {
                bundle: "testApp/pages/Users.js",
                route: "/users/:userId",
                views: [
                  { bundle: "testApp/pages/UserProfile.js", route: "/profile" },
                  {
                    bundle: "testApp/pages/UserSettings.js",
                    route: "/settings",
                  },
                ],
              },
            ],
          },
        } satisfies Partial<HvAppShellConfig>);
      });

      it("should return flattened route for nested views", () => {
        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        expect(getViewRoute("testApp/pages/UserProfile.js")).toBe(
          "/users/:userId/profile",
        );
        expect(getViewRoute("testApp/pages/UserSettings.js")).toBe(
          "/users/:userId/settings",
        );
      });
    });

    describe("search mode: top", () => {
      beforeEach(() => {
        mockUseHvAppShellModel.mockReturnValue({
          mainPanel: {
            views: [
              { bundle: "testApp/pages/Contact.js", route: "/contact" },
              {
                bundle: "testApp/pages/Contact.js",
                route: "/users/:id/contact",
              },
              {
                bundle: "testApp/pages/Contact.js",
                route: "/deep/path/contact",
              },
            ],
          },
        } satisfies Partial<HvAppShellConfig>);
      });

      it("should return the shallowest matching view", () => {
        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        // Should return /contact (least path segments)
        expect(getViewRoute("testApp/pages/Contact.js", { mode: "top" })).toBe(
          "/contact",
        );
      });
    });

    describe("search mode: auto", () => {
      beforeEach(() => {
        mockUseHvAppShellModel.mockReturnValue({
          mainPanel: {
            views: [
              { bundle: "testApp/pages/Contact.js", route: "/contact" },
              {
                bundle: "testApp/pages/Users.js",
                route: "/users/:id",
                views: [
                  { bundle: "testApp/pages/Contact.js", route: "/contact" },
                ],
              },
            ],
          },
        } satisfies Partial<HvAppShellConfig>);
      });

      it("should prefer views within current location path", () => {
        mockUseLocation.mockReturnValue({
          pathname: "/users/123",
          search: "",
          hash: "",
          state: null,
          key: "default",
          views: [{ bundle: "testApp/pages/Users.js", route: "/users/:id" }],
        });

        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        // Should prefer the nested contact route since we're in /users/:id
        expect(getViewRoute("testApp/pages/Contact.js")).toBe(
          "/users/:id/contact",
        );
      });

      it("should fallback to shallower routes when no subpath match", () => {
        mockUseLocation.mockReturnValue({
          pathname: "/other",
          search: "",
          hash: "",
          state: null,
          key: "default",
          views: [],
        });

        const { result } = renderHook(() => useHvNavigation());
        const { getViewRoute } = result.current;

        // Should fall back to root-level contact
        expect(getViewRoute("testApp/pages/Contact.js")).toBe("/contact");
      });
    });
  });

  describe("navigate", () => {
    beforeEach(() => {
      mockUseHvAppShellModel.mockReturnValue({
        mainPanel: {
          views: [
            { bundle: "testApp/pages/Home.js", route: "/home" },
            { bundle: "testApp/pages/About.js", route: "/about" },
          ],
        },
      } satisfies Partial<HvAppShellConfig>);
    });

    it("should navigate to a view by bundle name", () => {
      const { result } = renderHook(() => useHvNavigation());
      const { navigate } = result.current;

      navigate("testApp/pages/Home.js");

      expect(mockUseNavigate).toHaveBeenCalledWith("/home", undefined);
    });

    it("should navigate with string path", () => {
      const { result } = renderHook(() => useHvNavigation());
      const { navigate } = result.current;

      navigate("/custom/path");

      expect(mockUseNavigate).toHaveBeenCalledWith("/custom/path", undefined);
    });

    it("should navigate with Path object", () => {
      const { result } = renderHook(() => useHvNavigation());
      const { navigate } = result.current;

      const path: Partial<Path> = {
        pathname: "/custom",
        search: "?q=test",
        hash: "#section",
      };

      navigate(path);

      expect(mockUseNavigate).toHaveBeenCalledWith(path, undefined);
    });

    it("should pass navigation options", () => {
      const { result } = renderHook(() => useHvNavigation());
      const { navigate } = result.current;

      navigate("testApp/pages/About.js", {
        replace: true,
        state: { from: "home" },
      });

      expect(mockUseNavigate).toHaveBeenCalledWith("/about", {
        replace: true,
        state: { from: "home" },
      });
    });

    it("should warn when navigating to non-existent view", () => {
      const { result } = renderHook(() => useHvNavigation());
      const { navigate } = result.current;

      navigate({ viewBundle: "testApp/pages/NonExistent.js" });

      expect(consoleMock).toHaveBeenCalledWith(
        expect.stringContaining("non existing path"),
      );
      expect(mockUseNavigate).not.toHaveBeenCalled();
    });

    it("should navigate to string destination even if not in config", () => {
      const { result } = renderHook(() => useHvNavigation());
      const { navigate } = result.current;

      navigate("/unknown/path");

      expect(mockUseNavigate).toHaveBeenCalledWith("/unknown/path", undefined);
      expect(consoleMock).not.toHaveBeenCalled();
    });

    it("should pass mode option to getViewRoute but not to useNavigate", () => {
      const { result } = renderHook(() => useHvNavigation());
      const { navigate } = result.current;

      navigate("testApp/pages/Home.js", { mode: "top", replace: true });

      expect(mockUseNavigate).toHaveBeenCalledWith("/home", { replace: true });
    });
  });

  describe("scoped packages", () => {
    beforeEach(() => {
      mockUseHvAppShellModel.mockReturnValue({
        mainPanel: {
          views: [
            { bundle: "@scope/app/pages/Home.js", route: "/home" },
            { bundle: "@scope/app/pages/About.js", route: "/about" },
          ],
        },
      } satisfies Partial<HvAppShellConfig>);
    });

    it("should handle scoped package names", () => {
      const { result } = renderHook(() => useHvNavigation());
      const { getViewRoute } = result.current;

      expect(getViewRoute("@scope/app/pages/Home.js")).toBe("/home");
      expect(getViewRoute("@scope/app/pages/About")).toBe("/about");
    });
  });

  describe("memoization", () => {
    beforeEach(() => {
      mockUseHvAppShellModel.mockReturnValue({
        mainPanel: {
          views: [{ bundle: "testApp/pages/Home.js", route: "/home" }],
        },
      } satisfies Partial<HvAppShellConfig>);
    });

    it("should return stable getViewRoute and navigate functions", () => {
      const { result, rerender } = renderHook(() => useHvNavigation());

      const firstGetViewRoute = result.current.getViewRoute;
      const firstNavigate = result.current.navigate;

      rerender();

      expect(result.current.getViewRoute).toBe(firstGetViewRoute);
      expect(result.current.navigate).toBe(firstNavigate);
    });
  });
});
