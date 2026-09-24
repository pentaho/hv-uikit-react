import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvSlider",
  category: "Form",
  keywords: ["range", "track", "value"],
  usage: {
    description: "Selects a value, or a range of values, along a track.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvInput` when the exact value matters more than the relative position.",
      },
    ],
  },
  decisions: [
    {
      change: "`onBeforeChange` and `onAfterChange` were removed.",
      status: "current",
      since: "v7",
      migrate: "use `onChange`",
    },
  ],
};
