import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvRadioGroup",
  category: "Form",
  keywords: ["radio", "single select", "option"],
  usage: {
    description: "Selects exactly one option from a small, visible set.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvSelect` once the list is long enough that showing every option is impractical.",
      },
    ],
  },
  decisions: [],
};
