---
component: HvCalendar
status: stable
related: [HvDatePicker, HvCalendarHeader]
---

# HvCalendar

An always-visible month calendar for picking a date or a range; the panel inside HvDatePicker.

## When to use

- A calendar that stays on the page (a scheduling panel, a side filter with room for it).
- A date in a form or a filter bar: HvDatePicker, which opens this calendar in a dropdown.

## What the consumer provides

- `value` + `onChange(event, date)`: a `{ startDate, endDate }` value switches to range mode (two months; no `endDate` means the range is being picked), and `onChange` still gets the clicked `Date`, so you build the new range. Without `value` it falls back to the enclosing HvFormElement's value.
- `visibleMonth` / `visibleYear` (and `rightVisible…` in range mode) + `onVisibleDateChange` to control the shown month.

## Spec

- Arrow keys move by day and week within the month, Enter or Space selects; days outside the month or the limits are disabled.
- Header (HvCalendarHeader) above the grid with `space.sm` below; days in `caption1`, round (`radii.full`).
- Hover `primaryDimmed`; selected and range ends `primary` with `dimmer` text; days in the range on `bgPageSecondary`; out-of-month and disabled days `textDisabled`.

## Don't

- Don't use a calendar without a name: the typed-date field in its header takes its label from an enclosing HvFormElement / HvLabel (as in HvDatePicker); on its own, give the surrounding region a visible heading.
- Don't pass strings as `value`: pass a `Date`, or `{ startDate, endDate }` for a range.
