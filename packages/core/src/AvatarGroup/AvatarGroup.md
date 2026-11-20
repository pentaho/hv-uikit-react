---
component: HvAvatarGroup
status: stable
related: [HvAvatar, HvTooltip]
---

# HvAvatarGroup

A stack of overlapping HvAvatars with a "+N" for the rest.

## When to use

- Showing who is involved (members, watchers, reviewers) where there is room for a few faces.
- One person: HvAvatar. A full list of people: a table or HvListContainer.

## What the consumer provides

- HvAvatar children; `size` on the group applies to all of them, so don't set it per avatar.
- `role="group"` and an `aria-label` for the group ("Members: Ana, Joe and 3 more"), since the overlapping initials don't read as a list; the root has no role of its own.
- `alt` and `role="img"` on each avatar, wrapped in HvTooltip to show the name on hover. The default "+N" avatar has no tooltip or name: pass `overflowComponent` returning an HvTooltip-wrapped HvAvatar (with `role="img"`) saying "+3 more users".

## Spec

- Each avatar ringed in `bgPage` so the overlap stays readable; the "+N" avatar uses the `neutral` preset; the first seven avatars take the presets in order (`blue` … `neutral`).
