import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import chalk from "chalk";

import { loadMetadata } from "../utils/metadata.js";

type Harness = "claude" | "copilot";

interface InitOptions {
  harness: Harness;
}

/**
 * Generate lean agent guide and auto-discoverable instructions.
 * Phase 5.1b: Non-destructive initialization for agents.
 *
 * Creates (harness-dependent):
 * - .claude/rules/hv-uikit.md or .github/rules/hv-uikit.md (lean guide, ~20 KB)
 * - .claude/instructions.md or .github/copilot-instructions.md (auto-discovered)
 * - .vscode/mcp.json (Copilot only)
 */
export async function init(
  targetDir?: string,
  options?: InitOptions,
): Promise<void> {
  const dir = targetDir ?? ".";
  const harness = options?.harness ?? "copilot";

  if (!["claude", "copilot"].includes(harness)) {
    // eslint-disable-next-line no-console
    console.error(
      chalk.red(`✗ Invalid harness: ${harness}. Use 'claude' or 'copilot'.`),
    );
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  try {
    const metadata = loadMetadata();

    // Determine folder structure based on harness
    const agentDir = harness === "claude" ? ".claude" : ".github";
    const instructionsFileName =
      harness === "claude" ? "instructions.md" : "copilot-instructions.md";

    // Create rules directory
    const rulesDir = path.join(dir, agentDir, "rules");
    mkdirSync(rulesDir, { recursive: true });

    // Generate and write lean guide
    const agentsPath = path.join(rulesDir, "hv-uikit.md");
    const agentsContent = generateLeanAgentsMd(metadata);
    writeFileSync(agentsPath, agentsContent, "utf-8");

    // Create or update instructions (auto-discovered)
    const agentConfigDir = path.join(dir, agentDir);
    mkdirSync(agentConfigDir, { recursive: true });
    const instructionsPath = path.join(agentConfigDir, instructionsFileName);
    createInstructions(instructionsPath, harness);

    // Register MCP server for Copilot only
    let mcpConfigPath: string | undefined;
    if (harness === "copilot") {
      const vscodeDir = path.join(dir, ".vscode");
      mkdirSync(vscodeDir, { recursive: true });
      mcpConfigPath = path.join(vscodeDir, "mcp.json");
      updateMcpConfig(mcpConfigPath);
    }

    // eslint-disable-next-line no-console
    console.log(chalk.green(`✓ Generated HV UI Kit agent guide`));
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Harness: ${harness}`));
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Rules: ${agentsPath}`));
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Instructions: ${instructionsPath}`));
    if (mcpConfigPath) {
      // eslint-disable-next-line no-console
      console.log(chalk.gray(`  MCP: ${mcpConfigPath}`));
    }
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Version: ${metadata.version}`));
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Components: ${metadata.components.length}`));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(`✗ Failed to initialize agent guide: ${error}`));
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}

/**
 * Add the HV UI Kit MCP server to a VS Code MCP configuration.
 * Existing servers are preserved; invalid JSON must be fixed manually.
 */
function updateMcpConfig(mcpConfigPath: string): void {
  let config: { servers?: Record<string, unknown> } = {};

  if (existsSync(mcpConfigPath)) {
    try {
      config = JSON.parse(readFileSync(mcpConfigPath, "utf-8"));
    } catch (error) {
      throw new Error(
        `Cannot update ${mcpConfigPath}: the existing file is not valid JSON.`,
        { cause: error },
      );
    }
  }

  config.servers = {
    ...config.servers,
    "hv-uikit": {
      type: "stdio",
      command: "npx",
      args: ["--no-install", "uikit-tools", "mcp"],
    },
  };

  writeFileSync(mcpConfigPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
}

/**
 * Create instructions file for auto-discovery by agents (harness-dependent).
 * This file is automatically loaded when opening a workspace.
 * Idempotent: overwrites existing file.
 */
function createInstructions(instructionsPath: string, harness: Harness): void {
  const rulesPath =
    harness === "claude"
      ? ".claude/rules/hv-uikit.md"
      : ".github/rules/hv-uikit.md";

  const content = `---
name: "HV UI Kit Component Guide"
description: "Rules and workflows for building with HV UI Kit components"
---

# HV UI Kit Instructions

