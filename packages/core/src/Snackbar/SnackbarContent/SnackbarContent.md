---
component: HvSnackbarContent
status: prefer-alternative
related: [HvSnackbar, HvBannerContent]
---

# HvSnackbarContent

Part of HvSnackbar: the message box it positions and animates.

## When to use

- Not directly: HvSnackbar renders it (pass its props through `snackbarContentProps`) and HvSnackbarProvider uses it for queued messages. A static inline message: HvBannerContent.

## Spec

- Callout look with `shadow` and `space.xs` padding.
