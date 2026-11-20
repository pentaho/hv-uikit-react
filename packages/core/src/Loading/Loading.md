---
component: HvLoading
status: stable
related: [HvLoadingContainer, HvSkeleton, HvProgressBar, HvEmptyState]
rules: [uikit/no-hardcoded-values]
---

# HvLoading

Three animated bars saying a process is running, with an optional label.

## When to use

- A wait of unknown length with no known content shape: running a job, opening a view.
- Content whose shape you know (rows, cards, text): HvSkeleton. Over content that stays visible: HvLoadingContainer. Known percentage: HvProgressBar.

## What the consumer provides

- `label` ("Loading assets…"), or `aria-label` when there's no visible text.
- `role="progressbar"` when people are waiting on it (it has no role of its own).
- Inside a button while it submits: `small` with `color="inherit"`, and disable the button.

## Spec

- Three bars in `primary` (`text` when `small`), label in `caption1` `space.xs` below; centered in its box.

## Don't

- Don't show a spinner with no words when the context doesn't say what is loading: add `label`.
- Don't set `hidden` to a literal: tie it to the real state (`hidden={!isLoading}`) or render it only while loading.
