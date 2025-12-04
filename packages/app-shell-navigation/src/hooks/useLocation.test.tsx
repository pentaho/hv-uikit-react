import type { Location } from "react-router-dom";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHvLocation } from "./useLocation";

const mockUseLocation = vi.fn();
const mockUseHvAppShellModel = vi.fn();

vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...(mod as object),
    useLocation: () => mockUseLocation(),
  };
});

vi.mock("@hitachivantara/app-shell-shared", () => ({
  useHvAppShellModel: () => mockUseHvAppShellModel(),
}));

describe("useHvLocation", () => {
  beforeEach(() => {
    mockUseLocation.mockReset();
    mockUseHvAppShellModel.mockReset();
  });

  it("should return location properties from react-router-dom useLocation", () => {
    const location: Location = {
      pathname: "/dummyRoute1",
      search: "?asd=123",
      hash: "#test",
      state: { test: "test" },
      key: "default",
    };

    mockUseLocation.mockReturnValue(location);
    mockUseHvAppShellModel.mockReturnValue({ mainPanel: { views: [] } });

    const { result } = renderHook(() => useHvLocation());

    expect(result.current.pathname).toBe(location.pathname);
    expect(result.current.search).toBe(location.search);
    expect(result.current.hash).toBe(location.hash);
    expect(result.current.state).toBe(location.state);
    expect(result.current.key).toBe(location.key);
  });

  it("should return empty views array when no views are configured", () => {
    const location: Location = {
      pathname: "/any-route",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };

    mockUseLocation.mockReturnValue(location);
    mockUseHvAppShellModel.mockReturnValue({});

    const { result } = renderHook(() => useHvLocation());

    expect(result.current.views).toEqual([]);
  });

  it("should return empty views array when location doesn't match any configured routes", () => {
    const location: Location = {
      pathname: "/non-existent-route",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };

    mockUseLocation.mockReturnValue(location);
    mockUseHvAppShellModel.mockReturnValue({
      mainPanel: {
        views: [
          { bundle: "pages/Page1.js", route: "/page1" },
          { bundle: "pages/Page2.js", route: "/page2" },
        ],
      },
    });

    const { result } = renderHook(() => useHvLocation());

    expect(result.current.views).toEqual([]);
  });

  it("should match a single view", () => {
    const location: Location = {
      pathname: "/page1",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };

    mockUseLocation.mockReturnValue(location);
    mockUseHvAppShellModel.mockReturnValue({
      mainPanel: {
        views: [
          { bundle: "pages/Page1.js", route: "/page1" },
          { bundle: "pages/Page2.js", route: "/page2" },
        ],
      },
    });

    const { result } = renderHook(() => useHvLocation());

    expect(result.current.views).toHaveLength(1);
    expect(result.current.views[0].bundle).toBe("pages/Page1.js");
  });

  it("should match nested views", () => {
    const location: Location = {
      pathname: "/products/123/details",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };

    mockUseLocation.mockReturnValue(location);
    mockUseHvAppShellModel.mockReturnValue({
      mainPanel: {
        views: [
          {
            bundle: "pages/Products.js",
            route: "/products/:id",
            views: [
              { bundle: "pages/ProductDetails.js", route: "/details" },
              { bundle: "pages/ProductReviews.js", route: "/reviews" },
            ],
          },
        ],
      },
    });

    const { result } = renderHook(() => useHvLocation());

    expect(result.current.views).toHaveLength(2);
    expect(result.current.views[0].bundle).toBe("pages/Products.js");
    expect(result.current.views[1].bundle).toBe("pages/ProductDetails.js");
  });

  it("should match index views", () => {
    const location: Location = {
      pathname: "/products/123",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };

    mockUseLocation.mockReturnValue(location);
    mockUseHvAppShellModel.mockReturnValue({
      mainPanel: {
        views: [
          {
            bundle: "pages/Products.js",
            route: "/products/:id",
            views: [
              { bundle: "pages/ProductIndex.js", route: "/" },
              { bundle: "pages/ProductDetails.js", route: "/details" },
            ],
          },
        ],
      },
    });

    const { result } = renderHook(() => useHvLocation());

    expect(result.current.views).toHaveLength(2);
    expect(result.current.views[0].bundle).toBe("pages/Products.js");
    expect(result.current.views[1].bundle).toBe("pages/ProductIndex.js");
  });

  it("should match deeply nested views", () => {
    const location: Location = {
      pathname: "/products/123/reviews/456",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };

    mockUseLocation.mockReturnValue(location);
    mockUseHvAppShellModel.mockReturnValue({
      mainPanel: {
        views: [
          {
            bundle: "pages/Products.js",
            route: "/products/:productId",
            views: [
              {
                bundle: "pages/Reviews.js",
                route: "/reviews/:reviewId",
                views: [{ bundle: "pages/ReviewDetails.js", route: "/" }],
              },
            ],
          },
        ],
      },
    });

    const { result } = renderHook(() => useHvLocation());

    expect(result.current.views).toHaveLength(3);
    expect(result.current.views[0].bundle).toBe("pages/Products.js");
    expect(result.current.views[1].bundle).toBe("pages/Reviews.js");
    expect(result.current.views[2].bundle).toBe("pages/ReviewDetails.js");
  });

  it("should memoize result when dependencies don't change", () => {
    const location: Location = {
      pathname: "/page1",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };

    const config = {
      mainPanel: {
        views: [{ bundle: "pages/Page1.js", route: "/page1" }],
      },
    };

    mockUseLocation.mockReturnValue(location);
    mockUseHvAppShellModel.mockReturnValue(config);

    const { result, rerender } = renderHook(() => useHvLocation());

    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it("should recalculate when location changes", () => {
    const config = {
      mainPanel: {
        views: [
          { bundle: "pages/Page1.js", route: "/page1" },
          { bundle: "pages/Page2.js", route: "/page2" },
        ],
      },
    };

    mockUseLocation.mockReturnValue({
      pathname: "/page1",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });
    mockUseHvAppShellModel.mockReturnValue(config);

    const { result, rerender } = renderHook(() => useHvLocation());

    expect(result.current.views[0].bundle).toBe("pages/Page1.js");

    mockUseLocation.mockReturnValue({
      pathname: "/page2",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });

    rerender();

    expect(result.current.views[0].bundle).toBe("pages/Page2.js");
  });

  it("should recalculate when config views change", () => {
    const location: Location = {
      pathname: "/page1",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };

    mockUseLocation.mockReturnValue(location);
    mockUseHvAppShellModel.mockReturnValue({
      mainPanel: {
        views: [{ bundle: "pages/OldPage1.js", route: "/page1" }],
      },
    });

    const { result, rerender } = renderHook(() => useHvLocation());

    expect(result.current.views[0].bundle).toBe("pages/OldPage1.js");

    mockUseHvAppShellModel.mockReturnValue({
      mainPanel: {
        views: [{ bundle: "pages/NewPage1.js", route: "/page1" }],
      },
    });

    rerender();

    expect(result.current.views[0].bundle).toBe("pages/NewPage1.js");
  });
});
