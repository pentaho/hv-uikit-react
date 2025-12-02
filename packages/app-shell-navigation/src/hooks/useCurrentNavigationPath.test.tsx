import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import TestProvider from "../tests/TestProvider";
import { useHvCurrentNavigationPath } from "./useCurrentNavigationPath";

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

const locationMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...(mod as object),
    useLocation: () => locationMock(),
  };
});

describe("useMenuState Hook", () => {
  describe("Empty config", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider>{children}</TestProvider>
    );

    beforeAll(() => {
      appShellModelSpy.mockReturnValue({});
      locationMock.mockReturnValue({
        pathname: "",
        search: "",
        hash: "",
      });
    });

    it("should return empty items array and no menu `id` to be selected", () => {
      const { result } = renderHook(useHvCurrentNavigationPath, { wrapper });
      const paths = result.current;
      expect(paths).toEqual([]);
    });
  });
});

describe("non empty configuration", () => {
  beforeEach(() => {
    appShellModelSpy.mockImplementation(() => ({
      menu: [
        {
          label: "dummyMenu0",
          target: "/dummyTarget0",
        },
        {
          label: "dummyMenu1",
          submenus: [
            {
              label: "dummyMenu1-0",
              target: "/dummyTarget1-0",
            },
            {
              label: "dummyMenu1-1",
              submenus: [
                {
                  label: "dummyMenu1-1-0",
                  submenus: [
                    {
                      label: "dummyMenu1-1-0-0",
                      target: "/dummyTarget1-1-0-0",
                    },
                    {
                      label: "dummyMenu1-1-0-1",
                      target: "/dummyTarget1-1-0-1",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }));
  });

  it("should return the path when selected item is in menu", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider>{children}</TestProvider>
    );

    locationMock.mockReturnValue({
      pathname: "/dummyTarget1-1-0-0",
      search: "",
      hash: "",
    });

    const { result } = renderHook(useHvCurrentNavigationPath, { wrapper });
    const paths = result.current;
    expect(paths).toEqual([
      {
        label: "dummyMenu1",
        path: undefined,
      },
      {
        label: "dummyMenu1-1",
        path: undefined,
      },
      {
        label: "dummyMenu1-1-0",
        path: undefined,
      },
      {
        label: "dummyMenu1-1-0-0",
        path: "./dummyTarget1-1-0-0",
      },
    ]);
  });

  it("should return empty array if location is not in config", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider>{children}</TestProvider>
    );

    locationMock.mockReturnValue({
      pathname: "",
      state: { selectedItemId: "2-0" },
      search: "",
      hash: "",
    });

    const { result } = renderHook(useHvCurrentNavigationPath, { wrapper });
    const paths = result.current;
    expect(paths).toEqual([]);
  });

  it("should use translations", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => {
      const bundles = {
        en: {
          "dummyMenu1-1-0-0": "Last menu item",
        },
      };
      return <TestProvider bundles={bundles}>{children}</TestProvider>;
    };

    locationMock.mockReturnValue({
      pathname: "/dummyTarget1-1-0-0",
      search: "",
      hash: "",
    });

    const { result } = renderHook(useHvCurrentNavigationPath, { wrapper });
    const paths = result.current;
    expect(paths).toEqual([
      {
        label: "dummyMenu1",
        path: undefined,
      },
      {
        label: "dummyMenu1-1",
        path: undefined,
      },
      {
        label: "dummyMenu1-1-0",
        path: undefined,
      },
      {
        label: "Last menu item",
        path: "./dummyTarget1-1-0-0",
      },
    ]);
  });
});
