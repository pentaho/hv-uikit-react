import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvButton",
  category: "Action",
  keywords: ["cta", "submit", "action", "icon button"],
  usage: {
    description: "Triggers an action or event in place.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use a link, not a button, to navigate to another page — middle-click and open-in-new-tab only work on links.",
      },
      {
        guidance: false,
        description:
          "Do not disable a button to communicate a validation error without saying why. A disabled button leaves the tab order and screen readers announce nothing.",
      },
    ],
    accessibility: [
      {
        criterion: "2.1.1 Keyboard",
        description:
          "A disabled button is removed from the tab order. Set `focusableWhenDisabled` when the reason it is disabled must stay discoverable by keyboard and screen reader.",
      },
      {
        criterion: "4.1.2 Name, Role, Value",
        description:
          "`icon` renders an icon-only button, which has no text to announce. It still needs an accessible name via `aria-label`.",
      },
    ],
    anatomy: [
      { name: "root", required: true, description: "The button element." },
      {
        name: "startIcon",
        required: false,
        description: "Icon placed before the children.",
      },
      {
        name: "endIcon",
        required: false,
        description: "Icon placed after the children.",
      },
    ],
  },
  decisions: [],
};
