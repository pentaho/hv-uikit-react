import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvAccordion",
  category: "Layout",
  keywords: ["expand", "collapse", "disclosure"],
  usage: {
    description:
      "Expands in place to reveal content that is hidden by default.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Keep the label meaningful when collapsed — it is the only cue to what is inside.",
      },
    ],
  },
  decisions: [],
};
