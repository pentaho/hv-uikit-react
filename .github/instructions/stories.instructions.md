---
applyTo: "packages/**/*.stories.tsx"
name: Stories Instructions
---

## Instructions

- Add few but meaningful doc examples, avoiding redundant examples.
- Ensure each Story has a clear description, written in JSDoc.
- Use the `play` function to demo & test interactive behavior when a unit test is not sufficient.
- Ensure each Stories file has a primary `Main` Story for the default state, and forwards the `args` to the component.
- Use UnoCSS classes to style the docs, avoiding EmotionCSS and `style`.
