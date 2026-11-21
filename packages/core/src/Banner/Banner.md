---
component: HvBanner
status: stable
related: [HvBannerContent, HvSnackbar, HvDialog, HvEmptyState]
rules: [uikit/no-hardcoded-values]
---

# HvBanner

An important message at the top of the page that stays until people dismiss it, with optional actions.

## When to use

- A state of the whole app that people must notice: an expiring license, read-only mode. It floats over the page (fixed, `offset` from the top), covering what's there.
- Brief confirmation of something that just happened: HvSnackbar. A decision before continuing: HvDialog.
- A failed load or an error in one view (an App Shell page): HvBannerContent, inline above the content, so it doesn't cover the title.

## What the consumer provides

- `open` + `onClose`: passing `onClose` adds the close button; you set `open` to false.
- `label`: the message ("Couldn't load assets. Check your connection and try again.").
- `customIcon` shows on its own, without `showIcon`.
- `actions` as `[{ id, label }]` with `onAction`, or your own node (then you handle the clicks and `onAction` is not called).
- `offset` to sit below the app header.
- For a non-urgent banner pass `bannerContentProps={{ role: "status" }}`.
- Rename the close button ("Close") with `bannerContentProps={{ actionProps: { "aria-label": "…" } }}`.

## Spec

- `role="alert"`, so screen readers announce it when it opens.
- `radii.round` corners, an outline in the variant's color (`success` positive, `warning`, `error` negative, `info`, `accent`; `default` looks like `info`) on its `…Dimmed` color mixed half with `dimmer`; title in its `…Deep` color.
- Message in `body` type, colored `textDark`; padding `space.xs` (regular), `space.sm` (large) or none (`micro`), gaps `space.xs`; spans the page width, centered.

## Don't

- Don't show several banners at once, or a banner for routine success.
- Don't rely on color alone: use the `variant` with `showIcon`, and words that say what happened and what to do.
