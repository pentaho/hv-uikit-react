import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvTextArea",
  category: "Form",
  keywords: ["multiline", "notes", "description"],
  usage: {
    description: "Multi-line text input, with an optional character counter.",
    bestPractices: [
      { guidance: true, description: "Use `HvInput` for single-line values." },
    ],
  },
  decisions: [],
};
