import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvEmptyState",
  category: "Feedback",
  keywords: ["no data", "blank", "placeholder"],
  usage: {
    description:
      "Explains that there is nothing to show, and what to do about it.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Say why it is empty and offer the next action; an icon alone is not enough.",
      },
    ],
  },
  decisions: [],
};
