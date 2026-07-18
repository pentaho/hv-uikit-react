/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import type { HvAppShellMenuConfig } from "@hitachivantara/app-shell-shared";

import type { MenuItem } from "../types/menu";
import {
  createMenuItems,
  findFirstLeafItem,
  findItemById,
  getRootIdFromItemId,
  searchHrefInMenuItems,
} from "./navigationUtils";

const tFunction = (key: string) => `translated ${key}`;

describe("test navigation utilities", () => {
  describe("test `createMenuItems` method", () => {
    it("should return empty items from empty config", () => {
      const menuItems: HvAppShellMenuConfig[] = [];
      const navigationData = createMenuItems(tFunction, menuItems);
      expect(navigationData.length).toBe(0);
    });

    it("should return empty items from undefined config", () => {
      const menuItems = undefined;
      const navigationData = createMenuItems(tFunction, menuItems);
      expect(navigationData.length).toBe(0);
    });

    it("should create the correct number of items", () => {
      const menuItems: HvAppShellMenuConfig[] = [
        { label: "dummyLabel1" },
        { label: "dummyLabel2" },
        { label: "dummyLabel3" },
      ];
      const navigationData = createMenuItems(tFunction, menuItems);
      expect(navigationData.length).toBe(3);
    });

    it("should create correct item from one menu with submenus", () => {
      const menuItems: HvAppShellMenuConfig[] = [
        {
          label: "dummyLabel1",
          submenus: [
            {
              label: "subDummyLabel2",
              icon: {
                iconType: "uikit",
                name: "Play",
              },
              target: "/subDummyTarget2",
            },
            {
              label: "subDummyLabel3",
              icon: {
                iconType: "uikit",
                name: "Back",
              },
              target: "/subDummyTarget3",
            },
          ],
        },
      ];

      const navigationData = createMenuItems(tFunction, menuItems);
      expect(navigationData.length).toBe(1);
      expect(navigationData[0].id).toBe("0");
      expect(navigationData[0].label).toBe("translated dummyLabel1");
      expect(navigationData[0].href).toBe("./subDummyTarget2");
      expect(navigationData[0].parent).toBeUndefined();
      expect(navigationData[0].icon).toBeUndefined();

      expect(navigationData[0].data?.length).toBe(2);

      const [firstData, secondData] = navigationData[0].data!;

      expect(firstData.id).toBe("0-0");
      expect(firstData.label).toBe("translated subDummyLabel2");
      expect(firstData.href).toBe("./subDummyTarget2");
      expect(firstData.parent).toEqual(navigationData[0]);

      expect(secondData.id).toBe("0-1");
      expect(secondData.label).toBe("translated subDummyLabel3");
      expect(secondData.href).toBe("./subDummyTarget3");
      expect(secondData.parent).toEqual(navigationData[0]);
    });

    it("should make sure that root item inherits href from the menu first submenu children", () => {
      const menuItems: HvAppShellMenuConfig[] = [
        {
          label: "dummyLabel1",
          submenus: [
            {
              label: "subDummyLabel2",
              icon: {
                iconType: "uikit",
                name: "Play",
              },
              target: "/subDummyTarget2",
            },
            {
              label: "subDummyLabel3",
              icon: {
                iconType: "uikit",
                name: "Back",
              },
              target: "/subDummyTarget3",
            },
          ],
        },
      ];

      const navigationData = createMenuItems(tFunction, menuItems);
      expect(navigationData.length).toBe(1);
      expect(navigationData[0].href).toBe("./subDummyTarget2");
    });

    it("should return an empty array when the depth is set to 0", () => {
      const menuItems: HvAppShellMenuConfig[] = [
        {
          label: "dummyLabel1",
          submenus: [
            {
              label: "subDummyLabel2",
              icon: {
                iconType: "uikit",
                name: "Play",
              },
              target: "/subDummyTarget2",
            },
            {
              label: "subDummyLabel3",
              icon: {
                iconType: "uikit",
                name: "Back",
              },
              target: "/subDummyTarget3",
            },
          ],
        },
      ];

      const navigationData = createMenuItems(tFunction, menuItems, 0);
      expect(navigationData.length).toBe(0);
    });

    it("should only return the first items in the hierarchy", () => {
      const menuItems: HvAppShellMenuConfig[] = [
        {
          label: "main1",
          submenus: [
            {
              label: "sub-1-1",
              submenus: [
                {
                  label: "sub-1-1-1",
                  target: "/sub-1-1-1",
                },
              ],
            },
          ],
        },
      ];

      const navigationData = createMenuItems(tFunction, menuItems, 1);
      expect(navigationData.length).toBe(1);
      expect(navigationData[0].data).toBeUndefined();
    });

    it("should only return two levels of items from the hierarchy", () => {
      const menuItems: HvAppShellMenuConfig[] = [
        {
          label: "main1",
          submenus: [
            {
              label: "sub-1-1",
              submenus: [
                {
                  label: "sub-1-1-1",
                  target: "/sub-1-1-1",
                },
              ],
            },
          ],
        },
      ];

      const navigationData = createMenuItems(tFunction, menuItems, 2);
      expect(navigationData.length).toBe(1);
      const subMenuData = navigationData[0].data;
      expect(subMenuData?.length).toBe(1);
      expect(subMenuData![0].data).toBeUndefined();
    });
  });

  describe("test `searchHrefInMenuItems` method", () => {
    const items: MenuItem[] = [
      {
        id: "dummy1",
        label: "dummy1",
        href: "/dummyHref/",
      },
      {
        id: "dummy2",
        label: "dummy2",
        href: "/dummyHref?x=y",
      },
      {
        id: "dummy3",
        label: "dummy3",
        href: "/dummy3-1Href",
        data: [
          {
            id: "dummy3-1",
            label: "dummy3-1",
            href: "/dummy3-1Href",
            parent: {
              id: "dummy3",
              label: "dummy3",
              href: "/dummy3-1Href",
              data: [],
            },
            data: [
              {
                id: "dummy3-1-1",
                label: "dummy3-1-1",
                href: "/dummy3-1-1Href?test=foo",
                parent: {
                  id: "dummy3-1",
                  label: "dummy3-1",
                  href: "/dummy3-1Href",
                  data: [],
                },
              },
            ],
          },
          {
            id: "dummy3-2",
            label: "dummy3-2",
            href: "/dummy3-2Href",
            parent: {
              id: "dummy3",
              label: "dummy3",
              href: "/dummy3-1Href",
              data: [],
            },
          },
        ],
      },
      {
        id: "dummy4",
        label: "dummy4",
        href: "/dummyHref4/",
      },
    ];

    it("test no match", () => {
      const id = searchHrefInMenuItems(items, "/test");
      expect(id).toBeUndefined();
    });

    it("test no match given empty href", () => {
      const id = searchHrefInMenuItems(items, "");
      expect(id).toBeUndefined();
    });

    it("test exact match without parameters", () => {
      const id = searchHrefInMenuItems(items, "/dummy3-2Href");
      expect(id).toBe("dummy3-2");
    });

    it("test exact match with parameters", () => {
      const id = searchHrefInMenuItems(items, "/dummy3-1-1Href", "?test=foo");
      expect(id).toBe("dummy3-1-1");
    });

    it("test exact match without parameters and ending forward slash", () => {
      const id = searchHrefInMenuItems(items, "/dummy3-1-1Href/");
      expect(id).toBe("dummy3-1-1");
    });

    it("test partial match with parameters", () => {
      const id = searchHrefInMenuItems(items, "/dummyHref", "?test=foo");
      expect(id).toBe("dummy1");
    });

    it("test match in items with slash", () => {
      const id = searchHrefInMenuItems(items, "/dummyHref4");
      expect(id).toBe("dummy4");
    });

    const items0 = [
      {
        id: "dummy2",
        label: "dummy2",
        href: "/something/submenu/details",
      },
      {
        id: "dummy3",
        label: "dummy3",
        href: "/menu/submenu/other/",
      },
      {
        id: "dummy4",
        label: "dummy4",
        href: "/menu/submenu/details/2/other",
      },
    ];

    it("test no match if menu doesn't contain match", () => {
      const id = searchHrefInMenuItems(items0, "/menu/submenu/details/2");
      expect(id).toBeUndefined();
    });

    const items1 = [
      {
        id: "dummy1",
        label: "dummy1",
        href: "/menu/",
      },
      ...items0,
      {
        id: "dummy5",
        label: "dummy5",
        href: "/menu/submenu/",
      },
    ];

    it("test match if menu contains part of the href", () => {
      const id = searchHrefInMenuItems(items1, "/menu/submenu/details/2");
      expect(id).toBe("dummy5");
    });

    const items2 = [
      {
        id: "dummy",
        label: "dummy",
        href: "./dummy",
      },
      {
        id: "dummy1",
        label: "dummy1",
        href: "./dummy1-1Href",
        data: [
          {
            id: "dummy1-1",
            label: "dummy1-1",
            href: "./dummy1-1Href",
            parent: {
              id: "dummy1",
              label: "dummy1",
              href: "./dummy1-1Href",
            },
          },
          {
            id: "dummy1-2",
            label: "dummy1-2",
            href: "./",
            parent: {
              id: "dummy1",
              label: "dummy1",
              href: "./dummy1-1Href",
            },
          },
        ],
      },
    ];

    it("test match if menu contains '/'", () => {
      const id = searchHrefInMenuItems(items2, "./menu/submenu/details/2");
      expect(id).toBe("dummy1-2");
    });
  });

  describe("test `findFirstLeafItem` method", () => {
    it("Selects the first item from the menu", () => {
      const id = findFirstLeafItem([
        {
          id: "dummy1",
          label: "dummy1",
          href: "/dummyHref/",
        },
        {
          id: "dummy2",
          label: "dummy2",
          href: "/dummyHref?x=y",
        },
      ]);
      expect(id).toMatchObject({
        href: "/dummyHref/",
        id: "dummy1",
        label: "dummy1",
      });
    });

    it("Selects the first child item from the menu", () => {
      const id = findFirstLeafItem([
        {
          id: "dummy3",
          label: "dummy3",
          data: [
            {
              id: "dummy3-1",
              label: "dummy3-1",
              data: [
                {
                  id: "dummy3-1-1",
                  label: "dummy3-1-1",
                  href: "/dummy3-1-1Href?test=foo",
                },
              ],
            },
            {
              id: "dummy4",
              label: "dummy4",
              href: "/dummyHref/",
            },
          ],
        },
      ]);
      expect(id).toMatchObject({
        href: "/dummy3-1-1Href?test=foo",
        id: "dummy3-1-1",
        label: "dummy3-1-1",
      });
    });
  });

  describe("test `findItemById` method", () => {
    test.each([
      [
        "dummy1",
        {
          href: "/dummyHref/",
          id: "dummy1",
          label: "dummy1",
        },
      ],
      [
        "dummy3-1-1",
        {
          id: "dummy3-1-1",
          label: "dummy3-1-1",
          href: "/dummy3-1-1Href?test=foo",
        },
      ],
    ])("element with key %s matches object %o", (key: string, expected) => {
      const id = findItemById(
        [
          {
            id: "dummy1",
            label: "dummy1",
            href: "/dummyHref/",
          },
          {
            id: "dummy2",
            label: "dummy2",
            href: "/dummyHref?x=y",
          },
          {
            id: "dummy3",
            label: "dummy3",
            href: "/dummy3-1Href",
            data: [
              {
                id: "dummy3-1",
                label: "dummy3-1",
                href: "/dummy3-1Href",
                parent: {
                  id: "dummy3",
                  label: "dummy3",
                  href: "/dummy3-1Href",
                  data: [],
                },
                data: [
                  {
                    id: "dummy3-1-1",
                    label: "dummy3-1-1",
                    href: "/dummy3-1-1Href?test=foo",
                    parent: {
                      id: "dummy3-1",
                      label: "dummy3-1",
                      href: "/dummy3-1Href",
                      data: [],
                    },
                  },
                ],
              },
            ],
          },
        ],
        key,
      );
      expect(id).toMatchObject(expected);
    });
  });

  describe("test `getRootIdFromItemId` method", () => {
    test.each([
      ["1-1-1", "1"],
      ["1", "1"],
      [undefined, undefined],
    ])("Root menu id from path %s matches %s", (value, expected) => {
      const id = getRootIdFromItemId(value);
      expect(id).toMatchObject(expected as any);
    });
  });
});
