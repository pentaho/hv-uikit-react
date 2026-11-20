---
component: HvTimePicker
status: stable
related: [HvDatePicker, HvInput, HvFormElement]
rules: [uikit/raw-elements]
---

# HvTimePicker

A time field (hours, minutes, optional seconds) with a dropdown of steppers, in 12- or 24-hour format.

## When to use

- A time of day in a form: schedule start, run window, reminder.
- A duration (minutes, hours): HvNumberInput with the unit in its label.
- Date and time: HvDatePicker beside it.

## What the consumer provides

- `value` + `onChange({ hours, minutes, seconds })` (always 24-hour, fires only for complete times; `null` is empty), or `defaultValue`.
- `timeFormat={12}` for AM/PM: `locale` sets segment order and labels only, not the format.
- `placeholder` shows only while there is no value; the segments show their own placeholders otherwise.
- The error shows with `required`, or when both `status` and `statusMessage` are set.

## Spec

- Tab moves between the hour, minute and period segments; type digits or use arrow up and down.
- The dropdown field (`radii.round`, `textDimmed` outline, `primary` on hover, `negative` when invalid; `textDisabled` placeholder when disabled).
- Open panel: one stepper per unit, numbers in `title3`, padded `space.xs`.

## Don't

- Don't use a free-text HvInput for times: you lose the segments, validation and locale format.
- Don't leave a time picker without `label` or `aria-label`.
