---
applyTo: "packages/*/**/*.tsx"
name: Component Contract JSDoc Tags
description: Guide for writing the JSDoc tags that, with the design notes, power uikit-tools lookups and MCP retrieval
---

## Overview

Contract tags record what the code guarantees: what each variant means, how states behave, and the accessibility wiring. Developers write them on the component.

Design guidance (when to use, spec, don'ts, wording, related components) is the designers' note beside the component, `<File>.md` next to `<File>.tsx`. Don't repeat it in tags. Token and layout rules live in `packages/tools/templates/rules`, and what lint can check lives in the lint rules.

The core build (`npm run build -w packages/core`, which runs `scripts/extract-contracts.js`) merges tags, notes and the TypeScript props into `dist/component-metadata.json`, which `uikit-tools info` and the MCP `get_component` read.

## Rules

1. **Be specific.** "Sets aria-pressed" is better than "accessible."
2. **Code facts only.** Variants, states and accessibility wiring. Guidance and don'ts go in the component's note; rules agents must follow go in the rule files or lint.
3. **Link to accessibility.** Every state or prop with a11y implications must mention it.

## Tags

- `@variantSemantics`: every valid variant and what it is for, one line each: `- "variantName": meaning`, or `- "variantName" (alias): meaning`. Lookups print only the name and the meaning, so anything the reader needs (the prop that selects it, an alias) goes in the meaning.
- `@stateRules`: how each state behaves and its accessibility implication: `- "stateName": behavior, implication`.
- `@a11y`: a `role: <role>` line (with or without a leading dash), then `- aspect: requirement` lines.

Names must be in double quotes; the extractor does not read backtick names.

## Example

The HvButton contract, shortened, as the template:

```typescript
/**
 * Button component is used to trigger an action or event.
 *
 * @variantSemantics
 * - "primary": the default; filled, for the main action of a view, form or dialog; one per context
 * - "secondarySubtle": outlined, for secondary actions outside forms and dialogs
 * - "secondaryGhost": no fill, for Cancel and minor actions in toolbars, cards and rows; the default when icon is set
 * - "negative": filled, for the destructive action in a confirming dialog
 * - "primaryGhost": unfilled, primary-colored, the lowest-emphasis primary action ("ghost" is the same)
 * - "positive…": positive, positiveSubtle and positiveGhost: avoid them, the text is below AA contrast; use primary or secondarySubtle and say the outcome in words
 * - "secondary": deprecated, logs a warning; use secondarySubtle
 *
 * @stateRules
 * - "disabled": click and mouse-down handlers do not fire and aria-disabled is true; the button leaves the tab order unless focusableWhenDisabled is set
 * - "focusableWhenDisabled": keeps a disabled button focusable, so keyboard and screen-reader users still find it
 * - "selected": sets aria-pressed to its value whenever it is defined; only for real toggles, not momentary actions
 *
 * @a11y
 * role: button (a native button with type="button"; another element through component)
 * - name: from children, or aria-label for an icon-only button
 * - disabled state: aria-disabled=true; without focusableWhenDisabled the button is also natively disabled and out of the tab order
 * - selected state: aria-pressed reflects selected, for toggle buttons
 */
export const HvButton = fixedForwardRef(function HvButton<...>(props, ref) {
  // implementation
});
```

Related: [component.instructions.md](component.instructions.md), [test.instructions.md](test.instructions.md), [stories.instructions.md](stories.instructions.md).
