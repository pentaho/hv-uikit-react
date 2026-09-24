import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvTooltip",
  category: "Overlay",
  keywords: ["hint", "hover", "popup"],
  usage: {
    description: "Shows short informative text on hover or focus.",
    bestPractices: [
      {
        guidance: false,
        description:
          "Do not put essential information or interactive content in a tooltip; it is not reachable on touch.",
      },
    ],
  },
  decisions: [],
};
