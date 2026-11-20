---
component: HvAvatar
status: stable
related: [HvAvatarGroup, HvTypography, HvBadge]
---

# HvAvatar

A person's or item's picture, initials or a generic user icon, in a circle or square.

## When to use

- Next to a person's name: owners in table cells (`size="xs"`, initials), the signed-in user in the header, authors in comments.
- `variant="square"` for products, apps or brand logos; `circular` for people.
- Several people at once (watchers, members): HvAvatarGroup.

## What the consumer provides

- Initials as `children` (from the person's name), or `src` with `alt`; if the image is missing or fails to load it falls back to `children`, then the first letter of `alt`, then a user icon. An icon as `children`: one size below the avatar's (`md` avatar, `sm` icon).
- `sm` is the same size as `xs`.
- `color`: a preset (`blue`, `orange`…) pairs a fill and text that work in both modes; a token name needs `backgroundColor`, and its letters default to `bgContainer`, so on a light fill set `color` too.
- `status` (a ring) and `badge` (a dot) are token names: explain each in text.

## Spec

- Default: `primaryStrong` semibold initials on `primaryDimmed`, a thin `bgContainerSecondary` edge, `radii.full` when circular.
- Letters scale with `size` (fixed font sizes, not type styles); `space.xxs` around it for the status ring and badge.

## Don't

- Don't make an avatar the only way to tell who it is: put the name next to it. To make it clickable, wrap it in an HvButtonBase or link with an `aria-label` (an avatar has no `onClick`).
- Don't use `status` or `badge` colors without words: say "Online" or "Away" nearby too.
- Don't use large sizes (`lg`, `xl`) in dense lists and tables.
