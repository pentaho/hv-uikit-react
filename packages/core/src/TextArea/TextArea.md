---
component: HvTextArea
status: stable
related: [HvInput, HvCharCounter, HvFormElement]
rules: [uikit/raw-elements]
---

# HvTextArea

A multi-line text field with label, description, validation and an optional character counter.

## When to use

- Comments, descriptions and notes longer than one line.
- One line of text: HvInput. A list of values: HvTagsInput.

## What the consumer provides

- `value` + `onChange(event, value)`, or `defaultValue`.
- `rows` set to the expected length (e.g. 4): the default is 1.
- `status` with `statusMessage`, or `validation(value)` returning a boolean; validation runs on blur. `infoMessage` is an error-prevention hint, hidden while an error shows.

## Spec

- Same field as HvInput: `radii.round`, `textDimmed` outline, `primary` on hover, `negative` when invalid; `body` text, `textSubtle` placeholder.
- Counter right-aligned above the field, in `negative` when over the limit (announced politely).

## Don't

- Don't use a raw `<textarea>`.
- Don't hide a limit until submit: set `maxCharQuantity` so the counter shows it while they type.
- Don't use a placeholder as the label.
