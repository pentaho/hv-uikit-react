# Principles

## Introduction

Pentaho UI Kit is a calm, data-dense system for enterprise products: slate neutrals, one blue for action, a strict set of status colors. It is for product screens, dashboards and forms, not marketing pages.

## Neutral first, color means something

Surfaces are neutral; `primary` marks the action; `positive`, `warning`, `negative` and `info` mark state (`components/status`).

## Dense but legible

Default control size (the component's `size` prop to change it), body text for everything else; `space.sm` between fields and inside cards, `space.md` between sections, `space.lg` only between major regions.

## Tokens, never values

Colors, spacing, corners and type come from the theme by name, so theme changes reach every screen (`tokens`).
