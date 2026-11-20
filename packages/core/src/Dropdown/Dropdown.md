---
component: HvDropdown
status: stable
related:
  [HvSelect, HvRadioGroup, HvCheckBoxGroup, HvDropDownMenu, HvFilterGroup]
rules: [uikit/raw-elements]
---

# HvDropdown

Picks one or several values from a list, with optional search, select-all and Apply / Cancel.

## When to use

- A long list people search (`showSearch`), or multi-select filters (`multiSelect`: select-all, then Apply).
- A plain single choice in a form: HvSelect is the simpler, native-like control.
- Two to five options always visible: HvRadioGroup or HvCheckBoxGroup. Actions in a menu: HvDropDownMenu.

## What the consumer provides

- `label` or `aria-label`.
- `values`: selection lives in `selected` on each item; `separator` draws a group divider.
- `onChange(selected)`: the item on click, or the items with `multiSelect` on Apply (Apply stays disabled until the selection changes).
- `singleSelectionToggle` is on by default: clicking the selected item clears it.
- With `multiSelect` the field shows "selected / total", never `placeholder`; for your own text pass `labels.select`.
- `virtualized` (experimental) for very long lists requires `height`.

## Spec

- Field: white in light mode, slate 950 in dark (fixed, not a token), `textDimmed` outline, `radii.round`; `primary` on hover and focus; `negative` when invalid; placeholder `textSubtle`.
- Disabled sits on `bgPage` with `textDisabled` text. Read-only keeps the fill with a `textSubtle` outline.
- Combobox role: Enter, Space or Arrow down opens it, arrows move, Enter or Space selects, Escape closes.
- Open panel: `bgContainer`, `borderSubtle` outline, `radii.large`, `shadow`; the list itself has no extra padding.

## Don't

- Don't use a raw `<select>` (`uikit/raw-elements`).
- Don't use a dropdown for actions: that's HvDropDownMenu.
- Don't type options by hand: build `values` from the records the app fetched.
