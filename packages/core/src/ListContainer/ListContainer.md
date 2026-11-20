---
component: HvListContainer
status: stable
related: [HvListItem, HvSelectionList, HvPanel, HvTable]
---

# HvListContainer

A simple vertical list of text or icon-and-text items, built from HvListItem children.

## When to use

- Short lists of simple items in a panel or card: recent activity, related assets, a navigation list; usually inside an HvPanel.
- Picking items: HvSelectionList (it wires selection and the listbox role). Records with several fields: HvTable.

## What the consumer provides

- HvListItem children, mapped from the records the app fetched.
- `aria-label` when the list has no visible heading.

## Spec

- The `ul` has no role of its own. `interactive`: rows are focusable (the first or selected row is the tab stop, arrow keys move between rows) and react to hover.
- Items in `body` with `space.xs` side padding; interactive hover `bgHover`, keyboard focus `bgPageSecondary`; separators in `border`.

## Don't

- Don't set `selectable` expecting selection to work: it only styles; use HvSelectionList.
