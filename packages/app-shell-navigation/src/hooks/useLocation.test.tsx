import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import {
  HvAppShellConfig,
  HvAppShellViewContext,
} from "@hitachivantara/app-shell-shared";

import TestProvider from "../tests/TestProvider";
import { useHvLocation } from "./useLocation";

const appShellConfigSpy = vi.fn();
const appShellModelSpy = vi.fn();
vi.mock("@hitachivantara/app-shell-shared", async () => {
  const mod = await vi.importActual("@hitachivantara/app-shell-shared");
  return {
    ...(mod as object),
    useHvAppShellConfig: vi.fn(() => appShellConfigSpy()),
    useHvAppShellModel: vi.fn(() => appShellModelSpy()),
  };
});

interface WrapperProps {
  children: React.ReactNode;
}

const mockedUseLocation = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...(mod as object),
    useLocation: vi.fn(() => mockedUseLocation()),
  };
});

describe("useLocation Hook", () => {
  const wrapper = ({ children }: WrapperProps) => (
    <TestProvider>
      <HvAppShellViewContext.Provider value={{ id: "dummyId" }}>
        {children}
      </HvAppShellViewContext.Provider>
    </TestProvider>
  );

  beforeAll(() => {
    appShellModelSpy.mockReturnValue({
      apps: {
        dummyId: "/",
        otherDummyId: "/",
      },
      mainPanel: {
        views: [
          {
            bundle: "dummyId/pages/Dummy1.js",
            route: "/dummyRoute1",
          },
          {
            bundle: "dummyId/pages/Dummy2.js",
            route: "/dummyRoute2",
          },
          {
            bundle: "dummyId/pages/Dummy3.js",
            route: "/dummyRoute3",
            views: [
              {
                bundle: "dummyId/pages/Dummy3-1.js",
                route: "/dummyRoute3-1",
              },
            ],
          },
          {
            bundle: "dummyId/pages/Dummy4.js",
            route: "/dummyRoute4/:id",
            views: [
              {
                bundle: "dummyId/pages/Dummy4-1.js",
                route: "/hello",
              },
              {
                bundle: "dummyId/pages/Dummy4-2.js",
                route: "/goodbye",
                views: [
                  {
                    bundle: "dummyId/pages/Dummy4-2-1.js",
                    route: "/:type",
                  },
                  {
                    bundle: "dummyId/pages/Dummy4-2-2.js",
                    route: "/again",
                  },
                ],
              },
              {
                bundle: "dummyId/pages/Dummy4-index.js",
                route: "/",
              },
            ],
          },
          {
            bundle: "otherDummyId/pages/Dummy1.js",
            route: "/doesnt/return/on/get/bundle/route",
          },
        ],
      },
    } satisfies HvAppShellConfig);
  });

  afterEach(() => mockedUseLocation.mockReset());

  it("should return regular useHvLocation() properties", () => {
    const location = {
      pathname: "/dummyRoute1",
      search: "?asd=123",
      hash: "#test",
      state: { test: "test" },
      key: "default",
    };

    vi.mocked(mockedUseLocation).mockReturnValue(location);

    const { result } = renderHook(() => useHvLocation(), {
      wrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.pathname).toBe(location.pathname);
    expect(result.current.search).toBe(location.search);
    expect(result.current.hash).toBe(location.hash);
    expect(result.current.state).toBe(location.state);
    expect(result.current.key).toBe(location.key);
  });

  it("should return regular useHvLocation() properties but no views when there aren't matches", () => {
    const location = {
      pathname: "/fakeRoute",
      search: "?asd=123",
      hash: "#test",
      state: { test: "test" },
      key: "default",
    };

    vi.mocked(mockedUseLocation).mockReturnValue(location);

    const { result } = renderHook(() => useHvLocation(), {
      wrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.views.length).toBe(0);
    expect(result.current.pathname).toBe(location.pathname);
    expect(result.current.search).toBe(location.search);
    expect(result.current.hash).toBe(location.hash);
    expect(result.current.state).toBe(location.state);
    expect(result.current.key).toBe(location.key);
  });

  it("should match view", () => {
    const location = {
      pathname: "/dummyRoute1",
      search: "",
      hash: "",
      state: null,
      key: "default",
    };

    vi.mocked(mockedUseLocation).mockReturnValue(location);

    const { result } = renderHook(() => useHvLocation(), {
      wrapper,
    });
    expect(result.current.views).toHaveLength(1);
    expect(result.current.views[0].bundle).toBe("dummyId/pages/Dummy1.js");
  });

  it("should match nested views", () => {
    const location = {
      pathname: "/dummyRoute4/world/hello",
      search: "?asd=123",
      hash: "#test",
      state: null,
      key: "default",
    };

    vi.mocked(mockedUseLocation).mockReturnValue(location);

    const { result } = renderHook(() => useHvLocation(), {
      wrapper,
    });
    expect(result.current.views).toHaveLength(2);
    expect(result.current.views[0].bundle).toBe("dummyId/pages/Dummy4.js");
    expect(result.current.views[1].bundle).toBe("dummyId/pages/Dummy4-1.js");
  });

  it("should match index views", () => {
    const location = {
      pathname: "/dummyRoute4/world",
      search: "?asd=123",
      hash: "#test",
      state: null,
      key: "default",
    };

    vi.mocked(mockedUseLocation).mockReturnValue(location);

    const { result } = renderHook(() => useHvLocation(), {
      wrapper,
    });
    expect(result.current.views).toHaveLength(2);
    expect(result.current.views[0].bundle).toBe("dummyId/pages/Dummy4.js");
    expect(result.current.views[1].bundle).toBe(
      "dummyId/pages/Dummy4-index.js",
    );
  });

  it("should match nested views inside nested views", () => {
    const location = {
      pathname: "/dummyRoute4/night/goodbye/day",
      search: "?asd=123",
      hash: "#test",
      state: null,
      key: "default",
    };

    vi.mocked(mockedUseLocation).mockReturnValue(location);

    const { result } = renderHook(() => useHvLocation(), {
      wrapper,
    });
    expect(result.current.views).toHaveLength(3);
    expect(result.current.views[0].bundle).toBe("dummyId/pages/Dummy4.js");
    expect(result.current.views[1].bundle).toBe("dummyId/pages/Dummy4-2.js");
    expect(result.current.views[2].bundle).toBe("dummyId/pages/Dummy4-2-1.js");
  });
});
