import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvTag",
  category: "Display",
  keywords: ["chip", "label", "badge"],
  usage: {
    description: "Highlights a single attribute of an item.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvTagsInput` when tags are user-editable rather than display-only.",
      },
    ],
  },
  decisions: [],
};
