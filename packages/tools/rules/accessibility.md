# Accessibility Rules

## Introduction

Meet [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) and US Section 508.

## Rules of ARIA

- Prefer real elements over ARIA roles: a UI Kit component (`anti-patterns/prefer-ui-kit-components`), or the native element when there is none; never `<div role="button">`.
- Use ARIA only when necessary: bad ARIA is worse than none.
- Don't change native semantics (no `role="heading"` on a `<button>`); use the right element.
- An ARIA widget role needs its keyboard pattern.
- Never `aria-hidden="true"` on a focusable element.
- Every interactive element has an accessible name: a label, `aria-label`, `aria-labelledby` or visible text.

## Contrast and names

- Text and its background meet WCAG AA in both modes: use the text and background pairs in `tokens/surfaces-and-text`, never new ones.
- Every control has a visible `label`, or an `aria-label` only when a visible label is impossible; give tables, lists and regions an accessible name (`aria-label`), and keep the UI Kit's keyboard and focus behavior: don't intercept keys or hide focus outlines.
