# Setup Rules

## Introduction

How an app installs, wraps and styles with the UI Kit.

## Provider and font

Wrap the app once in `HvProvider`, with React 18 or 19.

- `HvProvider` comes from `@pentaho/uikit-react-core`. Its theme is `pentaho` by default, so pass none.
- `colorMode="dark"` switches the mode: use tokens and never check the mode yourself.
- Load the theme's font, Inter, once. Apps created with `uikit-cli` already do. Otherwise, with `@fontsource-variable/inter`, declare its woff2 as "Inter" in an `@font-face` in the global CSS (the package calls it "Inter Variable").

## Imports

- Components come from `@pentaho/uikit-react-core` and are named `Hv*` (`npx --no-install uikit-tools components`; `npx --no-install uikit-tools info <Component>` for props and when to use each).
- Icons come from `@phosphor-icons/react`, never `@pentaho/uikit-react-icons` (internal); no hand-drawn `<svg>`.
- Never import `@mui/material` or `@base-ui/react`: they are the UI Kit's internals, not its API.

## Styling

- Style with utility classes from the UI Kit's UnoCSS preset, `@pentaho/uikit-uno-preset` (apps created with `uikit-cli` have it; otherwise set it up as the UI Kit's styling guide says). The theme's tokens are classes: spacing `p-md`, `gap-sm`, `mb-xs`; colors `text-textSubtle`, `bg-bgContainer`, `border-border`, `text-negative`; radii `rounded-round`; breakpoints as prefixes, `md:grid-cols-2`.
- Never arbitrary sizes or colors in classes (`p-[24px]`, `text-[#f00]`): they skip the theme (`uikit/no-arbitrary-utilities`).
- For styles too complex for classes, or in an app without the preset: `css()` from `@emotion/css` with `theme` from `@pentaho/uikit-react-core` (`theme.colors.text`, `theme.space.md`, `theme.spacing("xs", "sm")`, `theme.radii.round`).
- `style` only for values computed at run time, from the theme or state (`style={{ color: theme.colors[status] }}`); never fixed values (`uikit/no-inline-style`).
