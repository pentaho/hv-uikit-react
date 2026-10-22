# Token Rules

## Introduction

Use design tokens for every color, spacing value, and text style.

## Colors

Use semantic tokens only: `primary`, `secondary`, `positive`, `negative`, and `warning`. Never use raw hex, rgb, or named colors. Semantic tokens keep colors consistent with the theme.

Examples:

```diff
- <div style={{ color: "#FF0000" }}>{content}</div>
+ <div style={{ color: theme.colors.negative }}>{content}</div>
```

## Spacing

Use token values: `xxs`, `xs`, `sm`, `md`, `lg`, and `xl`. Never use raw pixel values or custom margins/padding. Spacing tokens preserve a consistent spacing scale.

Examples:

```diff
- <div style={{ padding: "24px", marginBottom: "16px" }}>{content}</div>
+ <div style={{ padding: theme.space.md, marginBottom: theme.space.sm }}>{content}</div>
```

## Typography

Use `HvTypography` with semantic variants for display, headings, body, caption, and label text. Never use inline font-size or font-weight. Semantic typography keeps text styles and visual hierarchy consistent.

Examples:

```diff
- <div style={{ fontSize: 24, fontWeight: 600 }}>Assets</div>
+ <HvTypography variant="title2">Assets</HvTypography>
```
