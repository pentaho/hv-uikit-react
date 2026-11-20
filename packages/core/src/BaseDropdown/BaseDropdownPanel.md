---
component: HvDropdownPanel
status: prefer-alternative
related: [HvBaseDropdown, HvDropdown, HvPanel]
---

# HvDropdownPanel

The floating panel HvBaseDropdown opens.

## When to use

- Normally not directly: it comes with HvDropdown, HvDatePicker, HvDropDownMenu, HvFilterGroup and HvColorPicker (through HvBaseDropdown).
- A static region with the same surface: HvPanel.

## Spec

- `bgContainer` surface, `borderSubtle` outline, `radii.large`, `shadow`; padding `space.xs` (HvBaseDropdown removes it), offset `space.xxs` from its anchor; above the page at the popover layer.

## Don't

- Don't position your own popovers with it: use the component that owns the panel.
