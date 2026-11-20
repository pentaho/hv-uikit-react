---
component: HvInfoMessage
status: stable
related: [HvFormElement, HvLabel, HvWarningText]
---

# HvInfoMessage

Part of HvFormElement: the help text under a field label.

## When to use

- A hint that prevents mistakes ("Use the format name@company.com") on a custom control inside HvFormElement.
- On kit fields (HvInput and others) pass `description` or `infoMessage` instead.

## What the consumer provides

- One short sentence. Inside HvFormElement its `id` defaults to the form element's description id; set `id` only when wiring a custom control's `aria-describedby`.

## Spec

- `body` text in `textSubtle` (`textDisabled` when disabled); gutter `space.xxs` below and `space.xs` before.

## Don't

- Don't put error text in it: errors go in HvWarningText.
