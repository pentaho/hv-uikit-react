# Working in `apps/docs`

_Applies to `apps/docs/src/\*\*/_.mdx`\*

## Components

- Leverage the `Playground` component for the most commonly/relevant component props.
- Include only meaningful and distinct doc sections, avoiding redundant examples.
- Ensure each doc section has a clear description aligned with the following code block.
- Use UnoCSS classes to style the docs, avoiding EmotionCSS and `style`.

## Component guidance lives with the component

Usage guidance, best practices, accessibility notes and API decisions are recorded in
`packages/core/src/<Component>/<Component>.doc.ts`, not here. That keeps an API change
and its guidance in the same pull request.

These pages are for consumers: prose, live examples and the playground.
