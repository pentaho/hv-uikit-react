import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvLoading",
  category: "Feedback",
  keywords: ["spinner", "progress", "busy"],
  usage: {
    description:
      "Signals that a process is running and the result is not ready.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvSkeleton` when the shape of the incoming content is known.",
      },
    ],
  },
  decisions: [],
};
