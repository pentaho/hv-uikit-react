# A summary of how things are doing

For a view that answers "how are things going": a few figures first, then what needs attention, then the details.

## When to chart

A chart when the view's question is a change over time, or a comparison of more than about four amounts, whether or
not the request says "chart"; fewer amounts stay figures, and a current status or a single number is a figure or a tag.

- Over time: `HvLineChart` (or `HvBarChart`, one bar per day, for a few days). Keep time in time order.
- Amounts per category: `HvBarChart`, `horizontal` for long names, sorted by amount.
- Parts of a whole, with a few parts: `HvDonutChart`.

## Figures and panels

Two pieces, the same wherever they sit:

- A figure (a KPI): an `HvCard` as `uikit-tools info HvCard` describes a KPI, its change a short tag ("Up 17%") with
  any detail in a `caption1` below, since a tag truncates. Numbers through `Intl.NumberFormat`; durations in words
  (`new Intl.NumberFormat(undefined, { style: "unit", unit: "minute" })` gives "4 min").
- A panel (a chart, a table, a list, a tree): an `HvSection` with a `title4` heading and its `actions` (View all,
  Export), the content inside it with its own states and caption.

The page lays them out with grid classes: figures in `grid grid-cols-2 md:grid-cols-4 gap-sm`, panels in
`grid md:grid-cols-2 gap-sm` (`md:col-span-2` for a wide one). "A dashboard" in a request means this.

## A chart

```tsx
import { HvTypography } from "@pentaho/uikit-react-core";
import { HvLineChart } from "@pentaho/uikit-react-viz";

interface Day {
  day: string;
  views: number;
}

export function ViewsByDay({ days }: { days: Day[] }) {
  // no days: the page shows its empty state instead (States, below)
  if (days.length === 0) return null;
  const busiest = days.reduce((a, b) => (b.views > a.views ? b : a), days[0]);
  return (
    <div className="flex flex-col gap-xs">
      <HvLineChart
        data={{ Day: days.map((d) => d.day), Views: days.map((d) => d.views) }}
        groupBy="Day"
        measures="Views"
        height={240}
      />
      <HvTypography variant="caption1">{`Busiest day: ${busiest.day}.`}</HvTypography>
    </div>
  );
}
```

- `data` as columns by name (above) or as the rows the server sends; each measure is summed per `groupBy` value
  (`{ field, agg: "count" }` counts rows). `stack="total"` (any name) stacks bar or line measures; the donut takes
  one `measure`.
- `sortBy={{ field: "Views", order: "asc" }}` orders the bars; a `horizontal` chart draws from the bottom up, so
  ascending puts the largest on top. Sort a time column too when the data isn't in order. Category names must fit:
  shorten them, or make room (`grid={{ left: 160 }}` on a `horizontal` chart).
- A measure's `valueFormatter` formats the tooltip; the value axis's `labelFormatter` formats the axis (`yAxis`, or
  `xAxis` when `horizontal`), compact in a narrow panel or at 390 wide so its numbers don't run together
  (`new Intl.NumberFormat(undefined, { notation: "compact" }).format`, "1.2K"). Day labels people read ("Mon 18"),
  not ISO dates.
- Leave `legend` unset: two or more series get one, a single series has none, so the panel's title names what's
  plotted. About five series or slices at most.
- A `height` in a panel on the page (without it the chart takes 100% of a parent that has no height and collapses),
  the same for charts in panels side by side, so neither has blank space under its chart.
- The caption states the takeaway in words.
- Series take the theme's colors: name them plainly, don't recolor them.
- The App Shell doesn't provide `HvVizProvider`, without which charts ignore the theme and dark mode: when the plugin
  adds its first chart, wrap the children of `src/providers/Provider.tsx` in it once. `@pentaho/uikit-react-viz` and
  its peers (`echarts`, `echarts-for-react`, `arquero`) are in the template's dependencies. A chart adds about 450 KB
  (gzipped) to the plugin: use one where it earns its place.

## What needs attention, and the details

What failed or is waiting, first and named (an `HvBannerContent` or a short list), then the records in a table
([table.md](table.md)).

## States

- Loading: an `HvSkeleton` in each card and chart. "Updated 10:42" (`Intl.DateTimeFormat`, `timeStyle: "short"`)
  beside the page's Refresh; a period picker (`HvDropdown`) in the header row only when the request implies a time
  window.
- Nothing yet: one `HvEmptyState` in place of the figures and the chart, never a row of zeros.
- One part failing to load: say so in that part, and keep the others.
- At 390 wide: the figures in two columns, the chart full width.

## Panels people arrange

Only when people should be able to rearrange or resize the panels themselves: the same `HvSection` panels in an
`HvDashboard` from `@pentaho/uikit-react-widgets`, a work in progress (add it at an exact version; check it renders in
the plugin's tests, since it draws nothing until it has measured its container). Figures stay a row above it.

- Each panel is a direct child, its `key` its layout item's `i` (a wrapper component loses the drag, the resize grips
  and the position), with `classes={{ header: "panel-handle", content: "min-h-0" }}`; its chart leaves out `height`
  and fills it (`h-full`).
- `layouts` per breakpoint, keyed by the theme's `xs` to `xl` and measured on the dashboard's own width, panels
  `w: 12` at `xs` (a single `layout` applies at every width); `h` counts rows of 150 px.
- `dragConfig={{ handle: ".panel-handle", cancel: "button" }}`: dragged by the header, not by its buttons. The grips
  are pointer-only: the panel's `actions` also hold Move earlier, Move later, Wider and Narrower, or the layout stays
  fixed (`static: true`, or `dragConfig={{ enabled: false }}` and `resizeConfig={{ enabled: false }}`).
- Saving a person's layout needs a store the plugin doesn't have: an open question for the hand-off.
