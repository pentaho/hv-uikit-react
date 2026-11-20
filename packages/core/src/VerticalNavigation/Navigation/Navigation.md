---
component: HvVerticalNavigationTree
status: stable
related:
  [
    HvVerticalNavigation,
    HvVerticalNavigationTreeView,
    HvVerticalNavigationSlider,
  ]
---

# HvVerticalNavigationTree

The list of destinations inside an HvVerticalNavigation, built from data, with nested sections.

## When to use

- Inside HvVerticalNavigation, one per group of destinations (Quick access, Sections).

## What the consumer provides

- `data` items (`id` and `label` required; `data` nests children), with Phosphor icons.
- `selected` + `onChange(event, item)`, or `defaultSelected`.
- `collapsible` (without it every level shows open) with `expanded` + `onToggle(event, ids)`, or `defaultExpanded` (by default the path to the selection). In an open `collapsible` tree a parent only expands and collapses and leaves select; `selectable` on an item overrides it.
- `aria-label` for its `nav` landmark.

## Spec

- In `navigation` mode the selected item gets `aria-current` (`page` when it has an `href`, otherwise `true`); `navigation` keeps Tab order, `treeview` uses arrow keys.
- Items `body` text, `radii.round`, gap `space.xs`; parents semibold; nested items indented on a `border` guide line at 30% alpha.
- Hidden when the rail is collapsed without `useIcons`.

## Don't

- Don't set `mode="treeview"` unless arrow-key navigation is really needed: the default `navigation` mode keeps Tab order.
