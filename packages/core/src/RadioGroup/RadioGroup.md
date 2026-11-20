---
component: HvRadioGroup
status: stable
related: [HvRadio, HvCheckBoxGroup, HvSelect, HvMultiButton, HvSelectionList]
---

# HvRadioGroup

A labeled set of radio buttons for choosing exactly one option.

## When to use

- Two to about five mutually exclusive options that should all be visible (export format, visibility).
- Longer lists: HvSelect or HvDropdown. Several choices: HvCheckBoxGroup. Switching a view: HvMultiButton or HvTabs. Choices as richer rows: HvSelectionList.

## What the consumer provides

- `label` (or `aria-label`); HvRadio as direct children only (the group injects their state), each with `label` and `value`; values are compared strictly, so keep their types consistent.
- `value` + `onChange(event, value)`, or `defaultValue` (falls back to a child's `defaultChecked`).
- `status` and `statusMessage` for errors: the group does not validate by itself.

## Spec

- `role="radiogroup"` labeled by its HvLabel; Tab enters the group, arrow keys move and select; `name` defaults to a generated id, so the group submits in a form.
- Vertical stack, or a row with a `space.sm` gap.
- Invalid: a `negative` rule under the options (`space.xs` below) and the message.

## Don't

- Don't leave a group without `label` (or `aria-label`).
- Don't leave it without a default when one option is the obvious choice: pre-select it with `defaultValue` or `value`.
