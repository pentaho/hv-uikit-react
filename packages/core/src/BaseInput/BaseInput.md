---
component: HvBaseInput
status: prefer-alternative
related: [HvInput, HvTextArea, HvFormElement]
rules: [uikit/deprecated]
---

# HvBaseInput

The bare text field (no label, messages or adornment logic) that HvInput and HvTextArea are built on.

## When to use

- Prefer HvInput (one line) or HvTextArea (several lines), which add the label, description and validation.
- A custom field composed with HvFormElement: there it takes `disabled`, `readOnly`, `required`, the invalid status and `aria-describedby` / `aria-errormessage` from the context; pair it with HvLabel (and HvInfoMessage / HvWarningText). `inputRef` is deprecated: use `ref`.

## Spec

- `radii.round` field, `textDimmed` outline, `primary` on hover, focus ring on focus, `negative` outline when invalid; `body` text, `textSubtle` placeholder. Disabled: `bgDisabled`, `textDisabled`. Read-only: `bgPage`, `textSubtle`.

## Don't

- Don't build a field on it without a label: it has none of its own.
