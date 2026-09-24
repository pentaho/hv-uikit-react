import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvSelect",
  category: "Form",
  keywords: ["dropdown", "combobox", "picker", "options"],
  usage: {
    description: "Chooses a value from a known list of options within a form.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvDropDownMenu` when the trigger opens a list of actions rather than selecting a value.",
      },
    ],
    anatomy: [
      { name: "root", required: true, description: "The select control." },
    ],
  },
  decisions: [],
};
