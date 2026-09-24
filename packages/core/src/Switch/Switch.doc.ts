import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvSwitch",
  category: "Form",
  keywords: ["toggle", "on off", "binary"],
  usage: {
    description: "A binary on/off control that applies immediately.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvCheckBox` when the change is only applied on submit.",
      },
    ],
  },
  decisions: [],
};
