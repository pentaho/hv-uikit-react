---
component: HvCheckBox
status: stable
related: [HvCheckBoxGroup, HvSwitch, HvRadioGroup, HvBulkActions]
rules: [uikit/raw-elements]
---

# HvCheckBox

A box people tick to select an option, or to agree to one statement.

## When to use

- One independent yes/no in a form that is submitted ("Send me a copy").
- Several choices from a list: HvCheckBoxGroup. One choice from several: HvRadioGroup. A setting that applies at once: HvSwitch.
- Row selection in tables and the select-all of HvBulkActions.

## What the consumer provides

- `label`, or `aria-label` / `aria-labelledby` when the row or column header labels it.
- `checked` + `onChange(event, checked, value)`, or `defaultChecked`.
- `indeterminate`: uncontrolled, a click clears it; with `checked`, it is yours to manage.
- `status="invalid"` needs a `statusMessage` for the message to show; uncontrolled and `required`, it shows "Required" after the box is unticked.

## Spec

- Tab to focus, Space toggles.
- Box with `borderStrong` outline and `radii.base` corners on `bgContainer`; checked fills `primary` with a `bgContainer` mark; indeterminate stays on `bgContainer` with a `textSubtle` dash.
- Label in `body`, `space.xs` from the box; the row highlights `bgHover` on hover.
- Disabled: `bgDisabled` box, `borderDisabled` outline, `textDisabled` label. Invalid: the message below in `negative`.

## Don't

- Don't leave a checkbox with no label: pass `label`, or `aria-label` when the row or column header labels it.
- Don't mix `checked` and `defaultChecked`, or use `indeterminate` without saying what "some" means.
- Don't disable it with no reason nearby, or reach for `readOnly` (rarely right; it blocks `onChange`).
