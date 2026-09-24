import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvDrawer",
  category: "Overlay",
  keywords: ["panel", "sidebar", "sheet", "overlay"],
  usage: {
    description:
      "Shows supporting content in a panel anchored to an edge of the screen.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `HvDialog` when the interaction must be acknowledged before the user can continue.",
      },
      {
        guidance: true,
        description:
          "Compose the contents from the Dialog parts: `HvDialogTitle`, `HvDialogContent`, `HvDialogActions`.",
      },
      {
        guidance: false,
        description:
          "Do not assert on the drawer being gone immediately after `onClose`. Closing runs an exit transition, so it stays mounted for a tick — tests need `findBy*` or `waitFor`.",
      },
    ],
    anatomy: [
      { name: "root", required: true, description: "The drawer surface." },
      {
        name: "backdrop",
        required: false,
        description: "The scrim behind it.",
      },
    ],
  },
  decisions: [],
};
