---
component: HvProgressBar
status: stable
related: [HvLoading, HvSkeleton, HvProgressColumnCell, HvFileUploader]
---

# HvProgressBar

A thin bar with a percentage showing how far a process with a known length has got.

## When to use

- Uploads, imports, jobs and quotas where you know the percentage.
- Unknown duration: HvLoading. Progress inside a table cell: HvProgressColumnCell.

## What the consumer provides

- `value` 0–100 (clamped). `status` only changes the color, so pass `value={100}` with `completed`.
- `aria-label` ("Import progress") or `aria-labelledby` pointing at a visible label.

## Spec

- `role="progressbar"` with no label of its own.
- A thin `border` track; the bar is `text` in progress, `positive` when completed, `negative` on error.
- Percentage in `caption2` above the bar, moving with its end.

## Don't

- Don't leave a progress bar without a name.
- Don't show status by color alone: say "Failed" or "Done" next to it.
