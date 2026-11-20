---
component: HvWarningText
status: stable
related: [HvFormElement, HvLabel, HvInfoMessage]
---

# HvWarningText

Part of HvFormElement: the validation error under a field, with an icon, announced politely.

## When to use

- The error message of a custom control inside HvFormElement; it shows when the element's `status` is `invalid`.
- Kit fields render it from `statusMessage`. Page-level errors: HvBanner or an inline message with `role="alert"`.

## What the consumer provides

- Its `id` defaults to the form element's id plus `-error`: point the control's `aria-errormessage` at it.
- `isVisible` overrides the status; `hideText` hides it visually but still announces it.

## Spec

- `caption1` text in `negative` with the fail icon and a top rule in the same color; a polite live region (`role="status"`), its content rendered only when visible and not disabled, so it is announced when it appears.

## Don't

- Don't write generic text ("Invalid"): say what's wrong and how to fix it.
