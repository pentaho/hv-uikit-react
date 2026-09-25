import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";

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

/**
 * Start the MCP server on stdio.
 * Phase 5.1: Proper MCP Protocol Implementation
 *
 * The server exposes two tools:
 * - list_components: Paginated list of components
 * - get_component_contract: Retrieve full component contract
 *
 * Clients connect via MCP protocol (stdio transport) and invoke tools.
 */
export async function mcp(): Promise<void> {
  const metadata = await loadMetadata();

  const server = new Server(
    {
      name: "hv-uikit-mcp",
      version: metadata.version,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Define tools
  const tools: Tool[] = [
    {
      name: "list_components",
      description:
        "Get a paginated list of all UI components in the design system",
      inputSchema: {
        type: "object" as const,
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of components to return (default: 10)",
            default: 10,
          },
          offset: {
            type: "number",
            description:
              "Number of components to skip for pagination (default: 0)",
            default: 0,
          },
        },
      },
    },
    {
      name: "get_component_contract",
      description:
        "Get the full semantic contract of a specific component (variants, state rules, token constraints, antipatterns, a11y, validation rules)",
      inputSchema: {
        type: "object" as const,
        properties: {
          componentName: {
            type: "string",
            description:
              "Name of the component (e.g., HvButton, HvAvatar, HvBadge)",
          },
        },
        required: ["componentName"],
      },
    },
  ];

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request: unknown) => {
    const callRequest = request as {
      params: { name: string; arguments?: Record<string, unknown> };
    };
    const { name, arguments: args } = callRequest.params;

    if (name === "list_components") {
      const limit = (args?.limit as number) || 10;
      const offset = (args?.offset as number) || 0;

      if (offset < 0 || limit < 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: limit and offset must be non-negative",
            },
          ],
          isError: true,
        };
      }

      const components = metadata.components.slice(offset, offset + limit);
      const response = {
        components: components.map((c) => ({
          name: c.name,
          displayName: c.displayName,
          purpose: c.purpose,
        })),
        total: metadata.components.length,
        offset,
        limit,
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }

    if (name === "get_component_contract") {
      const componentName = args?.componentName as string;

      if (!componentName) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: componentName is required",
            },
          ],
          isError: true,
        };
      }

      const contract = getComponentContract(componentName, metadata);

      if (!contract) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Component "${componentName}" not found. Available components: ${metadata.components.map((c) => c.name).join(", ")}`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(contract, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Unknown tool: ${name}`,
        },
      ],
      isError: true,
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // eslint-disable-next-line no-console
  console.error(`[hv-uikit-mcp] Server started (v${metadata.version})`);
  // eslint-disable-next-line no-console
  console.error(
    `[hv-uikit-mcp] Loaded ${metadata.components.length} components`,
  );
}
