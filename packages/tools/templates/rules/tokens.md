# Token Rules

## Introduction

Use design tokens for every color, spacing value, and text style. `npx --no-install uikit-tools tokens <word>` lists them with their values and what each is for (for example `npx --no-install uikit-tools tokens border`).

## Colors

Use theme color tokens by name: `primary` for action, `accent` for a highlight that is neither action nor status, `positive`, `warning`, `negative`, and `info` for state, and the surface and text tokens in `tokens/surfaces-and-text`. As classes (`text-negative`, `bg-bgContainer`) or, in `css()`, `theme.colors.negative`. Never use raw hex, rgb, or named colors.

Examples:

```diff
- <div style={{ color: "#FF0000" }}>{content}</div>
+ <div className="text-negative">{content}</div>
```

## Surfaces and text

- The page is `bgPage`; cards, panels and dialogs are `bgContainer`; nested regions are `bgContainerSecondary`. Table rows sit on `bgContainer` under a `bgPage` header row (HvTable does this).
- Hover, selected and focus states come from the component: don't recolor them.
- Text is `text`; secondary copy is `textSubtle` on `bgContainer`, but `text` directly on `bgPage` (`textSubtle` misses AA there in light mode); disabled is `textDisabled`.
- Text on `primary`, `positive` and `negative` fills is `textLight`; on `warning`, `textDark`; on a soft `…Dimmed` fill, the family's `…Strong` for short labels (tags) and `textDark` for message text (banners). Prefer the components, which already pair them.

## Spacing

Use token values: `xxs`, `xs`, `sm`, `md`, `lg`, and `xl`. As classes (`p-md`, `gap-sm`) or, in `css()`, `theme.space.md`. Never use raw pixel values.

Examples:

```diff
- <div style={{ padding: "24px", marginBottom: "16px" }}>{content}</div>
+ <div className="p-md mb-sm">{content}</div>
```

## Typography

Use `HvTypography` with semantic variants for display, headings, body, caption, and label text. Never use inline font-size or font-weight.

Examples:

```diff
- <div style={{ fontSize: 24, fontWeight: 600 }}>Assets</div>
+ <HvTypography variant="title2">Assets</HvTypography>
```
