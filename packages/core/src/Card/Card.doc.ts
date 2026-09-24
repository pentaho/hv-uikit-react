import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvCard",
  category: "Layout",
  keywords: ["tile", "panel", "summary"],
  usage: {
    description: "Groups short, related content as a single scannable unit.",
    bestPractices: [
      {
        guidance: false,
        description:
          "Do not nest cards — use a list or a section heading instead.",
      },
    ],
  },
  decisions: [],
};
