---
component: HvSelect
status: stable
related: [HvOption, HvOptionGroup, HvDropdown, HvRadioGroup, HvFormElement]
rules: [uikit/raw-elements]
---

# HvSelect

A form control for choosing one option (or several with `multiple`) from a list, aligned with the native select API.

## When to use

- A single choice in a form from about five to fifteen options (Country, Owner, Domain).
- Two to five options always visible: HvRadioGroup (one) or HvCheckBoxGroup (several).
- A long list people search, or multi-select filters with select-all and Apply: HvDropdown. Actions in a menu: HvDropDownMenu.

## What the consumer provides

- `label` (or `aria-label` when the context names it).
- Options: HvOption children (grouped with HvOptionGroup), or the `options` prop; build them from the records the app fetched.
- `value` + `onChange(event, value)` (`null` when cleared, an array with `multiple`), or `defaultValue`; `open` + `onOpenChange` to control the list.
- `enablePortal` when the select sits in a clipped container.
- `name` to submit with a form; `getSerializedValue(option)` shapes the submitted string and `renderValue(option)` the closed display.
- `status` with `statusMessage` (both, or the message doesn't render); with `required` and no `status` it shows "Required" after closing empty.

## Spec

- Enter, Space or arrows open it; arrows move, typing jumps to a match, Enter picks, Escape closes.
- Trigger as an HvButton field: `radii.round`, `textDimmed` outline on a white (dark mode: slate 950) fill, fixed, not a token; `negative` outline when invalid.
- List panel: `bgContainer`, `borderSubtle` outline, `radii.large`, `shadow`, padding `space.xs`, offset `space.xxs` from the field.

## Don't

- Don't use a raw `<select>` (`uikit/raw-elements`).
- Don't leave a select without a label.
