---
component: HvBadge
status: stable
related: [HvTag, HvStatusIcon, HvIconButton]
rules: [uikit/no-hardcoded-values]
---

# HvBadge

A small count or dot attached to an icon or label, saying something new needs attention.

## When to use

- An unread or pending count on an icon (notifications, alerts) or next to a label (a tab's item count).
- A plain dot when the number doesn't matter: a numeric `label` without `showCount`.
- A status or category in words: HvTag. A state icon with its meaning: HvStatusIcon.

## What the consumer provides

- `icon` (a Phosphor icon, or an HvIconButton) or `children` (an HvTypography label) for the badge to attach to; with neither it sits inline.
- A numeric `label` at zero or below hides the badge.
- Name the count in the owning control's accessible name ("Notifications, 3 unread"). HvBadge has no prop that reaches the count element.

## Spec

- `caption2` text, `radii.full` pill, fixed tight side padding; one digit renders as a circle, an empty label as a small dot.
- Default fill `textSubtle` with inverted text; `primary`, `positive`, `warning`, `negative` render that color's text on its `…Dimmed` fill; `textSubtle` renders on `bgPageSecondary`. Other theme colors render as a solid fill with the inverted text.
- Positioned at the top-right corner of its icon or children; with an icon the anchor area is at least the icon button's size.

## Don't

- Don't make a badge the only carrier of meaning: the icon button or label it sits on says what is counted.
- Don't use it for text badges ("New", "Beta") or long labels: use HvTag.
- Don't put color values or hex in `color`: pass a token name (`uikit/no-hardcoded-values`).
