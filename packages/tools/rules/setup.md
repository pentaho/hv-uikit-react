# Setup Rules

## Introduction

How an app installs, wraps and styles with the UI Kit.

## Provider and font

Wrap the app once in `HvProvider`, with React 18 or 19.

- `HvProvider` comes from `@pentaho/uikit-react-core`. Its theme is `pentaho` by default, so pass none.
- `colorMode="dark"` switches the mode: use tokens and never check the mode yourself.
- Load the theme's font, Inter, once. Apps created with `uikit-cli` already do. Otherwise, with `@fontsource-variable/inter`, declare its woff2 as "Inter" in an `@font-face` in the global CSS (the package calls it "Inter Variable").

The imports and styling rules are in `components/imports` and `tokens/classes-and-css`.
