import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvCheckBox",
  category: "Form",
  keywords: ["tick", "multi select", "option"],
  usage: {
    description: "Selects one or more options from a set.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvRadioGroup` when exactly one option may be selected.",
      },
    ],
  },
  decisions: [],
};
