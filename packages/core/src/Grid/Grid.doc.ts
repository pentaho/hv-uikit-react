import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvGrid",
  category: "Layout",
  keywords: ["layout", "columns", "responsive", "12-column"],
  usage: {
    description:
      "Lays out content on the 12-column responsive grid. Wraps `@mui/material/Grid`.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use `style` or `className` for one-off styling. `sx` is accepted by the type signature but is destructured and never forwarded, so it silently does nothing.",
      },
      {
        guidance: false,
        description:
          "Do not reach for the grid for a simple one-off arrangement — utility classes such as `grid grid-cols-2 md:grid-cols-4` are lighter.",
      },
    ],
    anatomy: [
      {
        name: "root",
        required: true,
        description: "The grid container or item.",
      },
    ],
  },
  props: {
    // HvGridProps extends Omit<MuiGridProps, ...>, so MUI's entire system surface
    // resolves as ours. These are the props HvGrid actually declares or handles.
    only: [
      "container",
      "size",
      "spacing",
      "rowSpacing",
      "columnSpacing",
      "columns",
      "direction",
      "justify",
      "justifyContent",
      "wrap",
      "classes",
      "className",
      "children",
    ],
  },
  decisions: [
    {
      change: "Wraps `@mui/material/Grid` instead of `GridLegacy`.",
      status: "current",
      since: "v7",
      rationale:
        "GridLegacy is deprecated upstream; staying on it would block MUI upgrades.",
    },
    {
      change:
        "`item` and the per-breakpoint props `xs`/`sm`/`md`/`lg`/`xl` were removed; sizing goes through `size`.",
      status: "current",
      since: "v7",
      migrate:
        "<HvGrid item xs={12} sm={6} /> → <HvGrid size={{ xs: 12, sm: 6 }} />",
    },
    {
      change: "`zeroMinWidth` was removed.",
      status: "current",
      since: "v7",
      migrate: "use style={{ minWidth: 0 }}",
    },
  ],
};
