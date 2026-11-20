---
component: HvTreeItem
status: stable
related: [HvTreeView]
---

# HvTreeItem

One node of an HvTreeView, holding its own child nodes.

## When to use

- Every node inside HvTreeView; nest HvTreeItems for children.

## What the consumer provides

- A unique `nodeId` from the record's id, a short `label`, nested HvTreeItem children.
- `endIcon` applies to leaves only; parents use the tree's `defaultParentIcon`.

## Spec

- `role="treeitem"` with `aria-expanded` (only on items with children), `aria-selected` and `aria-disabled` set for you; focus stays on the tree, which points at the active item.
- `body` label, `bgHover` on hover and focus, `bgPageSecondary` when selected, `textDisabled` when disabled.
