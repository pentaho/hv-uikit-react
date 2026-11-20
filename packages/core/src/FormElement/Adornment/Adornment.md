---
component: HvAdornment
status: stable
related: [HvInput, HvFormElement, HvIconButton]
---

# HvAdornment

Part of HvInput: an icon or small icon button inside the field, at its end.

## When to use

- A unit, status icon or one extra action inside an HvInput, through its `endAdornment` prop.
- Clear, search, reveal-password and valid-icon adornments are built in: don't add them yourself (HvInput's `hideClear`, `hideRevealPassword`, `hideSearchButton` and `showValidationIcon` control them).

## What the consumer provides

- `onClick` makes it a button; `showWhen` (a form status such as `valid`) or `isVisible` controls when it shows.

## Spec

- A fixed slot at the end of the field, content centered; hidden entirely when not visible; disabled with the field.

## Don't

- Don't make an adornment the only way to do something: by default it is skipped by the keyboard and hidden from assistive tech (`aria-hidden`), so provide the action another way, or pass `tabIndex={0}` plus an `aria-label`.
- Don't put actions that belong next to the field (Browse, Test connection) inside it: use an HvButton beside it.
