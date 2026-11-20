---
component: HvCheckBoxGroup
status: stable
related: [HvCheckBox, HvRadioGroup, HvDropdown, HvSelectionList]
---

# HvCheckBoxGroup

A labeled set of checkboxes for picking any number of options.

## When to use

- Two to about seven options people can combine, all visible (notification channels, columns to show).
- Longer lists or filter menus: HvDropdown with `multiSelect`. Exactly one choice: HvRadioGroup.

## What the consumer provides

- `label`; HvCheckBox children, each with `label` and `value`.
- `value` + `onChange(event, values)` (an array), or `defaultValue`; `name` passes to every child that has none.
- `showSelectAll`: ticking it from the indeterminate state clears the selection.
- `required` makes the group invalid when nothing is selected ("Required" by default when uncontrolled); a controlled `status="invalid"` needs its `statusMessage` to show. `disabled` and `readOnly` pass to the children.

## Spec

- `role="group"`, labeled by its HvLabel; vertical stack, or wrapped rows with a `space.sm` gap.
- Select-all shows an "N / total" count and the indeterminate state for a partial selection.
- Invalid: a `negative` rule under the group (`space.xs` below the items) and the message.

## Don't

- Don't leave a group without `label` (or `aria-label`): it is the group's name.
- Don't set `checked` on the children: the group owns it (a child's `checked` or `defaultChecked` only seeds the start when the group has neither `value` nor `defaultValue`).
