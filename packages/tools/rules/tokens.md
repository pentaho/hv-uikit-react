# Token Rules

## Colors

Use theme color tokens by name: `primary` for action, `accent` for a highlight that is neither action nor status, `positive`, `warning`, `negative`, and `info` for state, and the surface and text tokens in `tokens/surfaces-and-text`. Never raw hex, rgb, or named colors: the API accepts `color="coral"`, but it ignores the theme and dark mode. `npx --no-install uikit-tools tokens <word>` lists them with their values and what each is for.

## Surfaces and text

- The page is `bgPage`; cards, panels and dialogs are `bgContainer`; nested regions are `bgContainerSecondary`. Table rows sit on `bgContainer` under a `bgPage` header row (HvTable does this).
- Hover, selected and focus states come from the component: don't recolor them.
- Text is `text`; secondary copy is `textSubtle` on `bgContainer`, but `text` directly on `bgPage` (`textSubtle` misses AA there in light mode); disabled is `textDisabled`.
- Text on `primary`, `positive` and `negative` fills is `textLight`; on `warning`, `textDark`; on a soft `…Dimmed` fill, the family's `…Strong` for short labels (tags) and `textDark` for message text (banners). Prefer the components, which already pair them.

## Spacing

Use token values: `xxs`, `xs`, `sm`, `md`, `lg`, and `xl`. Never raw pixel values.

## Classes and css()

- Style with the UnoCSS preset's utility classes, where the tokens are classes: spacing `p-md`, `gap-sm`; colors `text-textSubtle`, `bg-bgContainer`, `border-border`; radii `rounded-round`; breakpoints as prefixes, `md:grid-cols-2`. A component's `classes` takes classes per part (`classes={{ content: "h-full" }}`).
- Never pixel or arbitrary values in classes (`p-4px`, `p-[24px]`, `text-[#f00]`): they skip the theme.
- For styles too complex for classes: `css()` from `@emotion/css` with `theme` from `@pentaho/uikit-react-core` (`theme.colors.text`, `theme.space.md`, `theme.spacing("xs", "sm")`, `theme.radii.round`).
- `style` only for values computed at run time, from the theme or state (`style={{ color: theme.colors[status] }}`), never fixed values.
