import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvBulkActions",
  category: "Action",
  keywords: ["selection", "batch", "toolbar"],
  usage: {
    description: "Applies an action to one or many selected items.",
  },
  decisions: [
    {
      change:
        "`semantic` and `classes.semantic` were removed; action buttons are always `secondaryGhost`.",
      status: "current",
      since: "v7",
    },
  ],
};
