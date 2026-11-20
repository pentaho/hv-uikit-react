---
component: HvTimeAgo
status: stable
related: [HvTypography, HvDateColumnCell, HvTooltip]
---

# HvTimeAgo

A relative time ("5 minutes ago", "Yesterday") that refreshes itself while the page is open.

## When to use

- When something happened recently and recency matters more than the exact moment: last run, last edit, comment times, live event feeds.
- An exact date (due dates, audit records): the app's date formatter in an HvTypography. Static text where no refresh is needed: a relative date from the same formatter.

## What the consumer provides

- `timestamp` in milliseconds since epoch (`Date.parse(record.updatedAt)`); null or 0 shows `emptyElement`.
- HvTypography props such as `variant="caption1"` for secondary lines; `justText` for a bare string (or the `useTimeAgo` hook).

## Spec

- Renders through HvTypography (`body` unless you set a `variant`); no styles of its own; refreshes every ten seconds unless `disableRefresh`.
- Prints "now" under twenty seconds, seconds up to two minutes, minutes up to an hour, then "Today" / "Yesterday" / "Tomorrow" with the time, a short weekday within the week, and the full date and time beyond a week.

## Don't

- Don't show a relative time with no way to see the exact one: wrap it in HvTooltip with the exact date for audit-style data.
- Don't pass an ISO string (`timestamp` is a number), or `Date.now()` for "just now": use the record's time or the app's notion of now.
