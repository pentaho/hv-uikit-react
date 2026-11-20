---
component: HvSearchInput
status: stable
related: [HvInput, HvFilterGroup, HvEmptyState]
rules: [uikit/raw-elements]
---

# HvSearchInput

The search box above a list or table: a pill-shaped HvInput with a search icon and clear button.

## When to use

- Narrowing a list, table or catalog by text: filter as people type (debounce in your `onChange` handler) or on Enter (`onEnter`).
- A text field in a form: HvInput. Narrowing by facets (status, owner): HvFilterGroup next to it.

## What the consumer provides

- `aria-label` (or `label`) such as "Search assets"; `placeholder` naming what's searchable ("Name, owner or tag").
- `value` + `onChange(event, value)`; `onEnter(event, value)` when search runs on Enter (it also fires when a suggestion is picked).

## Spec

- A native search field, so screen readers announce a search box; Escape clearing is the browser's.
- `radii.full` (pill) field; `textDimmed` outline, `primary` on hover, the focus ring on focus; `body` text, `textSubtle` placeholder.
- Search icon at the start; the clear button shows on hover or focus once there is a value.

## Don't

- Don't search without telling people the result: show the count, and an HvEmptyState with "Clear search" when nothing matches.
- Don't leave a search box with no accessible name: the icon and placeholder are not a label.
- Don't filter a hand-written array: the query goes to the list call, which searches on the server.
