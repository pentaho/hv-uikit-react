# Accessibility Rules

## Introduction

The interfaces we produce must be accessible, according to the [WCAG Level AA](https://www.w3.org/TR/WCAG22/) and US Section 508 directives.

## Rules of ARIA

- Prefer native HTML — Use <button> not <div role="button">. Native elements have built-in keyboard, focus, and semantics.
- No ARIA is better than Bad ARIA — Use only ARIA when necessary, as incorrect ARIA harms the user experience.
- Don't change native semantics where prohibited — Don't add role="heading" to a <button>. Use the correct element.
- All ARIA controls must be keyboard operable — If role="button", handle Enter and Space key events.
- Don't use aria-hidden="true" on focusable elements — Hidden from assistive tech but still focusable creates a "ghost" element.
- All interactive elements need an accessible name — Via label, aria-label, aria-labelledby, or visible text content.
