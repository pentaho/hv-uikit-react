import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvDialog",
  category: "Overlay",
  keywords: ["modal", "confirm", "popup"],
  usage: {
    description:
      "Interrupts the user with content that must be acknowledged before continuing.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvDrawer` for supporting content the user can ignore.",
      },
      {
        guidance: false,
        description:
          "Do not use a dialog for transient feedback — use `HvSnackbar`.",
      },
    ],
  },
  decisions: [],
};
