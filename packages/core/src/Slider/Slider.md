---
component: HvSlider
status: stable
related: [HvNumberInput, HvInput, HvFormElement]
---

# HvSlider

Picks a number, or a range with two knobs, along a track, with an optional input beside it.

## When to use

- A value where the relative position matters more than the exact number (a threshold, a percentage), or a min-max range.
- An exact number people type: HvNumberInput.

## What the consumer provides

- `values` + `onChange(values)` (an array: one value, or two for a range, where the track between the knobs is draggable), or `defaultValues`.
- `status` (one value, or one per knob) with `statusMessage`.
- `readOnly` hides the knobs and shows the value only.

## Spec

- Arrow keys move the focused knob.
- Track `text` over a `border` rail; knobs are `radii.full` circles with a `textDimmed` ring and a `primaryDimmed` halo when active.
- Marks in `caption1` (`textDisabled` when disabled); the value tooltip (while dragging) on `bgContainer` with `space.sm` padding in `body`.

## Don't

- Don't leave a slider with no label: pass `label` as a string (each knob's name is `<label>-knob-<n>`, even with `hideInput`).
- Don't use a huge range with fine steps: people can't hit an exact value; keep the input visible or use HvNumberInput.
