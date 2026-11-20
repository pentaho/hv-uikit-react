---
component: HvCharCounter
status: stable
related: [HvTextArea, HvTagsInput, HvFormElement]
---

# HvCharCounter

Part of HvFormElement: the "current / max" character counter of a field.

## When to use

- Comes with HvTextArea (`maxCharQuantity`) and HvTagsInput (`maxTagsQuantity`); use it directly only for a custom field with a limit.

## What the consumer provides

- On HvTextArea, hide it with `hideCounter` and adjust it with `countCharProps` (the separator is `middleCountLabel`).

## Spec

- Right-aligned; the current count is the `label` text and the max the `body` text, both `negative` once over the limit; `textDisabled` when disabled; changes are announced politely.

## Don't

- Don't show a counter with no enforced limit: the counter alone doesn't stop anyone going over, so pair it with validation or, on HvTextArea, `blockMax`.
