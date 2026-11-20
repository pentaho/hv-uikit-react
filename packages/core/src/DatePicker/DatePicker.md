---
component: HvDatePicker
status: stable
related: [HvCalendar, HvTimePicker, HvFormElement, HvFilterGroup]
rules: [uikit/raw-elements]
---

# HvDatePicker

A date field that opens a calendar, for one date or a start and end range.

## When to use

- One date in a form (due date, effective from) or a date range filter (`rangeMode`) over a list or chart.
- A fixed set of periods (Last 7 days, This month) on their own: HvSelect or a floating HvTabs. Presets next to a calendar: put the list in `startAdornment`.
- Date and time together: HvDatePicker next to HvTimePicker.

## What the consumer provides

- `description` with the expected format.
- Single: `value` (a `Date`) + `onChange(date)`. Range: `rangeMode`, `startValue`, `endValue`, `onChange(start, end)`.
- `showActions` adds Apply / Cancel in single mode (without it a picked day applies and closes at once); range mode always shows them. `showClear` works only with actions or in range mode.
- `status="invalid"` with `statusMessage`. Limits through `calendarProps` (`minimumDate`, `maximumDate`); `horizontalPlacement` applies to range mode only.

## Spec

- Enter or Space opens it; arrow keys move between days, Enter picks, Escape closes.
- The dropdown field (`radii.round`, `textDimmed` outline, `primary` on hover, `negative` when invalid) with the selected date in label weight.
- Calendar days in `caption1`, round (`radii.full`): hover `primaryDimmed`, selected `primary` with `dimmer` text, range days on `bgPageSecondary`, other months and disabled days `textDisabled`.
- Apply and Cancel separated by `space.xs`.

## Don't

- Don't pass ISO strings as `value`, `startValue` or `endValue`: pass `Date` objects (`new Date(record.dueDate)`).
- Don't pass `value` in range mode: it is ignored; pass `startValue` and `endValue`.
- Don't leave a picker without `label`, `aria-label` or `aria-labelledby`: the field has no name otherwise.
