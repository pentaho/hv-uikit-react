import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

interface ComponentContract {
  name: string;
  displayName: string;
  purpose: string;
  variantSemantics?: Array<{
    name: string;
    semanticMeaning?: string;
    description: string;
  }>;
  stateRules?: Array<{ name: string; description: string; rules?: unknown[] }>;
  tokenConstraints?: Array<{
    category: string;
    notes: string;
    allowedValues?: string[];
  }>;
  antiPatterns?: Array<{ description: string }>;
  a11y?: Array<{ description: string }>;
  validationRules?: Array<{ name: string; description: string }>;
  tags?: Record<string, string>;
}

interface ComponentMetadata {
  version: string;
  generatedAt: string;
  components: ComponentContract[];
}

let cachedMetadata: ComponentMetadata | null = null;

async function loadMetadata(): Promise<ComponentMetadata> {
  if (cachedMetadata) {
    return cachedMetadata;
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const metadataPath = path.resolve(
    __dirname,
    "../../../core/dist/component-metadata.json",
  );

  const content = fs.readFileSync(metadataPath, "utf8");
  cachedMetadata = JSON.parse(content);
  return cachedMetadata!;
}

function getComponentContract(
  componentName: string,
  metadata: ComponentMetadata,
): ComponentContract | null {
  return metadata.components.find((c) => c.name === componentName) || null;
}

function listComponents(
  metadata: ComponentMetadata,
  limit: number,
  offset: number,
) {
  const components = metadata.components.slice(offset, offset + limit);
  return {
    tool: "list_components",
    components: components.map((c) => ({
      name: c.name,
      displayName: c.displayName,
      purpose: c.purpose,
    })),
    total: metadata.components.length,
    offset,
    limit,
  };
}

function getComponent(metadata: ComponentMetadata, componentName: string) {
  const contract = getComponentContract(componentName, metadata);
  return {
    tool: "get_component_contract",
    componentName,
    contract: contract || { error: `Component ${componentName} not found` },
  };
}

/**
 * Start the MCP server on stdio.
 * Phase 5.1: MCP Server Skeleton - list_components & get_component_contract tools
 *
 * Usage:
 *   node cli.js mcp list_components [--limit 10] [--offset 0]
 *   node cli.js mcp get_component_contract --component HvButton
 */
export async function mcp(
  toolName?: string,
  options?: Record<string, unknown>,
): Promise<void> {
  const metadata = await loadMetadata();

  // eslint-disable-next-line no-console
  console.error(`[hv-uikit-mcp] Server started (v${metadata.version})`);
  // eslint-disable-next-line no-console
  console.error(
    `[hv-uikit-mcp] Loaded ${metadata.components.length} components`,
  );

  if (!toolName) {
    // Default: show both tools for demo
    const listResult = listComponents(metadata, 10, 0);
    const getResult = getComponent(metadata, "HvButton");

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(listResult, null, 2));
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(getResult, null, 2));
    return;
  }

  if (toolName === "list_components") {
    const limit = (options?.limit as number) || 10;
    const offset = (options?.offset as number) || 0;
    const result = listComponents(metadata, limit, offset);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (toolName === "get_component_contract") {
    const componentName = options?.component as string;
    if (!componentName) {
      // eslint-disable-next-line no-console
      console.error("Error: --component <name> is required");
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
    const result = getComponent(metadata, componentName);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // eslint-disable-next-line no-console
  console.error(`Unknown tool: ${toolName}`);
  // eslint-disable-next-line no-console
  console.error("Available tools: list_components, get_component_contract");
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