**CRITICAL:** This project uses HV UI Kit components exclusively. You MUST use the MCP server to discover available components before implementing any UI elements. Never use plain HTML elements (e.g., \`<input>\`, \`<button>\`, \`<select>\`) when HV UI Kit alternatives exist.

Load the full component reference:

<file:${rulesPath}>

## Mandatory Workflow

### Step 1: Discover Available Components
**Before coding anything, call the \`list_components\` MCP tool** to see all available HV UI Kit components and their purposes.

### Step 2: Query Component Contracts
For each component you plan to use, **call the \`get_component_contract\` MCP tool** with the component name (e.g., \`{ component: "HvInput" }\`) to get:
- Required props (many components have mandatory props like \`label\` or \`aria-label\`)
- Variant definitions and their semantic meanings
- Prop constraints and boolean flags
- Accessibility requirements
- Anti-patterns to avoid

### Step 3: Implement Using the Contract
Follow the contract exactly. Many components have:
- Required boolean flags (e.g., \`showCount\` for HvBadge)
- Specific variant meanings (not just styling—they change component behavior)
- Mandatory accessibility properties
- Controlled/uncontrolled patterns

### Step 4: Validate and Verify (MANDATORY BEFORE COMPLETION)

⚠️ **THIS STEP IS REQUIRED. DO NOT SKIP OR CLAIM THE TASK IS COMPLETE WITHOUT RUNNING VALIDATION.**

Run validation:
\`\`\`bash
npx uikit-tools validate src/**/*.tsx
\`\`\`

**Validation must complete with ZERO errors.** If validation fails:
1. Read the error messages carefully
2. Identify which components are violating the contract
3. Call \`get_component_contract\` again for the problematic component
4. Fix the implementation
5. Run validation again
6. **Repeat until validation passes**

**The task is NOT COMPLETE until validation passes.** Compilation success or code review approval does NOT count as task completion if validation has not been run and passed.

## Definition of Done

✅ Task is complete ONLY when ALL of the following are true:
- [ ] All components discovered via \`list_components\` MCP tool
- [ ] Each component's contract reviewed via \`get_component_contract\`
- [ ] Code implements components according to their contracts
- [ ] \`npx uikit-tools validate src/**/*.tsx\` runs with ZERO errors
- [ ] No plain HTML elements used (no \`<input>\`, \`<button>\`, \`<select>\`, etc.)

❌ Task is NOT complete if:
- Validation has not been run
- Validation passed only after ignoring errors
- Only \`npm run build\` was run (build success ≠ contract compliance)
- Components were used without querying their contracts first

## NO PLAIN HTML ELEMENTS

❌ **NEVER do this:**
- \`<input placeholder="..." />\` → use \`<HvInput label="..." />\`
- \`<button>Click</button>\` → use \`<HvButton>Click</HvButton>\`
- \`<select><option>...</option></select>\` → use \`<HvDropdown />\`
- \`<label>Checkbox</label><input type="checkbox" />\` → use \`<HvCheckBox label="..." />\`

✅ **ALWAYS:**
1. Call \`list_components\` to see what's available
2. Call \`get_component_contract\` for each component before using it
3. Use HV UI Kit components for ALL UI elements
4. Run \`npx uikit-tools validate src/**/*.tsx\` and verify ZERO errors

## Why Validation is Mandatory

The validator catches:
- ✓ Components used without required props
- ✓ Props set to invalid values per the contract
- ✓ Variants used incorrectly
- ✓ Accessibility violations
- ✓ Anti-patterns that will break at runtime

Skipping validation means these issues won't be caught until users encounter broken functionality.

## Common Gotchas

- **HvInput**: Requires \`label\` or \`aria-label\`; never use bare \`<input>\`
- **HvBadge**: Requires \`showCount={true}\` to display numbers
- **HvButton**: Variants like \`"contained"\`, \`"ghost"\` have semantic meanings—not just styling
- **HvCheckBox**: Requires \`label\`; use controlled pattern
- **HvAvatar**: Requires \`alt\` text for accessibility
- **HvDropdown**: Not a wrapper—it has specific API; check contract

## Reference

For detailed rules, token constraints, validation, and examples, see:

<file:${rulesPath}>
`;

  writeFileSync(instructionsPath, content, "utf-8");
}

/**
 * Generate lean AGENTS.md content from component metadata.
 * Focus: Inventory + Universal Rules + MCP delegation
 * CRITICAL: Emphasizes that MCP queries are mandatory before implementation
 */
