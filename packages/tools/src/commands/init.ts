import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";

import { loadMetadata, type ComponentMetadata } from "../utils/metadata.js";

type Harness = "claude" | "copilot";

interface InitOptions {
  harness: Harness;
}

/**
 * Static templates (guide, instructions, rule files) live in packages/tools/templates.
 * Resolved relative to this module so it works from both src/ and dist/.
 */
const templatesDir = fileURLToPath(
  new URL("../../templates/", import.meta.url),
);

/**
 * Generate lean agent guide and auto-discoverable instructions.
 * Phase 5.1b: Non-destructive initialization for agents.
 *
 * Creates (harness-dependent):
 * - .claude/rules/hv-uikit.md or .github/rules/hv-uikit.md (guide built from the rule templates)
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

    // A repo-level AGENTS.md is a compatibility fallback for generic agent hosts.
    // If the consumer app already has one, leave it intact.
    const rootAgentsPath = ensureRootAgentsFile(dir, harness);

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
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Root AGENTS: ${rootAgentsPath}`));
    if (mcpConfigPath) {
      // eslint-disable-next-line no-console
      console.log(chalk.gray(`  MCP: ${mcpConfigPath}`));
    }
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Version: ${metadata.version}`));
    // eslint-disable-next-line no-console
    console.log(chalk.gray(`  Components: ${metadata.components.length}`));
    const summary = summarizeMetadata(metadata);
    // eslint-disable-next-line no-console
    console.log(
      chalk.gray(`  No purpose found for: ${formatList(summary.noPurpose)}`),
    );
    // eslint-disable-next-line no-console
    console.log(
      chalk.gray(`  Full metadata extracted for: ${formatList(summary.full)}`),
    );
    // eslint-disable-next-line no-console
    console.log(
      chalk.gray(
        `  Simple metadata extracted for: ${formatList(summary.simple)}`,
      ),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(`✗ Failed to initialize agent guide: ${error}`));
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}

/**
 * Group components by the depth of their contract metadata.
 * Full: at least one structured section (variants, states, tokens, anti-patterns, a11y, or validation rules).
 * Simple: purpose only.
 */
function summarizeMetadata(metadata: ComponentMetadata): {
  noPurpose: string[];
  full: string[];
  simple: string[];
} {
  const structuredKeys = [
    "variantSemantics",
    "stateRules",
    "tokenConstraints",
    "antiPatterns",
    "a11y",
    "validationRules",
  ] as const;

  const full: string[] = [];
  const simple: string[] = [];
  for (const component of metadata.components) {
    const hasStructured = structuredKeys.some((key) => {
      const value = component[key];
      return Array.isArray(value) ? value.length > 0 : value !== undefined;
    });
    (hasStructured ? full : simple).push(component.name);
  }

  return { noPurpose: metadata.missingPurpose ?? [], full, simple };
}

function formatList(names: string[]): string {
  return names.length > 0 ? names.join(", ") : "none";
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

  const content = renderTemplate("instructions/instructions.md", {
    RULES_PATH: rulesPath,
  });

  writeFileSync(instructionsPath, content, "utf-8");
}

/**
 * Create a root AGENTS.md compatibility file for generic agent hosts.
 * If the consumer project already has an AGENTS.md, keep it unchanged.
 */
function ensureRootAgentsFile(targetDir: string, harness: Harness): string {
  const rootAgentsPath = path.join(targetDir, "AGENTS.md");

  if (existsSync(rootAgentsPath)) {
    const content = readFileSync(rootAgentsPath, "utf-8").trim();
    if (content.length > 0) {
      return rootAgentsPath;
    }
  }

  const instructionsPath =
    harness === "claude"
      ? ".claude/instructions.md"
      : ".github/copilot-instructions.md";
  const rulesPath =
    harness === "claude"
      ? ".claude/rules/hv-uikit.md"
      : ".github/rules/hv-uikit.md";

  const content = [
    "# AGENTS.md",
    "",
    "This project uses the HV UI Kit agent guidance.",
    "",
    `- Harness: ${harness}`,
    `- Instructions: ${instructionsPath}`,
    `- Rules: ${rulesPath}`,
    "",
    "If your AI tool supports a repo-level AGENTS.md, this file is the compatibility entry point.",
    "The harness-specific files contain the full setup and MCP configuration for the selected agent.",
    "",
  ].join("\n");

  writeFileSync(rootAgentsPath, content, "utf-8");
  return rootAgentsPath;
}

/**
 * Render a template file from packages/tools/templates, replacing `{{NAME}}` placeholders.
 */
function renderTemplate(
  relativePath: string,
  vars: Record<string, string> = {},
): string {
  const template = readFileSync(path.join(templatesDir, relativePath), "utf-8");
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (match, name: string) =>
    name in vars ? vars[name] : match,
  );
}

/**
 * Generic rule templates merged into the guide, in this order.
 */
const RULE_FILES = [
  "tokens.md",
  "accessibility.md",
  "forms.md",
  "layout.md",
  "actions.md",
  "anti-patterns.md",
  "workflow.md",
];

/**
 * Read every rule template and join them into one block for the guide.
 */
function loadRuleSections(): string {
  return RULE_FILES.map((file) => {
    const content = readFileSync(
      path.join(templatesDir, "rules", file),
      "utf-8",
    );
    return nestHeadings(content.trim());
  }).join("\n\n");
}

/**
 * Nest Markdown headings two levels deeper so rule titles sit under the guide's "## Rules" heading.
 * Lines inside fenced code blocks are left unchanged.
 */
function nestHeadings(markdown: string): string {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      return !inFence && /^#{1,4} /.test(line) ? `##${line}` : line;
    })
    .join("\n");
}

/**
 * Generate lean AGENTS.md content from component metadata.
 * Focus: Inventory + inlined rule files + MCP delegation
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

  return renderTemplate("guide/hv-uikit.md", {
    VERSION: version,
    GENERATED_AT: generatedAt,
    COMPONENT_SECTIONS: componentSections,
    RULES: loadRuleSections(),
  });
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
