import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";

import { loadMetadata } from "../utils/metadata.js";

/**
 * Generate lean AGENTS.md and auto-discoverable instructions.
 * Phase 5.1b: Non-destructive initialization for agents.
 *
 * Creates:
 * - .github/rules/hv-uikit.md (lean guide, ~20 KB)
 * - .github/copilot-instructions.md (auto-discovered by agent on workspace load)
 * - .vscode/mcp.json (HV UI Kit MCP server registration)
 */
export async function init(targetDir?: string): Promise<void> {
  const dir = targetDir ?? ".";
  try {
    const metadata = loadMetadata();

    // Create .github/rules directory
    const rulesDir = join(dir, ".github", "rules");
    mkdirSync(rulesDir, { recursive: true });

    // Generate and write lean AGENTS.md
    const agentsPath = join(rulesDir, "hv-uikit.md");
    const agentsContent = generateLeanAgentsMd(metadata);
    writeFileSync(agentsPath, agentsContent, "utf-8");

    // Create or update .github/copilot-instructions.md (auto-discovered)
    const githubDir = join(dir, ".github");
    mkdirSync(githubDir, { recursive: true });
    const instructionsPath = join(githubDir, "copilot-instructions.md");
    createInstructions(instructionsPath);

    // Register the stdio server so Copilot can invoke MCP tools directly.
    const vscodeDir = join(dir, ".vscode");
    mkdirSync(vscodeDir, { recursive: true });
    const mcpConfigPath = join(vscodeDir, "mcp.json");
    updateMcpConfig(mcpConfigPath);

    // eslint-disable-next-line no-console
    console.log(chalk.green(`✓ Generated HV UI Kit agent guide`));
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Rules: ${agentsPath}`));
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Instructions: ${instructionsPath}`));
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  MCP: ${mcpConfigPath}`));
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
 * Create .github/copilot-instructions.md for auto-discovery by agents.
 * This file is automatically loaded when opening a workspace in VS Code.
 * Idempotent: overwrites existing file.
 */
function createInstructions(instructionsPath: string): void {
  const content = `---
name: "HV UI Kit Component Guide"
description: "Rules and workflows for building with HV UI Kit components"
---

# HV UI Kit Instructions

**CRITICAL:** Always read the component guide before implementing any component. Many components have required props, feature flags, or anti-patterns that aren't obvious.

Load the full guide:

<file:.github/rules/hv-uikit.md>

## Quick Start Workflow

1. **Identify components** — Check the inventory in the guide
2. **Query MCP for each component** — Call \`get_component_contract\` with
  \`{ component: "HvButton" }\` BEFORE coding
3. **Follow the contract** — Variants, props, state rules, accessibility
4. **Validate code** — Before committing
   \`\`\`bash
   npx uikit-tools validate src/**/*.tsx
   \`\`\`

## Critical: MCP is Mandatory

Do NOT implement without querying the registered MCP server first. Components have:
- Required boolean flags (e.g., \`showCount\` for HvBadge)
- Specific variant meanings
- Anti-patterns to avoid
- Accessibility requirements

## Common Gotchas

- **HvBadge**: Need \`showCount={true}\` to display numbers
- **HvInput**: Must have \`label\` or \`aria-label\`
- **HvButton**: Variants like \`"contained"\`, \`"ghost"\` have specific semantic meanings
- **HvCheckBox**: Needs \`label\`; use controlled pattern
- **HvAvatar**: Requires \`alt\` text

**Always call the \`get_component_contract\` MCP tool before implementing.**

## Reference

For detailed rules, token constraints, validation, and examples, see:

<file:.github/rules/hv-uikit.md>
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
