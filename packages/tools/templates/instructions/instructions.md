---
name: "HV UI Kit Component Guide"
description: "Rules and workflows for building with HV UI Kit components"
---

# HV UI Kit Instructions

**CRITICAL:** This project uses HV UI Kit components exclusively. You MUST use the MCP server to discover available components before implementing any UI elements. Never use plain HTML elements (e.g., `<input>`, `<button>`, `<select>`) when HV UI Kit alternatives exist.

Load the full component reference:

<file:{{RULES_PATH}}>

## Mandatory Workflow

### Step 1: Discover Available Components

**Before coding anything, call the `components` MCP tool** to see all available HV UI Kit components and their purposes.

### Step 2: Query Component Contracts

For each component you plan to use, **call the `info` MCP tool** with the component name (e.g., `{ component: "HvInput" }`) to get:

- Required props (many components have mandatory props like `label` or `aria-label`)
- Variant definitions and their semantic meanings
- Prop constraints and boolean flags
- Accessibility requirements
- Anti-patterns to avoid

### Step 3: Implement Using the Contract

Follow the contract exactly. Many components have:

- Required boolean flags (e.g., `showCount` for HvBadge)
- Specific variant meanings (not just styling—they change component behavior)
- Mandatory accessibility properties
- Controlled/uncontrolled patterns

### Step 4: Validate and Verify (MANDATORY BEFORE COMPLETION)

⚠️ **THIS STEP IS REQUIRED. DO NOT SKIP OR CLAIM THE TASK IS COMPLETE WITHOUT RUNNING VALIDATION.**

Run validation:

```bash
npx uikit-tools validate src/**/*.tsx
```

**Validation must complete with ZERO errors.** If validation fails:

1. Read the error messages carefully
2. Identify which components are violating the contract
3. Call `info` again for the problematic component
4. Fix the implementation
5. Run validation again
6. **Repeat until validation passes**

**The task is NOT COMPLETE until validation passes.** Compilation success or code review approval does NOT count as task completion if validation has not been run and passed.

## Definition of Done

✅ Task is complete ONLY when ALL of the following are true:

- [ ] All components discovered via `components` MCP tool
- [ ] Each component's contract reviewed via `info`
- [ ] Code implements components according to their contracts
- [ ] `npx uikit-tools validate src/**/*.tsx` runs with ZERO errors
- [ ] No plain HTML elements used (no `<input>`, `<button>`, `<select>`, etc.)

❌ Task is NOT complete if:

- Validation has not been run
- Validation passed only after ignoring errors
- Only `npm run build` was run (build success ≠ contract compliance)
- Components were used without querying their contracts first

## NO PLAIN HTML ELEMENTS

❌ **NEVER do this:**

- `<input placeholder="..." />` → use `<HvInput label="..." />`
- `<button>Click</button>` → use `<HvButton>Click</HvButton>`
- `<select><option>...</option></select>` → use `<HvDropdown />`
- `<label>Checkbox</label><input type="checkbox" />` → use `<HvCheckBox label="..." />`

✅ **ALWAYS:**

1. Call `components` to see what's available
2. Call `info` for each component before using it
3. Use HV UI Kit components for ALL UI elements
4. Run `npx uikit-tools validate src/**/*.tsx` and verify ZERO errors

## Why Validation is Mandatory

The validator catches:

- ✓ Components used without required props
- ✓ Props set to invalid values per the contract
- ✓ Variants used incorrectly
- ✓ Accessibility violations
- ✓ Anti-patterns that will break at runtime

Skipping validation means these issues won't be caught until users encounter broken functionality.

## Common Gotchas

- **HvInput**: Requires `label` or `aria-label`; never use bare `<input>`
- **HvBadge**: Requires `showCount={true}` to display numbers
- **HvButton**: Use `"primary"` for the main action; `"ghost"` and `"subtle"` have semantic meanings—not just styling
- **HvCheckBox**: Requires `label`; use controlled pattern
- **HvAvatar**: Requires `alt` text for accessibility
- **HvDropdown**: Not a wrapper—it has specific API; check contract

## Reference

For detailed rules, token constraints, validation, and examples, see:

<file:{{RULES_PATH}}>
