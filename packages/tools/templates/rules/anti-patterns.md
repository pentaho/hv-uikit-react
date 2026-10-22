# Component Rules

## Introduction

Use UI Kit components consistently to preserve shared behavior, accessibility, and theme support.

## Prefer UI Kit components

Prefer an existing UI Kit component over native controls, third-party widgets, or custom implementations of the same interaction. Consult the component inventory and contract first to preserve accessibility, behavior, and theme consistency.

Native semantic elements and layout wrappers are appropriate where they do not recreate a UI Kit widget. Application-logic wrappers may compose UI Kit components. If no component meets the requirement, document that gap rather than forcing an unsuitable replacement.

Examples:

```diff
- <div onClick={save}>Save</div>
+ <HvButton onClick={save}>Save</HvButton>
```

## Self-evident disabled actions

Explain why an action is disabled when the reason is not otherwise clear. Make the explanation available without requiring hover or focus on the disabled control, which may not be keyboard-focusable.

Examples:

```diff
+ <HvTypography variant="caption1">Enter a name to enable saving.</HvTypography>
```
