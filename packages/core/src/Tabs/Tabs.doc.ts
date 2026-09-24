import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvTabs",
  category: "Navigation",
  keywords: ["tab", "panel", "section"],
  usage: {
    description: "Switches between sibling views within the same context.",
    bestPractices: [
      {
        guidance: false,
        description:
          "Do not use tabs for a sequence of steps; the order is not enforced.",
      },
    ],
  },
  decisions: [],
};
