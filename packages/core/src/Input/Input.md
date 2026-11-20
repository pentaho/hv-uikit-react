---
component: HvInput
status: stable
related:
  [
    HvSearchInput,
    HvNumberInput,
    HvTextArea,
    HvTagsInput,
    HvSelect,
    HvFormElement,
    HvDatePicker,
    HvTimePicker,
  ]
rules: [uikit/raw-elements]
---

# HvInput

A single-line text field with its label, description and validation message.

## When to use

- Free text, emails, URLs and passwords in forms (`type="password"` adds a reveal button; an unsupported `type` renders as `text`).
- Searching a list: HvSearchInput. Numbers with step buttons: HvNumberInput. More than one line: HvTextArea. A list of values: HvTagsInput.
- Picking from known options: HvSelect or HvDropdown, not free text with suggestions. Dates and times: HvDatePicker, HvTimePicker.

## What the consumer provides

- `label`, or `aria-label` when a visible heading already labels it; `placeholder` is an example, not instructions.
- `value` + `onChange(event, value)`, or `defaultValue`; `onEnter(event, value)` for Enter to submit.
- Validation: the built-in checks (`required`, `minCharQuantity` / `maxCharQuantity`, `validation(value)`), or a controlled `status` with a `statusMessage` that says how to fix it.
- `suggestionListCallback(value)` returns `{ id, label }` suggestions.

## Spec

- Clear button on hover or focus when there is a value (`hideClear` drops it); suggestions take arrows, Enter and Escape.
- Field height fixed by the component; `radii.round` corners; `textDimmed` outline, `primary` on hover, the focus ring on focus; `negative` outline and message when invalid.
- Text in `body`, placeholder in `textSubtle`; inner side margin `space.xs`.
- Disabled: `bgDisabled` fill, `textDisabled` text and outline. Read-only: `bgPage` fill, `textSubtle` text.
- Required adds a `negative` asterisk after the label; errors render below in HvWarningText (a polite live region).

## Don't

- Don't use a placeholder as the label.
- Don't set `status="invalid"` without `statusMessage`: the error area only renders when both are controlled from the first render (pass `statusMessage=""` until there is one), or a built-in validation runs.
- Don't use a raw `<input>`: it misses the label wiring, focus ring and states (`uikit/raw-elements`).
