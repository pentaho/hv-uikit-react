---
component: HvTreeView
status: stable
related: [HvTreeItem, HvVerticalNavigation, HvTable, HvPanel]
---

# HvTreeView

A hierarchy people expand, collapse and select from: folders, catalogs, glossary categories.

## When to use

- Nested items of the same kind where position in the tree matters (a catalog by source, schema and table; a category tree).
- App navigation: HvVerticalNavigation. Flat records with fields: HvTable.

## What the consumer provides

- HvTreeItem children, usually mapped recursively from the app's records.
- Expansion: `expanded` + `onNodeToggle(event, nodeIds)`, or `defaultExpanded`.
- Selection: `selected` + `onNodeSelect(event, nodeIds)`, or `defaultSelected`; `string[]` with `multiSelect` (`expanded` is always `string[]`). Clicking a row both toggles and selects it: `disableSelection` for a browse-only tree.

## Spec

- Arrows move and expand or collapse, Home / End jump, Space selects, Enter expands or collapses a parent and selects a leaf, typing a letter jumps to a match, `*` expands siblings.
- Items in `body` text, each level indented by `space.sm`; hover and focus on `bgHover`, selected on `bgPageSecondary`, disabled in `textDisabled`.

## Don't

- Don't render deep trees with thousands of nodes at once: load children when a node expands.
- Don't leave a tree without a name: give it an `aria-label` ("Catalog") or `aria-labelledby` its heading.
