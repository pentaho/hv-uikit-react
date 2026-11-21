---
component: HvContainer
status: stable
related: [HvGrid, HvSection]
rules: [uikit/no-inline-style, uikit/theme-sizes]
---

# HvContainer

Centers page content horizontally and caps its width at a breakpoint, with responsive side gutters.

## When to use

- The outer wrapper of a page or a form that should not stretch across wide screens (`maxWidth="md"` or `"lg"` for forms and reading pages). In a Pentaho plugin the App Shell already wraps each view in one: don't add another.
- Columns inside it: grid classes with token gaps (`grid md:grid-cols-2 gap-md`).

## What the consumer provides

- `disableGutters` when the parent already pads; `component` (`main`, `section`) for the right landmark.

## Spec

- Full width unless `maxWidth` is set. Side gutters `space.sm` below the `md` breakpoint, four spacing units from `md` up.

## Don't

- Don't hand-write a max width or side padding: use `maxWidth` and the built-in gutters.
- Don't nest containers in containers.
