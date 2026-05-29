import type { HvAppShellModel } from "@hitachivantara/app-shell-shared";

import filterModel from "./filterModel";

describe("filterModel", () => {
  it("preserves grouped menu arrays when no conditions are filtered out", () => {
    const model = {
      menu: [
        [
          { key: "0", label: "Leaf 1", target: "/leaf-1" },
          { key: "1", label: "Leaf 1B", target: "/leaf-1b" },
        ],
        [{ key: "2", label: "Leaf 2", target: "/leaf-2" }],
      ],
      allConditions: [] as HvAppShellModel["allConditions"],
      preloadedBundles: new Map(),
    } as HvAppShellModel;

    const filteredModel = filterModel(model, []);

    expect(filteredModel.menu).toEqual(model.menu);
    expect(Array.isArray(filteredModel.menu?.[0])).toBe(true);
    expect(Array.isArray(filteredModel.menu?.[1])).toBe(true);
    expect(filteredModel.menu?.[0]).toHaveLength(2);
    expect(filteredModel.menu?.[1]).toHaveLength(1);
  });
});
