import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvTable",
  category: "Display",
  keywords: ["grid", "rows", "data"],
  usage: {
    description: "Displays relational data in rows and columns for comparison.",
    bestPractices: [
      {
        guidance: false,
        description:
          "Do not use a table purely for layout — use `HvGrid` or utility classes.",
      },
    ],
  },
  decisions: [],
};
