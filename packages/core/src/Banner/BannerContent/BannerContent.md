---
component: HvBannerContent
status: stable
related: [HvBanner, HvSnackbar]
---

# HvBannerContent

Part of HvBanner: the callout itself, also usable inline as a static message inside a page region.

## When to use

- A persistent inline notice in a form, card or section ("This dataset is read-only").
- A view's load error, above its content with a Retry action (`variant="error"`, `showIcon`).
- A floating page-level message: HvBanner, which positions and animates this content.

## What the consumer provides

- `children`: the message. `customIcon` replaces the icon and shows on its own, without `showIcon`.
- `onClose` to make it dismissible; `actionProps` to rename the close button ("Close").
- `actions` + `onAction`, or your own node (then you handle the clicks and `onAction` is not called).
- `role="status"` for a notice that isn't urgent.

## Spec

- `role="alert"`.
- The same callout as HvBanner: variant outline and `…Dimmed` fill, `radii.round`, `body` text, `space.xs` gaps.
