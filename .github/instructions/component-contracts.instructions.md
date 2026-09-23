---
applyTo: "packages/*/**/*.tsx"
name: Component Contract JSDoc Tags
description: Guide for writing semantic JSDoc tags that power AGENTS.md, validation, and MCP retrieval
---

## Overview

Component contracts encode semantic information about usage patterns, state rules, tokens, anti-patterns, and accessibility requirements. These tags are extracted during build to generate:

- **AGENTS.md** — Quick-start guide for agents/developers using the component
- **component-metadata.json** — Canonical contract published with the package
- **Validation rules** — Pre-flight checks when consumers run `uikit-tools validate`
- **MCP tools** — On-demand retrieval via `uikit-tools mcp`

## JSDoc Tags

### `@variantSemantics`

List all valid variants and their semantic meaning. Used to teach agents which variant to use for which intent.

**Format:**

```
- `variantName`: semantic meaning
```

**Example:**

```typescript
/**
 * @variantSemantics
 * - `contained`: primary action, filled/contained style
 * - `subtle`: secondary action, low visual weight
 * - `ghost`: tertiary, minimal emphasis
 * - `{color}Contained`: emphasis for semantic colors (positive, negative, warning, primary, secondary)
 * - `{color}Subtle`: secondary emphasis for semantic colors
 * - `{color}Ghost`: tertiary for semantic colors
 * - `semantic`: inherits color from context via CSS variable, use only for custom color contexts
 */
```

**Why:** Agents need to understand _intent_ behind variants. "Use `primary`" is vague; "`contained` = primary action" is actionable.

---

### `@stateRules`

Describe how states behave and their accessibility implications.

**Format:**

```
- "stateName": behavior description, accessibility implication
```

**Example:**

```typescript
/**
 * @stateRules
 * - "disabled": when true, click handlers do not fire, aria-disabled=true, button is not focusable unless focusableWhenDisabled=true
 * - "selected": implies aria-pressed=true, should only be used for true toggle actions (not momentary/transient actions)
 * - "focusableWhenDisabled": when true, disabled button remains in tab order and can be focused (improves a11y for screen readers)
 */
```

**Why:** Developers need to understand the semantic implications of using state props, especially for accessibility.

---

### `@tokenConstraints`

Define which design tokens are required for each category (color, spacing, radius, etc.).

**Format:**

```
- category: requirement; allowed values (if specific)
```

**Example:**

```typescript
/**
 * @tokenConstraints
 * - color: use semantic tokens only (primary, secondary, positive, negative, warning, or inherit for semantic)
 * - size: use size tokens (xs, sm, md, lg, xl), never raw px values
 * - radius: use radius tokens (none, sm, md, lg), never raw px values
 */
```

**Why:** Validation can check that consumers don't use raw hex/rgb values or hardcoded px. Token rules are aggregated into AGENTS.md.

---

### `@antiPatterns`

Common mistakes and the correct approach. This is critical for agent guidance.

**Format:**

```
- Problem statement; why it's wrong — correct approach or alternative
```

**Example:**

```typescript
/**
 * @antiPatterns
 * - Do not invent custom variant names; only use defined variants — Use one of: contained, subtle, ghost, {color}Contained, {color}Subtle, {color}Ghost, semantic
 * - Do not use "selected" for momentary/transient button states; it implies aria-pressed toggle semantics — Use selected only for true toggle buttons (e.g., view mode toggles)
 * - Do not use raw color hex/rgb values; use color tokens instead — Replace #FF0000 with variant="negative" or color token
 * - Do not apply custom CSS directly; use the classes prop and theme tokens — Use className or classes prop with design tokens
 * - Do not mix semantic color variants with explicit color prop; choose one approach — Choose either variant="negative" OR color="..." but not both
 */
```

**Key:** Include concrete corrective guidance separated by `—` (em-dash). This appears as "✓ Instead:" in AGENTS.md.

**Why:** Anti-patterns teach agents what NOT to do. Without corrections, guidance is incomplete.

---

### `@a11y`

Accessibility requirements and implications.

**Format:**

```
- aspect: requirement and implications
```

**Example:**

```typescript
/**
 * @a11y
 * - role: button (or implicit if component="button")
 * - name: must have accessible name via children or aria-label
 * - disabled state: uses aria-disabled=true; when disabled without focusableWhenDisabled, not in tab order
 * - selected state: uses aria-pressed when selected prop is set, for toggle buttons
 * - required: focusableWhenDisabled should be true when a disabled button needs to be discoverable by assistive tech
 */
```

**Why:** Accessibility is not optional. Agents need to know which props have a11y implications and what attributes are automatically set.

---

### `@validationRules`

