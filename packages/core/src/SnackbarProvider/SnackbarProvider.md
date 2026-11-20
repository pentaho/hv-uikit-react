---
component: HvSnackbarProvider
status: stable
related: [HvSnackbar, HvSnackbarContent, HvBanner]
rules: [uikit/no-hardcoded-values]
---

# HvSnackbarProvider

Shows snackbars from anywhere in the app, queued and stacked, through the `useHvSnackbar` hook.

## When to use

- Messages triggered away from where they show (after a request resolves, from a store or a hook), or several that can pile up.
- One message beside the action that triggers it: HvSnackbar alone, with `open` in state.

## What the consumer provides

- Wrap the app once, near the root, inside HvProvider; the App Shell already provides one to its apps and plugins.
- Inside it, `const { enqueueSnackbar, closeSnackbar } = useHvSnackbar()`; `enqueueSnackbar(label, { variant })` shows one and returns its key, `closeSnackbar(key)` closes it.

## Spec

- Each message is an HvSnackbarContent with its variant icon; new ones stack on the older ones, up to `maxSnack`.

## Don't

- Don't nest a second provider: one per app.
- Don't use it for state people must act on, or that persists: HvBanner.
