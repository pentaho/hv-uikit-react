import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvBanner",
  category: "Feedback",
  keywords: ["message", "alert", "notification"],
  usage: {
    description:
      "Shows an important message with optional actions, anchored to the top of the view.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvSnackbar` for transient feedback that does not need acknowledging.",
      },
    ],
  },
  decisions: [
    {
      change: "`HvBannerContent` no longer takes `content`.",
      status: "current",
      since: "v7",
      migrate: "pass `children`",
    },
  ],
};
