---
component: HvEmptyState
status: stable
related: [HvLoading, HvSkeleton, HvBanner, HvButton]
---

# HvEmptyState

Says why there is nothing here and what to do next.

## When to use

- No records yet, no search or filter results, or nothing selected.
- While data loads: HvSkeleton or HvLoading. A failed request: a message in `role="alert"` with Retry (HvBanner for the whole page).

## What the consumer provides

- `icon`: a Phosphor icon, `aria-hidden` since the words carry the meaning.
- `title` ("No results for “sales”") and a one-sentence `message` on what to do; `action`: a focusable control for the next step (create one, or "Clear filters").
- The title renders as text, not a heading; add `role="status"` on the wrapper when it replaces results as people filter.

## Spec

- Centered in its container; icon beside the text (stacked and centered on the smallest screens), `space.xs` apart.
- Title in `title4` with `space.xxs` above and `space.sm` below; message in `body` (`text`); action `space.sm` below the message.
- With only a `message` (no `title`, no `action`) the icon and message sit on one row, vertically centered, at every size.

## Don't

- Don't leave an empty table, chart or list with no explanation.
- Don't show an empty state while loading: it says "there is nothing", not "wait".
- Don't put buttons or links in `message`: use `action`, with one wrapper when there are several controls.