Rules that validation (`uikit-tools validate`) should enforce in consumer code.

**Format:**

```
- rule statement: error|warn|info
```

**Example:**

```typescript
/**
 * @validationRules
 * - variant must be one of the defined HvButtonVariant values (no custom variants): error
 * - color must not be a raw hex/rgb value; use tokens instead: error
 * - selected should only be used with toggle-like interactions; flag if used with momentary actions: warn
 * - disabled + focusableWhenDisabled trade-off: warn if both true for extended periods in UI: info
 */
```

**Why:** Validation catches mistakes before code review. Each rule includes severity level.

---

## Complete Example

Here's the HvButton contract, used as the template:

```typescript
/**
 * Button component is used to trigger an action or event.
 *
 * @variantSemantics
 * - `contained`: primary action, filled/contained style
 * - `subtle`: secondary action, low visual weight
 * - `ghost`: tertiary, minimal emphasis
 * - `{color}Contained`: emphasis for semantic colors (positive, negative, warning, primary, secondary)
 * - `{color}Subtle`: secondary emphasis for semantic colors
 * - `{color}Ghost`: tertiary for semantic colors
 * - `semantic`: inherits color from context via CSS variable, use only for custom color contexts
 *
 * @stateRules
 * - "disabled": when true, click handlers do not fire, aria-disabled=true, button is not focusable unless focusableWhenDisabled=true
 * - "selected": implies aria-pressed=true, should only be used for true toggle actions (not momentary/transient actions)
 * - "focusableWhenDisabled": when true, disabled button remains in tab order and can be focused (improves a11y for screen readers)
 *
 * @tokenConstraints
 * - color: use semantic tokens only (primary, secondary, positive, negative, warning, or inherit for semantic)
 * - size: use size tokens (xs, sm, md, lg, xl), never raw px values
 * - radius: use radius tokens (none, sm, md, lg), never raw px values
 *
 * @antiPatterns
 * - Do not invent custom variant names; only use defined variants — Use one of: contained, subtle, ghost, {color}Contained, {color}Subtle, {color}Ghost, semantic
 * - Do not use "selected" for momentary/transient button states; it implies aria-pressed toggle semantics — Use selected only for true toggle buttons (e.g., view mode toggles)
 * - Do not use raw color hex/rgb values; use color tokens instead — Replace #FF0000 with variant="negative" or color token
 * - Do not apply custom CSS directly; use the classes prop and theme tokens — Use className or classes prop with design tokens
 * - Do not mix semantic color variants with explicit color prop; choose one approach — Choose either variant="negative" OR color="..." but not both
 *
 * @a11y
 * - role: button (or implicit if component="button")
 * - name: must have accessible name via children or aria-label
 * - disabled state: uses aria-disabled=true; when disabled without focusableWhenDisabled, not in tab order
 * - selected state: uses aria-pressed when selected prop is set, for toggle buttons
 * - required: focusableWhenDisabled should be true when a disabled button needs to be discoverable by assistive tech
 *
 * @validationRules
 * - variant must be one of the defined HvButtonVariant values (no custom variants): error
 * - color must not be a raw hex/rgb value; use tokens instead: error
 * - selected should only be used with toggle-like interactions; flag if used with momentary actions: warn
 * - disabled + focusableWhenDisabled trade-off: warn if both true for extended periods in UI: info
 */
export const HvButton = fixedForwardRef(function HvButton<...>(props, ref) {
  // implementation
});
```

---

## Key Rules

1. **Be specific.** "Use theme.colors.primary" is better than "use colors."
2. **Include corrective guidance in anti-patterns.** Bad: "Don't use custom variants." Good: "Don't use custom variants — use one of: contained, subtle, ghost, ..."
3. **Link to accessibility.** Every state or prop with a11y implications must mention it.
4. **Validate the important stuff.** Mark contract violations as `error`, style suggestions as `warn`, informational as `info`.
5. **Use em-dashes for corrections.** Format: `Problem; reason — solution` enables proper extraction.

---

## Usage

Contract tags are extracted when core builds:

```bash
npm run build -w packages/core
# Runs: node scripts/extract-contracts.js
# Output: packages/core/dist/component-metadata.json
```

Consumers then use init to generate AGENTS.md:

```bash
npm install @pentaho/uikit-react-core @pentaho/uikit-tools
npx @pentaho/uikit-tools init .
# Output: AGENTS.md (with patterns, anti-patterns, token rules, validation commands)
```

---

## Questions?

- For component implementation: See [component.instructions.md](component.instructions.md)
- For testing: See [test.instructions.md](test.instructions.md)
- For stories: See [stories.instructions.md](stories.instructions.md)
