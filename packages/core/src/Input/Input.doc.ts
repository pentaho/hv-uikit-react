import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvInput",
  category: "Form",
  keywords: ["text field", "textbox", "search"],
  usage: {
    description: "Lets users enter and edit a single line of text.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvTextArea` when the expected input is more than one line.",
      },
    ],
  },
  decisions: [
    {
      change:
        "`disableClear`, `disableRevealPassword` and `disableSearchButton` were removed.",
      status: "current",
      since: "v7",
      migrate: "use `hideClear`, `hideRevealPassword`, `hideSearchButton`",
    },
  ],
};
