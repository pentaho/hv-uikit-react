---
component: HvSnackbar
status: stable
related: [HvSnackbarContent, HvBanner, HvDialog]
rules: [uikit/no-hardcoded-values]
---

# HvSnackbar

A brief message about something that just happened, which hides itself after a few seconds.

## When to use

- Confirming an action ("Asset saved", "3 assets deleted") or a background process finishing, with an optional Undo.
- A state people must act on, or that persists: HvBanner. An error in a form: the field's `statusMessage`.
- Queued or app-wide: HvSnackbarProvider.

## What the consumer provides

- `open` + `onClose(event, reason)`: you own the state. `onClose` runs on timeout, click-away and the close button (reason `"timeout"` or `"clickaway"`), and you set `open` to false; ignoring `clickaway` would break the close button.
- One message: render it next to the action that triggers it and keep `open` in state; no provider needed.
- `label`: the message in one sentence. `action`: one HvButton, or `{ id, label }` with `onAction(event, action)`; keep an Undo reachable for the whole time it is shown.
- `transitionDirection` to match `anchorOrigin`: `up` for bottom, `down` for top (it slides in from the left by default).

## Spec

- `role="alert"`. `default` and `info` look the same.
- The callout look (variant outline and soft fill, `radii.round`) with `shadow`, `space.xs` padding, `body` message; fixed width, at most a few lines.
- Vertical inset is `offset` (default clears page chrome), side inset `space.xs` for left and right anchors.

## Don't

- Don't use it for critical errors or anything people must read: it disappears; use HvBanner or an inline message.
- Don't give it more than one action, or long text: one sentence, one optional action; if it must be long, wrap `label` in HvOverflowTooltip.