function generateLeanAgentsMd(metadata: any): string {
  const { version, generatedAt, components } = metadata;

  // Group components by category based on naming patterns
  const categorized = categorizeComponents(components);
  const componentSections = Object.entries(categorized)
    .map(([category, comps]: [string, any[]]) => {
      const items = (comps as any[])
        .map((c) => `- **${c.displayName}** — ${c.purpose}`)
        .join("\n");
      return `### ${category}\n${items}`;
    })
    .join("\n\n");

  return `# HV UI Kit Agent Guide

> Auto-generated for @pentaho/uikit-react-core@${version}
> Generated: ${generatedAt}
> 
> **Do not edit this file.** Regenerated on \`npm install\` and version upgrades.

## Overview

This guide covers the HV UI Kit component library. Use this as your reference for:
- What components exist and their purpose
- Universal styling and accessibility rules
- When to query the MCP server for full contracts

**⚠️ CRITICAL: ALWAYS query the MCP server BEFORE implementing any component.** Many components have required boolean flags, specific prop constraints, or anti-patterns that aren't obvious from the component name.

## Component Inventory

${componentSections}

## Universal Rules

### Tokens (Always Required)
- **Colors**: Use semantic tokens only
  - \`primary\`, \`secondary\`, \`positive\`, \`negative\`, \`warning\`
  - Never raw hex, rgb, or named colors
- **Spacing**: Use token values
  - \`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`
  - Never raw pixel values or custom margins/padding
- **Typography**: Use HvTypography with semantic variants
  - \`display\`, \`headings\`, \`body\`, \`caption\`, \`label\`
  - Never inline font-size or font-weight

### Accessibility (Always Required)
- **Forms**: Every input must have a label or \`aria-label\`
  \`\`\`tsx
  <HvInput label="Name" />  // or
  <HvInput aria-label="Search" placeholder="Type..." />
  \`\`\`
- **Images/Avatars**: Always include \`alt\` or \`aria-label\`
  \`\`\`tsx
  <HvAvatar src="user.jpg" alt="John Doe" />
  \`\`\`

## Critical Anti-Patterns (Avoid These)

1. **Raw values instead of tokens**
   - ❌ \`<HvButton style={{ color: "#FF0000", padding: "16px" }} />\`
   - ✅ \`<HvButton variant="negative" />\` (uses semantic tokens)

2. **Missing accessible names on interactive elements**
   - ❌ \`<HvInput />\` (no label or aria-label)
   - ✅ \`<HvInput label="Email" required />\`

3. **Using disabled without explaining why**
   - ❌ \`<HvButton disabled>Save</HvButton>\`
   - ✅ \`<HvButton disabled>Save</HvButton>\` + helper text explaining why disabled

## Getting Full Component Contracts

This guide covers universal rules only. For detailed information about a specific component, **ALWAYS call the registered MCP tool before implementing**:

\`\`\`text
get_component_contract({ component: "HvButton" })
\`\`\`

The init command registers the server in \`.vscode/mcp.json\`. Use the MCP tools exposed by your agent; \`uikit-tools mcp\` starts the stdio server and does not accept tool calls as terminal arguments.

**Returns:**
- All available variants and their semantic meaning
- State rules (when to use \`checked\`, \`disabled\`, \`selected\`, etc.)
- Token constraints (allowed color/size values)
- Anti-patterns specific to this component
- Accessibility requirements (ARIA attributes)
- Validation rules (what inputs are valid)

**CRITICAL: Query MCP Server for:**
- Required vs optional props
- Boolean flags that enable features (like \`showCount\` for HvBadge)
- Valid prop values and enums
- Component state rules
- Accessibility requirements
- Anti-patterns specific to the component

## Listing All Components

To see the full inventory programmatically, call:

\`\`\`text
list_components({ limit: 10, offset: 0 })
\`\`\`

## Common Component Gotchas (Query MCP First!)

These props are often required or enable critical features:

- **HvBadge** — Requires \`showCount={true}\` to display numeric values
- **HvInput** — Must include \`label\` or \`aria-label\` for accessibility
- **HvButton** — Variants like \`"contained"\`, \`"ghost"\`, \`"primaryGhost"\` have specific semantic meanings
- **HvCheckBox** — Needs \`label\` or \`aria-label\`; use controlled component pattern
- **HvAvatar** — Requires \`alt\` text for accessibility

**ALWAYS query the component contract before implementing** to catch these requirements.

## Validation

Before committing code, validate against the component contracts:

\`\`\`bash
npx uikit-tools validate src/**/*.tsx
\`\`\`

Checks:
- Invalid component variant values
- Raw color/spacing values instead of tokens
- Known anti-pattern usage
- Missing required props (esp. accessibility)

## Workflow

1. **Understand the task** — What are you building?
2. **Check this guide** — What components exist? What are universal rules?
3. **QUERY MCP SERVER FOR EACH COMPONENT** — Call \`get_component_contract\` before writing code
  \`\`\`text
  get_component_contract({ component: "HvInput" })
  \`\`\`
   This is **CRITICAL** to find:
   - Required props
   - Boolean feature flags (e.g., \`showCount\` for HvBadge)
   - Valid prop values
   - Component-specific anti-patterns
4. **Generate or write code** — Follow the contract and universal rules
5. **Validate before committing**
   \`\`\`bash
   npx uikit-tools validate src/**/*.tsx
   \`\`\`
6. **Fix violations** — Review errors and correct (usually tokens or a11y)

## Example: Building a Form

\`\`\`tsx
import { HvInput, HvCheckBox, HvButton } from "@pentaho/uikit-react-core";

export function LoginForm() {
  return (
    <form>
      {/* Input with label (a11y requirement) */}
      <HvInput 
        label="Email" 
        type="email" 
        required
      />
      
      {/* Checkbox with label (a11y requirement) */}
      <HvCheckBox 
        label="Remember me" 
      />
      
      {/* Primary button for form submission */}
      <HvButton variant="contained" type="submit">
        Sign In
      </HvButton>
    </form>
  );
}
\`\`\`

Run validation:
\`\`\`bash
npx uikit-tools validate LoginForm.tsx
# ✓ All validations passed
\`\`\`

## Questions?

- **Need variants or props for a component?** → **QUERY MCP FIRST**
  \`\`\`text
  get_component_contract({ component: "HvComponentName" })
  \`\`\`
- **Component display is wrong or empty?** → Check MCP for required boolean flags (showCount, etc.)
- **Want examples?** → See component Storybook stories
- **Validation failing?** → Check the error message, query MCP for full rules
- **Token values?** → Check design tokens documentation
`;
}

