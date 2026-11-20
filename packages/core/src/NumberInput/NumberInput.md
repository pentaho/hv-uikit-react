---
component: HvNumberInput
status: stable
related: [HvInput, HvSlider]
rules: [uikit/raw-elements]
---

# HvNumberInput

A numeric field with decrement and increment buttons; HvInput with `type="number"`.

## When to use

- Exact numbers people type or nudge: quantities, thresholds, retention days.
- A value in a range where the exact number matters less: HvSlider.
- Formatted numbers such as currency with separators: HvInput with an `endAdornment` unit.

## What the consumer provides

- `label` (or `aria-label`), `value` + `onChange(event, value)`: the value arrives as a string, so convert it.
- `inputProps={{ min, max, step }}`, so the buttons and arrow keys respect the bounds.
- Validation as in HvInput.

## Spec

- Arrow up and down step the value; the plus and minus buttons are for pointers and stay out of the tab order; `readOnly` hides them. No clear button.
- HvInput field (`radii.round`, `body` text) with the step buttons in a `bgContainer` box divided by a `border` line; `bgDisabled` when disabled.

## Don't

- Don't leave a number field without its unit: put it in the label ("Retention (days)") or an adornment.
- Don't give bounds only in help text: pass them in `inputProps`.
