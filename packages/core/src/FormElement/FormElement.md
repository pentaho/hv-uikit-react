---
component: HvFormElement
status: stable
related:
  [HvLabel, HvInfoMessage, HvWarningText, HvCharCounter, HvAdornment, HvInput]
---

# HvFormElement

The wrapper that shares `required`, `disabled`, `readOnly` and `status` with a custom field's label, help text and error.

## When to use

- Labeling and validating a control the kit has no field for (a custom picker, a group of toggles): wrap it with HvLabel, HvInfoMessage and HvWarningText inside.
- HvInput, HvSelect, HvDropdown, HvDatePicker and the other fields already use it: give them `label` and `statusMessage` instead.

## What the consumer provides

- Kit controls inside read `required`, `disabled`, `readOnly`, `name` and `status` from it. It does not validate: set `status` yourself.
- Children: HvLabel, the control, HvInfoMessage (help), HvWarningText (the error, shown only when `status` is `invalid`, announced politely, hidden when `disabled`).
- Give HvLabel `htmlFor` (the control's id), and point a non-kit control's `aria-describedby` at the help text and `aria-errormessage` at the error (HvBaseInput takes them through `inputProps`).

## Spec

- No look of its own; its parts carry it (label, `textSubtle` help, `negative` error and required mark, `textDisabled` when disabled).

## Don't

- Don't wrap an HvInput in it to add a label: pass `label` to the input.
- Don't show an error only by color: put the message in HvWarningText.
