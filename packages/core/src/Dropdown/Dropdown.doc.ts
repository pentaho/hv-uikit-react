import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvDropdown",
  category: "Form",
  keywords: ["combobox", "picker", "multiselect"],
  usage: {
    description:
      "Selects one or many values from a list, with optional search.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvSelect` for a plain single-value choice; use `HvDropDownMenu` when the items are actions.",
      },
    ],
  },
  decisions: [],
};