/**
 * Categorize components by functional group.
 */
function categorizeComponents(components: any[]): Record<string, any[]> {
  const categories: Record<string, any[]> = {
    "Input Components": [],
    "Selection Components": [],
    "Display Components": [],
    "Container Components": [],
    "Feedback Components": [],
    "Other Components": [],
  };

  components.forEach((c: any) => {
    const name = c.name;

    // Categorize based on naming patterns and purpose
    if (
      name.includes("Input") ||
      name.includes("Select") ||
      name.includes("DatePicker") ||
      name.includes("TimePicker") ||
      name.includes("ColorPicker") ||
      name.includes("TextArea") ||
      name.includes("TagsInput") ||
      name.includes("SearchInput")
    ) {
      categories["Input Components"].push(c);
    } else if (
      name.includes("CheckBox") ||
      name.includes("Radio") ||
      name.includes("Switch") ||
      name.includes("Toggle")
    ) {
      categories["Selection Components"].push(c);
    } else if (
      name.includes("Button") ||
      name.includes("Badge") ||
      name.includes("Avatar") ||
      name.includes("Tag") ||
      name.includes("Typography") ||
      name.includes("Icon") ||
      name.includes("Status")
    ) {
      categories["Display Components"].push(c);
    } else if (
      name.includes("Card") ||
      name.includes("Dialog") ||
      name.includes("Drawer") ||
      name.includes("Table") ||
      name.includes("List") ||
      name.includes("Accordion") ||
      name.includes("Panel") ||
      name.includes("TreeView") ||
      name.includes("Grid") ||
      name.includes("Section")
    ) {
      categories["Container Components"].push(c);
    } else if (
      name.includes("Snackbar") ||
      name.includes("Banner") ||
      name.includes("Tooltip") ||
      name.includes("Loading") ||
      name.includes("Progress") ||
      name.includes("EmptyState")
    ) {
      categories["Feedback Components"].push(c);
    } else {
      categories["Other Components"].push(c);
    }
  });

  // Filter out empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([, comps]) => comps.length > 0),
  );
}
