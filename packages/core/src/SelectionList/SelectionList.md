---
component: HvSelectionList
status: stable
related: [HvListItem, HvListContainer, HvRadioGroup, HvCheckBoxGroup, HvSelect]
---

# HvSelectionList

A labeled list box: people pick one item, or several, by clicking the rows themselves.

## When to use

- Picking from a visible list of rich rows (an item with an icon or a short description) in a form or side panel.
- Short plain options: HvRadioGroup (one) or HvCheckBoxGroup (several). A collapsed list: HvSelect.

## What the consumer provides

- HvListItem children, direct children only (each is cloned), each with a `value`.
- `value` + `onChange(event, value)` (`null` when toggled off, an array with `multiple`), or `defaultValue`.
- `status` with `statusMessage` (both, or the message doesn't render).

## Spec

- `role="listbox"` (`aria-multiselectable` with `multiple`); arrow keys move, Enter or Space selects; with `multiple`, Shift or Ctrl/Cmd-click and Shift+arrows extend the selection.
- Selected rows on `bgHover`, as HvListItem. Invalid: a `negative` rule under the list, `space.xs` below; uncontrolled with `required` it shows "Required".

## Don't

- Don't leave a list with no `label` (or `aria-label`).
- Don't set `multiple` unless several picks are clearly expected: the list is built for a clear single choice, and a checkbox group is clearer for many choices.
