import type {
  HvAppShellMenuModel,
  HvAppShellModel,
} from "@hitachivantara/app-shell-shared";

import filterModel from "./filterModel";

const baseModel: Omit<HvAppShellModel, "menu"> = {
  allConditions: [],
  preloadedBundles: new Map(),
};

const makeModel = (menu: HvAppShellMenuModel[]): HvAppShellModel => ({
  ...baseModel,
  menu,
});

describe("filterModel", () => {
  describe("invalid menu entries", () => {
    it("filters out menus that have no target nor submenu", () => {
      const model = makeModel([
        { key: "menu-0", label: "Invalid" },
        { key: "menu-1", label: "Valid", target: "/valid" },
      ]);

      const result = filterModel(model, []);

      expect(result.menu).toHaveLength(1);
      expect(result.menu![0].key).toBe("menu-1");
    });

    it("filters out menus that have no target and an empty submenus array", () => {
      const model = makeModel([
        { key: "menu-0", label: "Invalid", submenus: [] },
        { key: "menu-1", label: "Valid", target: "/valid" },
      ]);

      const result = filterModel(model, []);

      expect(result.menu).toHaveLength(1);
      expect(result.menu![0].key).toBe("menu-1");
    });
  });

  describe("dynamic conditions on submenus causing parent with no target to become invalid", () => {
    it("filters out a parent with no target when all its submenus are excluded by conditions", () => {
      const model = makeModel([
        {
          key: "parent-0",
          label: "Parent",
          submenus: [
            {
              key: "child-0",
              label: "Child A",
              target: "/child-a",
              conditions: [{ bundle: "cond-bundle", globalIndex: 0 }],
            },
            {
              key: "child-1",
              label: "Child B",
              target: "/child-b",
              conditions: [{ bundle: "cond-bundle", globalIndex: 1 }],
            },
          ],
        },
      ]);

      // Both conditions are false
      const result = filterModel(model, [false, false]);

      // All submenus are excluded and because parent has no target, should not be rendered
      expect(result.menu).toEqual([]);
    });

    it("keeps a parent with no target when at least one submenu passes its condition", () => {
      const model = makeModel([
        {
          key: "parent-0",
          label: "Parent",
          submenus: [
            {
              key: "child-0",
              label: "Child A",
              target: "/child-a",
              conditions: [{ bundle: "cond-bundle", globalIndex: 0 }],
            },
            {
              key: "child-1",
              label: "Child B",
              target: "/child-b",
            },
          ],
        },
      ]);

      const result = filterModel(model, [false]);

      expect(result.menu).toHaveLength(1);
      expect(result.menu![0].submenus).toHaveLength(1);
      expect(result.menu![0].submenus![0].key).toBe("child-1");
    });

    it("hides parent after its only submenu condition flips from true to false", () => {
      const model = makeModel([
        {
          key: "parent-0",
          label: "Parent",
          submenus: [
            {
              key: "child-0",
              label: "Child",
              target: "/child",
              conditions: [{ bundle: "flip-to-false-bundle", globalIndex: 0 }],
            },
          ],
        },
      ]);

      // Menu and submenu are visible
      const resultBefore = filterModel(model, [true]);
      expect(resultBefore.menu).toHaveLength(1);
      expect(resultBefore.menu![0].submenus).toHaveLength(1);

      // Condition flips to false
      const resultAfter = filterModel(model, [false]);
      expect(resultAfter.menu).toEqual([]);
    });
  });

  describe("preserves valid menu entries", () => {
    it("keeps a leaf menu that has a target", () => {
      const model = makeModel([
        { key: "menu-0", label: "Valid", target: "/route" },
      ]);

      const result = filterModel(model, []);

      expect(result.menu).toHaveLength(1);
      expect(result.menu![0].target).toBe("/route");
    });

    it("preserves object reference when nothing changes", () => {
      const model = makeModel([
        { key: "menu-0", label: "Valid", target: "/route" },
      ]);

      const result = filterModel(model, []);

      expect(result.menu).toBe(model.menu);
    });
  });
});
