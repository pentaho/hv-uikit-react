import type { Path } from "react-router-dom";
import { renderHook } from "@testing-library/react";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  HvAppShellViewContext,
  type HvAppShellConfig,
} from "@hitachivantara/app-shell-shared";

import TestProvider from "../tests/TestProvider";
import { useHvNavigation } from "./useNavigation";

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

const mockedUseNavigate = vi.fn();
const mockedUseLocation = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...(mod as object),
    useNavigate: () => mockedUseNavigate,
    useLocation: vi.fn(() => mockedUseLocation()),
  };
});

const consoleMock = vi.spyOn(console, "warn").mockImplementation(() => ({}));

const someLocation = {
  pathname: "/dummyRoute1",
  search: "?asd=123",
  hash: "#test",
  state: { test: "test" },
  key: "default",
};

describe("useBundleNavigation Hook", () => {
  const wrapper = ({ children }: WrapperProps) => (
    <TestProvider>
      <HvAppShellViewContext.Provider value={{ id: "dummyId" }}>
        {children}
      </HvAppShellViewContext.Provider>
    </TestProvider>
  );

  /**
   * setups a mocked location to be returned by the useLocation hook
   * on tests were the current location is not relevant to the result
   */
  beforeEach(() => {
    vi.mocked(mockedUseLocation).mockReturnValue(someLocation);
  });

  afterEach(() => {
    mockedUseNavigate.mockReset();
    mockedUseLocation.mockReset();
  });

  describe("test `getViewRoute` method", () => {
    /**
     * tests calls where the bundle name is not provided
     * so the id on the HvAppShellViewContext is used
     */
    describe("app internal navigation", () => {
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
                  },
                  {
                    bundle: "dummyId/pages/Dummy4-3.js",
                    route: "/good-morning",
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

      it("should return the correct route (default mode)", () => {
        const { result } = renderHook(() => useHvNavigation(), {
          wrapper,
        });
        expect(result.current).toBeDefined();

        const { getViewRoute } = result.current;
        // even though the same bundle name exists on the two apps, the hook is wrapped
        // on the 'dummyId' context and thus should only return its "own" views
        expect(getViewRoute("/pages/Dummy1")).toBe("/dummyRoute1");
        expect(getViewRoute("/pages/Dummy2")).toBe("/dummyRoute2");
        expect(getViewRoute("/pages/Dummy3")).toBe("/dummyRoute3");
        expect(getViewRoute("/pages/NonExistent")).toBeUndefined();
        expect(
          getViewRoute({
            viewBundle: "/pages/Dummy4",
            pathParams: { id: "123" },
          }),
        ).toBe("/dummyRoute4/123");
      });

      it("should return undefined if appId not in configuration", () => {
        const wrapperTmp = ({ children }: WrapperProps) => (
          <TestProvider>
            <HvAppShellViewContext.Provider value={{ id: "nonExistentId" }}>
              {children}
            </HvAppShellViewContext.Provider>
          </TestProvider>
        );

        const { result } = renderHook(() => useHvNavigation(), {
          wrapper: wrapperTmp,
        });
        const { getViewRoute } = result.current;
        expect(getViewRoute("pages/Dummy1")).toBeUndefined();
      });
    });

    /**
     * tests calls where the bundle name is scoped (starts with @ and contains one /)
     */
    describe("scoped bundle navigation", () => {
      beforeAll(() => {
        appShellModelSpy.mockReturnValue({
          apps: { "@hv/dummyId": "/", dummyId: "/" },
          mainPanel: {
            views: [
              {
                bundle: "@hv/dummyId/pages/Dummy1.js",
                route: "/dummyRoute1",
              },
              {
                bundle: "@hv/dummyId/pages/Dummy2.js",
                route: "/dummyRoute2",
              },
              {
                bundle: "@hv/dummyId/pages/Dummy3.js",
                route: "/dummyRoute3",
              },
              {
                bundle: "@hv/dummyId/pages/Dummy4.js",
                route: "/dummyRoute4",
                views: [
                  {
                    bundle: "@hv/dummyId/pages/Dummy4-1.js",
                    route: "/hello",
                  },
                  {
                    bundle: "@hv/dummyId/pages/Dummy4-2.js",
                    route: "/goodbye",
                  },
                ],
              },
              {
                bundle: "dummyId/pages/Dummy1",
                route: "/doesnt/return/on/get/bundle/route",
              },
            ],
          },
        } satisfies HvAppShellConfig);
      });

      it("should return the correct route", () => {
        const { result } = renderHook(() => useHvNavigation(), {
          wrapper,
        });
        expect(result.current).toBeDefined();

        const { getViewRoute } = result.current;
        // even though the same bundle name exists on the two apps, the hook is wrapped
        // on the 'dummyId' context and thus should only return its "own" views
        expect(getViewRoute("@hv/dummyId/pages/Dummy1")).toBe("/dummyRoute1");
        expect(getViewRoute("@hv/dummyId/pages/Dummy2")).toBe("/dummyRoute2");
        expect(getViewRoute("@hv/dummyId/pages/Dummy3")).toBe("/dummyRoute3");
        expect(getViewRoute("@hv/dummyId/pages/NonExistent")).toBeUndefined();
        expect(
          getViewRoute({
            viewBundle: "@hv/dummyId/pages/Dummy4",
            search: "?color=dark",
            hash: "#QWERTY",
          }),
        ).toBe("/dummyRoute4?color=dark#QWERTY");
        expect(
          getViewRoute({
            viewBundle: "@hv/dummyId/pages/Dummy4-1",
            search: "?color=dark",
            hash: "#QWERTY",
          }),
        ).toBe("/dummyRoute4/hello?color=dark#QWERTY");
        expect(
          getViewRoute({
            viewBundle: "@hv/dummyId/pages/Dummy4-2",
            search: "?color=dark",
            hash: "#QWERTY",
          }),
        ).toBe("/dummyRoute4/goodbye?color=dark#QWERTY");
      });

      it("should return undefined if appId not in configuration", () => {
        const { result } = renderHook(() => useHvNavigation(), {
          wrapper,
        });
        const { getViewRoute } = result.current;
        expect(getViewRoute("@hv/dummyId2/pages/Dummy2")).toBeUndefined();
      });
    });

    /**
     * tests calls where the bundle name is not scoped (it's just word before the first /)
     */
    describe("non scoped bundle navigation", () => {
      beforeAll(() => {
        appShellModelSpy.mockReturnValue({
          apps: { dummyId: "/", "@hv/dummyId": "/" },
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

      it("should return the correct route", () => {
        const { result } = renderHook(() => useHvNavigation(), {
          wrapper,
        });
        expect(result.current).toBeDefined();

        const { getViewRoute } = result.current;
        // even though the same bundle name exists on the two apps, the hook is wrapped
        // on the 'dummyId' context and thus should only return its "own" views
        expect(getViewRoute("dummyId/pages/Dummy1")).toBe("/dummyRoute1");
        expect(getViewRoute("dummyId/pages/Dummy2")).toBe("/dummyRoute2");
        expect(getViewRoute("dummyId/pages/Dummy3")).toBe("/dummyRoute3");
        expect(getViewRoute("dummyId/pages/Dummy4-1")).toBe(
          "/dummyRoute4/:id/hello",
        );
        expect(getViewRoute("dummyId/pages/Dummy4-2")).toBe(
          "/dummyRoute4/:id/goodbye",
        );
        expect(getViewRoute("dummyId/pages/NonExistent")).toBeUndefined();
        expect(
          getViewRoute({
            viewBundle: "dummyId/pages/Dummy4",
            pathParams: {
              id: "123",
            },
            search: "?x=y",
            hash: "#QW",
          }),
        ).toBe("/dummyRoute4/123?x=y#QW");
      });

      it("should return undefined if appId not in configuration", () => {
        const { result } = renderHook(() => useHvNavigation(), {
          wrapper,
        });
        const { getViewRoute } = result.current;
        expect(getViewRoute("dummyId2/pages/Dummy3")).toBeUndefined();
      });
    });

    /**
     * tests view search modes
     */
    describe("view search modes", () => {
      beforeAll(() => {
        appShellModelSpy.mockReturnValue({
          apps: {
            mainApp: "/",
          },
          mainPanel: {
            views: [
              {
                bundle: "mainApp/pages/Home.js",
                route: "/home",
              },
              {
                bundle: "mainApp/pages/About.js",
                route: "/about",
              },
              {
                bundle: "mainApp/pages/Persons.js",
                route: "/persons",
              },
              {
                bundle: "mainApp/pages/Persons/Detail.js",
                route: "/persons/:id",
              },
              {
                bundle: "mainApp/pages/Persons/Detail/Assets.js",
                route: "/persons/:id/assets",
              },
              {
                bundle: "mainApp/pages/Persons/Detail/Assets/New.js",
                route: "/persons/:id/assets/new",
              },
              {
                bundle: "mainApp/pages/Contact.js",
                route: "/persons/:id/contact",
              },
              {
                bundle: "mainApp/pages/Services.js",
                route: "/great/services",
                views: [
                  {
                    bundle: "mainApp/pages/Services/Consulting.js",
                    route: "/consulting",
                    views: [
                      {
                        bundle: "mainApp/pages/Services/Consulting/Hardware.js",
                        route: "/hardware",
                      },
                    ],
                  },
                  {
                    bundle: "mainApp/pages/Services/Development.js",
                    route: "/development",
                    views: [
                      {
                        bundle:
                          "mainApp/pages/Services/Development/Hardware.js",
                        route: "/hardware",
                      },
                      {
                        bundle:
                          "mainApp/pages/Services/Development/Hardware/New.js",
                        route: "/new-hardware",
                      },
                    ],
                  },
                  {
                    bundle: "mainApp/pages/Persons/Detail/Assets/New.js",
                    route: "/new-asset",
                    views: [
                      {
                        bundle:
                          "mainApp/pages/Services/Development/Hardware.js",
                        route: "/hardware",
                      },
                    ],
                  },
                ],
              },
              {
                bundle: "mainApp/pages/Contact.js",
                route: "/contact",
              },

              {
                bundle: "mainApp/pages/Persons/Detail/Assets/New.js",
                route: "/contact/new-asset",
              },
              {
                bundle: "mainApp/pages/Persons.js",
                route: "/other",
              },
              {
                bundle: "mainApp/pages/Persons/Detail.js",
                route: "/other/:id",
              },
              {
                bundle: "mainApp/pages/Persons/Detail/Assets.js",
                route: "/other/:id/assets",
              },
              {
                bundle: "mainApp/pages/Persons/Detail/Assets/New.js",
                route: "/other/:id/assets/new",
              },
              {
                bundle: "mainApp/pages/Contact.js",
                route: "/other/:id/contact",
              },
              {
                bundle: "mainApp/pages/Places/Assets.js",
                route: "/places",
              },
              {
                bundle: "mainApp/pages/Places.js",
                route: "/places/:id",
                views: [
                  {
                    bundle: "mainApp/pages/Places/Assets.js",
                    route: "/assets",
                    views: [
                      {
                        bundle: "mainApp/pages/Places/Assets/Best.js",
                        route: "/best",
                        views: [
                          {
                            bundle: "mainApp/pages/Places/Assets/Details.js",
                            route: "/details",
                          },
                          {
                            bundle: "mainApp/pages/Contact.js",
                            route: "/contact",
                          },
                        ],
                      },
                      {
                        bundle: "mainApp/pages/Places/Assets/Details.js",
                        route: "/details",
                      },
                      {
                        bundle: "mainApp/pages/Places/Assets.js",
                        route: "/new",
                      },
                      {
                        bundle: "mainApp/pages/Places.js",
                        route: "/some/other",
                      },
                    ],
                  },
                ],
              },
              {
                bundle: "mainApp/pages/Places.js",
                route: "/places/:id/other",
                views: [
                  {
                    bundle: "mainApp/pages/Places/New.js",
                    route: "/new",
                  },
                ],
              },
            ],
          },
        } satisfies HvAppShellConfig);
      });

      describe("top", () => {
        it("should return the first view that matches the bundle name", () => {
          const { result } = renderHook(() => useHvNavigation(), {
            wrapper,
          });
          expect(result.current).toBeDefined();

          const { getViewRoute } = result.current;

          // /persons/:id <- first match
          // /other/:id
          expect(
            getViewRoute("mainApp/pages/Persons/Detail", { mode: "top" }),
          ).toBe("/persons/:id");

          // /persons/:id/contact
          // /contact <- closest to the root
          // /other/:id/contact
          expect(
            getViewRoute("mainApp/pages/Contact.js", { mode: "top" }),
          ).toBe("/contact");

          // /persons/:id/assets/new
          // /great/services/new-asset
          // /contact/new-asset <- closest to the root
          // /other/:id/assets/new
          expect(
            getViewRoute("mainApp/pages/Persons/Detail/Assets/New.js", {
              mode: "top",
            }),
          ).toBe("/contact/new-asset");

          expect(
            getViewRoute("mainApp/NonExisting.js", { mode: "top" }),
          ).toBeUndefined();
        });
      });

      describe("auto", () => {
        // "auto" is the default mode and does the following:
        // - first, it attempts to locate a subpath view of the current location and returns the closest one
        // - if no subpath view is found, it ascends one path segment and repeats the process
        // - this process continues until a matching view is located
        // - if no view is found, it returns undefined
        it("should return the appropriate view from /other/123/assets", () => {
          vi.mocked(mockedUseLocation).mockReturnValue({
            pathname: "/other/123/assets",
          });

          const { result } = renderHook(() => useHvNavigation(), {
            wrapper,
          });
          expect(result.current).toBeDefined();

          const { getViewRoute } = result.current;

          // /persons/:id/assets/new
          // /great/services/new-asset
          // /contact/new-asset
          // /other/:id/assets/new <- subpath
          expect(
            getViewRoute("mainApp/pages/Persons/Detail/Assets/New.js"),
          ).toBe("/other/:id/assets/new");

          // /persons/:id/contact
          // /contact
          // /other/:id/contact <- sibling
          expect(getViewRoute("mainApp/pages/Contact.js")).toBe(
            "/other/:id/contact",
          );

          // /persons/:id
          // /other/:id <- child of grandparent
          expect(getViewRoute("mainApp/pages/Persons/Detail.js")).toBe(
            "/other/:id",
          );

          expect(getViewRoute("mainApp/NonExisting.js")).toBeUndefined();
        });

        it("should return the appropriate view from /great/services", () => {
          vi.mocked(mockedUseLocation).mockReturnValue({
            pathname: "/great/services",
          });

          const { result } = renderHook(() => useHvNavigation(), {
            wrapper,
          });
          expect(result.current).toBeDefined();

          const { getViewRoute } = result.current;

          // /persons/:id/assets/new
          // /great/services/new-asset <- subpath
          // /contact/new-asset
          // /other/:id/assets/new
          expect(
            getViewRoute("mainApp/pages/Persons/Detail/Assets/New.js"),
          ).toBe("/great/services/new-asset");

          // /persons/:id/contact
          // /contact <- closest to the root
          // /other/:id/contact
          expect(getViewRoute("mainApp/pages/Contact.js")).toBe("/contact");

          // /persons/:id <- first match closest to the root
          // /other/:id
          expect(getViewRoute("mainApp/pages/Persons/Detail")).toBe(
            "/persons/:id",
          );

          expect(getViewRoute("mainApp/NonExisting.js")).toBeUndefined();
        });

        it("should return the appropriate view from /great/services/development", () => {
          vi.mocked(mockedUseLocation).mockReturnValue({
            pathname: "/great/services/development",
          });

          const { result } = renderHook(() => useHvNavigation(), {
            wrapper,
          });
          expect(result.current).toBeDefined();

          const { getViewRoute } = result.current;

          // /great/services/consulting/hardware
          // /great/services/development/hardware <- subpath
          // /great/services/new-asset/hardware
          expect(
            getViewRoute("mainApp/pages/Services/Development/Hardware.js"),
          ).toBe("/great/services/development/hardware");

          // /persons/:id/assets/new
          // /great/services/new-asset <- sibling
          // /contact/new-asset
          // /other/:id/assets/new
          expect(
            getViewRoute("mainApp/pages/Persons/Detail/Assets/New.js"),
          ).toBe("/great/services/new-asset");

          // /persons/:id/contact
          // /contact <- closest to the root
          // /other/:id/contact
          expect(getViewRoute("mainApp/pages/Contact.js")).toBe("/contact");

          // /persons/:id <- first match closest to the root
          // /other/:id
          expect(getViewRoute("mainApp/pages/Persons/Detail")).toBe(
            "/persons/:id",
          );

          expect(getViewRoute("mainApp/NonExisting.js")).toBeUndefined();
        });

        it("should return the appropriate view from /places/23/assets", () => {
          vi.mocked(mockedUseLocation).mockReturnValue({
            pathname: "/places/23/assets/new",
          });

          const { result } = renderHook(() => useHvNavigation(), {
            wrapper,
          });
          expect(result.current).toBeDefined();

          const { getViewRoute } = result.current;

          // /contact
          // /persons/:id/contact
          // /other/:id/contact
          // /places/:id/assets/best/contact <- subpath of a sibling
          expect(getViewRoute("mainApp/pages/Contact.js")).toBe(
            "/places/:id/assets/best/contact",
          );
        });
      });
    });
  });

  /**
   * route resolution is already tested in the getViewRoute tests, which the navigate method uses
   * navigate tests focus on the different types of inputs and interaction with the react-router useNavigate hook
   */
  describe("test `navigate` method", () => {
    beforeAll(() => {
      appShellModelSpy.mockReturnValue({
        apps: { dummyId: "/", "@hv/dummyId2": "/", dummyId3: "/" },
        mainPanel: {
          views: [
            {
              bundle: "dummyId/pages/Dummy1.js",
              route: "/dummyRoute1",
            },
            {
              bundle: "dummyId/pages/Dummy2.js",
              route: "/route/:id/:text",
            },
            {
              bundle: "@hv/dummyId2/pages/Dummy2.js",
              route: "/dummyRoute2",
            },
            {
              bundle: "@hv/dummyId2/pages/Dummy2-1.js",
              route: "/route2-1/:id/:text",
            },
            {
              bundle: "dummyId3/pages/Dummy3.js",
              route: "/dummyRoute3",
              views: [
                {
                  bundle: "dummyId/pages/Dummy3-1.js",
                  route: "/dummyRoute3-1",
                },
              ],
            },
            {
              bundle: "dummyId3/pages/Dummy3-1.js",
              route: "/route3-1/:id/:text",
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
                },
                {
                  bundle: "dummyId/pages/Dummy4-3.js",
                  route: "/good-morning",
                },
              ],
            },
            {
              bundle: "dummyId/pages/Dummy4-3.js",
              route: "/top/good-morning",
            },
          ],
        },
      } satisfies HvAppShellConfig);
    });

    it("should navigate with `to` as string", () => {
      const { result } = renderHook(() => useHvNavigation(), {
        wrapper,
      });

      result.current.navigate("");
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(1, "", undefined);

      result.current.navigate("/test");
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(2, "/test", undefined);
    });

    it("should navigate with `to` as ViewDestination", () => {
      const { result } = renderHook(() => useHvNavigation(), {
        wrapper,
      });

      result.current.navigate({ viewBundle: "/pages/Dummy1" });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        1,
        "/dummyRoute1",
        undefined,
      );

      result.current.navigate({
        viewBundle: "/pages/Dummy2",
        pathParams: { id: "someId", text: "someText" },
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        2,
        "/route/someId/someText",
        undefined,
      );

      result.current.navigate({
        viewBundle: "/pages/Dummy1",
        search: "?mode=dark",
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        3,
        "/dummyRoute1?mode=dark",
        undefined,
      );

      result.current.navigate({
        viewBundle: "/pages/Dummy1",
        hash: "#dummyHash",
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        4,
        "/dummyRoute1#dummyHash",
        undefined,
      );

      result.current.navigate({
        viewBundle: "/pages/Dummy2",
        pathParams: { id: "someId", text: "someText" },
        search: "?mode=dark",
        hash: "#dummyHash",
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        5,
        "/route/someId/someText?mode=dark#dummyHash",
        undefined,
      );

      result.current.navigate({ viewBundle: "@hv/dummyId2/pages/Dummy2" });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        6,
        "/dummyRoute2",
        undefined,
      );

      result.current.navigate({
        viewBundle: "@hv/dummyId2/pages/Dummy2-1",
        pathParams: { id: "someId", text: "someText" },
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        7,
        "/route2-1/someId/someText",
        undefined,
      );

      result.current.navigate({ viewBundle: "dummyId3/pages/Dummy3" });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        8,
        "/dummyRoute3",
        undefined,
      );

      result.current.navigate({
        viewBundle: "dummyId3/pages/Dummy3-1",
        pathParams: { id: "someId", text: "someText" },
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        9,
        "/route3-1/someId/someText",
        undefined,
      );

      result.current.navigate({
        viewBundle: "/pages/Dummy4-1",
        pathParams: { id: "someId" },
        search: "?mode=dark",
        hash: "#dummyHash",
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        10,
        "/dummyRoute4/someId/hello?mode=dark#dummyHash",
        undefined,
      );
      result.current.navigate({
        viewBundle: "dummyId/pages/Dummy4-1",
        pathParams: { id: "someId" },
        search: "?mode=wicked",
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        11,
        "/dummyRoute4/someId/hello?mode=wicked",
        undefined,
      );
    });

    it("should not navigate if bundle doesn't exist", () => {
      const { result } = renderHook(() => useHvNavigation(), {
        wrapper,
      });

      result.current.navigate({
        viewBundle: "NonExistent",
      });
      expect(mockedUseNavigate).not.toHaveBeenCalled();
      expect(consoleMock).toBeCalledWith(
        "Navigate request to a non existing path [NonExistent]. Skipping",
      );
    });

    it("should navigate with `to` as Partial<Path>", () => {
      const { result } = renderHook(() => useHvNavigation(), {
        wrapper,
      });

      let pathDestination: Partial<Path> = {
        pathname: "/dummy",
      };
      result.current.navigate(pathDestination);
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        1,
        pathDestination,
        undefined,
      );

      pathDestination = {
        pathname: "/dummy",
        search: "?mode=dark",
      };
      result.current.navigate(pathDestination);
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        2,
        pathDestination,
        undefined,
      );

      pathDestination = {
        pathname: "/dummy",
        search: "?mode=dark",
        hash: "#dummyHash",
      };

      result.current.navigate(pathDestination);
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        3,
        pathDestination,
        undefined,
      );
    });

    it("should replace state if required", () => {
      const { result } = renderHook(() => useHvNavigation(), {
        wrapper,
      });

      const toNavigate = "/replaceStateDummy";
      result.current.navigate(toNavigate, { replace: true });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(1, toNavigate, {
        replace: true,
        state: undefined,
      });

      result.current.navigate(toNavigate, {
        replace: true,
        state: { selectedItem: 1 },
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(2, toNavigate, {
        replace: true,
        state: { selectedItem: 1 },
      });
    });

    it("should push state if requested", () => {
      const { result } = renderHook(() => useHvNavigation(), {
        wrapper,
      });

      const toNavigate = "/pushStateDummy";

      result.current.navigate(toNavigate, {
        replace: false,
        state: { selectedItem: 1 },
      });
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(1, toNavigate, {
        replace: false,
        state: { selectedItem: 1 },
      });
    });

    it("should allow choosing the view search mode", () => {
      vi.mocked(mockedUseLocation).mockReturnValue({
        pathname: "/dummyRoute4/:id",
      });

      const { result } = renderHook(() => useHvNavigation(), {
        wrapper,
      });

      result.current.navigate(
        {
          viewBundle: "dummyId/pages/Dummy4-3.js",
          pathParams: { id: "someId" },
        },
        {
          mode: "top",
          replace: true,
          state: { selectedItem: 1 },
        },
      );
      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        1,
        "/top/good-morning",
        {
          replace: true,
          state: { selectedItem: 1 },
        },
      );
    });
  });
});
