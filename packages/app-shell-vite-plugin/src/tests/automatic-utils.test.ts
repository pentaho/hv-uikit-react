// @ts-expect-error no types
import mock from "mock-fs";
import { expect } from "vitest";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import {
  applyAutomaticMenu,
  applyAutomaticViewsAndRoutes,
  mapFolderIndexFilesToRoutes,
} from "../automatic-utils";

describe.skip("test automatic utils", () => {
  const pagesFolderContent = {
    "/dummy/path/app/src/pages": {},
    "/dummy/path/app/src/pages/Page1": {
      "index.tsx": "dummy content",
    },
    "/dummy/path/app/src/pages/Page2": {
      "something.else": "dummy content",
    },
    "/dummy/path/app/src/pages/Page3": {
      "index.tsx": "dummy content",
    },
    "/dummy/path/app/src/pages/Page4": {
      /** empty directory */
    },
    "/dummy/path/app/src/pages/Page5/$id": {
      "index.tsx": "dummy content",
    },
    "/dummy/path/app/src/pages/Page5/$id/Page5_1": {
      "index.tsx": "dummy content",
    },
    "/dummy/path/app/src/pages/Page5/$id/Page5_1/$name": {
      /** empty directory */
    },
    "/dummy/path/app/src/pages/Page5/$id/Page5_1/$name/Page5_2": {
      "index.tsx": "dummy content",
    },
  };

  const noIndexFilesInPagesFolderContent = {
    "/dummy/path/app/src/pages": {},
    "/dummy/path/app/src/pages/Page3": {
      "something.else": "dummy content",
    },
    "/dummy/path/app/src/pages/Page4": {
      /** empty directory */
    },
  };

  describe("test `mapFolderIndexFilesToRoutes` method", () => {
    afterEach(() => {
      mock.restore();
    });

    it("should return an empty array when resolved views folder does not exist", () => {
      const root = "/some/other/root";
      const viewsFolder = "src/pages";

      mock(noIndexFilesInPagesFolderContent);

      expect(mapFolderIndexFilesToRoutes(root, viewsFolder)).toEqual([]);
    });

    it("should return an empty array when there are no index files in the resolved views folder", () => {
      const root = "/dummy/path/app";
      const viewsFolder = "src/pages";

      mock(noIndexFilesInPagesFolderContent);

      expect(mapFolderIndexFilesToRoutes(root, viewsFolder)).toEqual([]);
    });

    test.each([
      ["/dummy/path/app", "src/pages"],
      ["/dummy/path/app", "src/pages/"],
      ["/dummy/path/app", "/src/pages/"],
      ["/dummy/path/app", "/src/pages"],
    ])(
      "should return all mapped main view configs and corresponding modules",
      (viewsFolderPath: string, viewsFolder: string) => {
        mock(pagesFolderContent);

        expect(
          mapFolderIndexFilesToRoutes(viewsFolderPath, viewsFolder),
        ).toEqual([
          {
            viewConfig: {
              bundle: "$app/pages/Page1.js",
              route: "/page1",
            },
            module: "src/pages/Page1",
          },
          {
            viewConfig: {
              bundle: "$app/pages/Page3.js",
              route: "/page3",
            },
            module: "src/pages/Page3",
          },
          {
            viewConfig: {
              bundle: "$app/pages/Page5/_id/Page5_1/_name/Page5_2.js",
              route: "/page5/:id/page5_1/:name/page5_2",
            },
            module: "src/pages/Page5/$id/Page5_1/$name/Page5_2",
          },
          {
            viewConfig: {
              bundle: "$app/pages/Page5/_id/Page5_1.js",
              route: "/page5/:id/page5_1",
            },
            module: "src/pages/Page5/$id/Page5_1",
          },
          {
            viewConfig: {
              bundle: "$app/pages/Page5/_id.js",
              route: "/page5/:id",
            },
            module: "src/pages/Page5/$id",
          },
        ]);
      },
    );
  });

  describe("test `applyAutomaticMenu` method", () => {
    it("should create correct menu labels for simple routes", () => {
      const config: HvAppShellConfig = {
        mainPanel: {
          views: [
            { bundle: "$app/pages/Page1.js", route: "/page1" },
            { bundle: "$app/pages/Page2.js", route: "/page2" },
            { bundle: "$app/pages/helloToWorld.js", route: "/hello" },
          ],
        },
      };

      applyAutomaticMenu(config);

      const expectedMenu = [
        { label: "Page1", target: "/page1" },
        { label: "Page2", target: "/page2" },
        { label: "Hello To World", target: "/hello" },
      ];

      expect(config.menu).toEqual(expectedMenu);
    });

    it("should handle nested routes correctly", () => {
      const config: HvAppShellConfig = {
        mainPanel: {
          views: [
            { bundle: "$app/pages/Section/Page1.js", route: "/section/page1" },
            { bundle: "$app/pages/Section/Page2.js", route: "/section/page2" },
            {
              bundle: "$app/pages/Planets/helloToEarth.js",
              route: "/planets/earth",
            },
            {
              bundle: "$app/pages/Planets/HelloToMars.js",
              route: "/planets/mars",
            },
            {
              bundle: "$app/pages/someOtherFolder/ToImportantStuff.js",
              route: "/other/important",
            },
            {
              bundle: "$app/pages/SomeOtherFolder/thisIsOnTheSameMenu.js",
              route: "/other/same",
            },
          ],
        },
      };

      applyAutomaticMenu(config);

      const expectedMenu = [
        {
          label: "Section",
          submenus: [
            { label: "Page1", target: "/section/page1" },
            { label: "Page2", target: "/section/page2" },
          ],
        },
        {
          label: "Planets",
          submenus: [
            { label: "Hello To Earth", target: "/planets/earth" },
            { label: "Hello To Mars", target: "/planets/mars" },
          ],
        },
        {
          label: "Some Other Folder",
          submenus: [
            { label: "To Important Stuff", target: "/other/important" },
            { label: "This Is On The Same Menu", target: "/other/same" },
          ],
        },
      ];

      expect(config.menu).toEqual(expectedMenu);
    });

    it("should skip dynamic routes", () => {
      const config: HvAppShellConfig = {
        mainPanel: {
          views: [
            { bundle: "$app/pages/Page1.js", route: "/page1" },
            { bundle: "$app/pages/Page2/:id.js", route: "/page2/:id" },
            { bundle: "$app/pages/Page3.js", route: "/page3" },
          ],
        },
      };

      applyAutomaticMenu(config);

      const expectedMenu = [
        { label: "Page1", target: "/page1" },
        // Note: Page2 is skipped because it's a dynamic route
        { label: "Page3", target: "/page3" },
      ];

      expect(config.menu).toEqual(expectedMenu);
    });

    it("should handle special characters and capitalization in routes", () => {
      const config: HvAppShellConfig = {
        mainPanel: {
          views: [
            {
              bundle: "$app/pages/lowerUpper/Look🙄ingAbóve/SomeSpÉcialPage.js",
              route: "/l1/l2/someSpecialPage",
            },
          ],
        },
      };

      applyAutomaticMenu(config);

      const expectedMenu = [
        {
          label: "Lower Upper",
          submenus: [
            {
              label: "Look🙄ing Abóve",
              submenus: [
                {
                  label: "Some SpÉcial Page",
                  target: "/l1/l2/someSpecialPage",
                },
              ],
            },
          ],
        },
      ];

      expect(config.menu).toEqual(expectedMenu);
    });

    it("should return undefined for empty views", () => {
      const config: HvAppShellConfig = {
        mainPanel: {
          views: [],
        },
      };

      applyAutomaticMenu(config);

      expect(config.menu).toBe(undefined);
    });
  });

  describe("test applyAutomaticViewsAndRoutes", () => {
    const selfAppName = "@hv-tests/some-app";
    const root = "/dummy/path/app";
    const viewsFolder = "src/pages";

    afterEach(() => {
      mock.restore();
    });

    it("should return an empty array when there are neither automatic or manual views", () => {
      mock(noIndexFilesInPagesFolderContent);

      const config: HvAppShellConfig = {};

      const result = applyAutomaticViewsAndRoutes(
        config,
        selfAppName,
        root,
        viewsFolder,
      );

      expect(result.length).toEqual(0);

      expect(config.mainPanel?.views?.length ?? 0).toBe(0);
    });

    it("should return an empty array when there are no automatic views and keep the manual ones", () => {
      mock(noIndexFilesInPagesFolderContent);

      const config: HvAppShellConfig = {
        mainPanel: {
          views: [
            { bundle: "$app/pages/Home.js", route: "/" },
            { bundle: "@hv-tests/some-app/pages/Page0.js", route: "/page0" },
            { bundle: "$app/pages/Other.js", route: "/some-path" },
            {
              bundle: "@hv-tests/other-app/pages/HelloFromOther.js",
              route: "/other",
            },
          ],
        },
      };

      const result = applyAutomaticViewsAndRoutes(
        config,
        selfAppName,
        root,
        viewsFolder,
      );

      expect(result.length).toEqual(0);

      expect(config.mainPanel?.views?.length).toEqual(4);
      expect(config.mainPanel?.views).toEqual(
        expect.arrayContaining([
          { bundle: "$app/pages/Home.js", route: "/" },
          { bundle: "@hv-tests/some-app/pages/Page0.js", route: "/page0" },
          { bundle: "$app/pages/Other.js", route: "/some-path" },
          {
            bundle: "@hv-tests/other-app/pages/HelloFromOther.js",
            route: "/other",
          },
        ]),
      );
    });

    it("should return modules of found automatic views and add them to the configuration when there are no manual views", () => {
      mock(pagesFolderContent);

      const config: HvAppShellConfig = {};

      const result = applyAutomaticViewsAndRoutes(
        config,
        selfAppName,
        root,
        viewsFolder,
      );

      expect(result.length).toEqual(5);
      expect(result).toEqual(
        expect.arrayContaining([
          "src/pages/Page1",
          "src/pages/Page3",
          "src/pages/Page5/$id/Page5_1/$name/Page5_2",
          "src/pages/Page5/$id/Page5_1",
          "src/pages/Page5/$id",
        ]),
      );

      expect(config.mainPanel?.views?.length).toEqual(5);
      expect(config.mainPanel?.views).toEqual(
        expect.arrayContaining([
          { bundle: "$app/pages/Page1.js", route: "/page1" },
          { bundle: "$app/pages/Page3.js", route: "/page3" },
          {
            bundle: "$app/pages/Page5/_id.js",
            route: "/page5/:id",
          },
          {
            bundle: "$app/pages/Page5/_id/Page5_1.js",
            route: "/page5/:id/page5_1",
          },
          {
            bundle: "$app/pages/Page5/_id/Page5_1/_name/Page5_2.js",
            route: "/page5/:id/page5_1/:name/page5_2",
          },
        ]),
      );
    });

    it("should return modules of found automatic views and append them to the configuration when there are manual views", () => {
      mock(pagesFolderContent);

      const config: HvAppShellConfig = {
        mainPanel: {
          views: [
            { bundle: "$app/pages/Home.js", route: "/" },
            { bundle: "@hv-tests/some-app/pages/Page0.js", route: "/page0" },
            { bundle: "$app/pages/Other.js", route: "/some-path" },
            {
              bundle: "@hv-tests/other-app/pages/HelloFromOther.js",
              route: "/other",
            },
          ],
        },
      };

      const result = applyAutomaticViewsAndRoutes(
        config,
        selfAppName,
        root,
        viewsFolder,
      );

      expect(result.length).toEqual(5);
      expect(result).toEqual(
        expect.arrayContaining([
          "src/pages/Page1",
          "src/pages/Page3",
          "src/pages/Page5/$id/Page5_1/$name/Page5_2",
          "src/pages/Page5/$id/Page5_1",
          "src/pages/Page5/$id",
        ]),
      );

      expect(config.mainPanel?.views?.length).toEqual(9);
      expect(config.mainPanel?.views).toEqual(
        expect.arrayContaining([
          { bundle: "$app/pages/Home.js", route: "/" },
          { bundle: "@hv-tests/some-app/pages/Page0.js", route: "/page0" },
          { bundle: "$app/pages/Other.js", route: "/some-path" },
          {
            bundle: "@hv-tests/other-app/pages/HelloFromOther.js",
            route: "/other",
          },

          { bundle: "$app/pages/Page1.js", route: "/page1" },
          { bundle: "$app/pages/Page3.js", route: "/page3" },
          {
            bundle: "$app/pages/Page5/_id.js",
            route: "/page5/:id",
          },
          {
            bundle: "$app/pages/Page5/_id/Page5_1.js",
            route: "/page5/:id/page5_1",
          },
          {
            bundle: "$app/pages/Page5/_id/Page5_1/_name/Page5_2.js",
            route: "/page5/:id/page5_1/:name/page5_2",
          },
        ]),
      );
    });

    it("should skip overlapping routes and bundles", () => {
      mock(pagesFolderContent);

      const config: HvAppShellConfig = {
        mainPanel: {
          views: [
            { bundle: "$app/pages/Page1.js", route: "/other-path" },
            { bundle: "@hv-tests/some-app/pages/Page3.js", route: "/page3" },
            { bundle: "$app/pages/Other.js", route: "/page5/:id" },
            {
              bundle: "@hv-tests/other-app/pages/HelloFromOther.js",
              route: "/other",
            },
          ],
        },
      };

      const result = applyAutomaticViewsAndRoutes(
        config,
        selfAppName,
        root,
        viewsFolder,
      );

      expect(result.length).toEqual(5);
      expect(result).toEqual(
        expect.arrayContaining([
          "src/pages/Page1",
          "src/pages/Page3",
          "src/pages/Page5/$id/Page5_1/$name/Page5_2",
          "src/pages/Page5/$id/Page5_1",
          "src/pages/Page5/$id",
        ]),
      );

      expect(config.mainPanel?.views?.length).toEqual(6);
      expect(config.mainPanel?.views).toEqual(
        expect.arrayContaining([
          {
            bundle: "@hv-tests/other-app/pages/HelloFromOther.js",
            route: "/other",
          },

          { bundle: "$app/pages/Page1.js", route: "/other-path" },
          { bundle: "@hv-tests/some-app/pages/Page3.js", route: "/page3" },
          { bundle: "$app/pages/Other.js", route: "/page5/:id" },
          {
            bundle: "$app/pages/Page5/_id/Page5_1.js",
            route: "/page5/:id/page5_1",
          },
          {
            bundle: "$app/pages/Page5/_id/Page5_1/_name/Page5_2.js",
            route: "/page5/:id/page5_1/:name/page5_2",
          },
        ]),
      );
    });

    it("should skip overlapping routes and bundles, including nested views", () => {
      mock(pagesFolderContent);

      const config: HvAppShellConfig = {
        mainPanel: {
          views: [
            {
              bundle: "$app/pages/Page1.js",
              route: "/other-path",
              views: [{ bundle: "$app/pages/Page3.js", route: "/subpage3" }],
            },
            { bundle: "$app/pages/Other.js", route: "/page5/:id" },
            {
              bundle: "@hv-tests/other-app/pages/HelloFromOther.js",
              route: "/other",
            },
          ],
        },
      };

      const result = applyAutomaticViewsAndRoutes(
        config,
        selfAppName,
        root,
        viewsFolder,
      );

      expect(result.length).toEqual(5);
      expect(result).toEqual(
        expect.arrayContaining([
          "src/pages/Page1",
          "src/pages/Page3",
          "src/pages/Page5/$id/Page5_1/$name/Page5_2",
          "src/pages/Page5/$id/Page5_1",
          "src/pages/Page5/$id",
        ]),
      );

      expect(config.mainPanel?.views?.length).toEqual(5);
      expect(config.mainPanel?.views).toEqual(
        expect.arrayContaining([
          {
            bundle: "@hv-tests/other-app/pages/HelloFromOther.js",
            route: "/other",
          },

          {
            bundle: "$app/pages/Page1.js",
            route: "/other-path",
            views: [{ bundle: "$app/pages/Page3.js", route: "/subpage3" }],
          },

          { bundle: "$app/pages/Other.js", route: "/page5/:id" },
          {
            bundle: "$app/pages/Page5/_id/Page5_1.js",
            route: "/page5/:id/page5_1",
          },
          {
            bundle: "$app/pages/Page5/_id/Page5_1/_name/Page5_2.js",
            route: "/page5/:id/page5_1/:name/page5_2",
          },
        ]),
      );
    });
  });
});
