---
component: HvBaseDropdown
status: prefer-alternative
related:
  [
    HvDropdown,
    HvSelect,
    HvDatePicker,
    HvDropdownPanel,
    HvDropDownMenu,
    HvTimePicker,
    HvColorPicker,
  ]
rules: [uikit/deprecated]
---

# HvBaseDropdown

The primitive behind HvDropdown, HvDropDownMenu, HvDatePicker, HvTimePicker and HvColorPicker (HvSelect is not built on it): a field-shaped header that opens a floating panel.

## When to use

- Prefer HvSelect or HvDropdown for options, HvDatePicker for dates, HvDropDownMenu for actions.
- A custom picker none of those cover, such as a panel with a tree: `children` is the panel, `onContainerCreation` moves focus into it, and it needs `aria-label` or `aria-labelledby`.

## Spec

- Header: white fill (fixed, not a token), `textDimmed` outline, `radii.round`, `primary` on hover and focus; disabled and read-only on `bgPage`.
- `role="combobox"` header with `aria-expanded` and `aria-controls`. Enter, Space or Arrow down open it; Escape or Tab close it and focus returns to the header.

## Don't

- Don't rebuild HvDropdown on top of it: you lose the label, validation and list keyboard handling.
