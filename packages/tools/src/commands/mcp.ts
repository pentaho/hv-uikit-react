import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { lint, lintText } from "../core/lint.js";
import { answer, type LookupRequest } from "../core/lookup.js";
import { CORE, loadMetadata, type LoadOptions } from "../core/metadata.js";

type Args = Record<string, unknown>;

interface McpTool {
  name: string;
  description: string;
  inputSchema: z.ZodRawShape;
  /** A lookup, answered as its CLI command prints it. */
  request?(args: Args): LookupRequest;
  /** A tool that isn't a lookup: its text. */
  run?(args: Args, options: LoadOptions): string;
}

/** MCP tools; each returns exactly what its CLI command prints. */
export const MCP_TOOLS: McpTool[] = [
  {
    name: "list_components",
    description:
      "List the UI Kit components with a one-line description; marks the ones with design guidance. Same output as `uikit-tools components`.",
    inputSchema: {
      limit: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Most components to return (default: all)"),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Components to skip (default 0)"),
    },
    request: (args: Args): LookupRequest => ({
      kind: "components",
      limit: args.limit as number | undefined,
      offset: args.offset as number | undefined,
    }),
  },
  {
    name: "get_component",
    description:
      "A UI Kit component's import, props and design guidance: the designers' note (when to use, spec, don'ts), variants, states and accessibility. Same output as `uikit-tools info <component>`.",
    inputSchema: {
      name: z.string().describe("Component name, e.g. HvDialog"),
    },
    request: (args: Args): LookupRequest => ({
      kind: "component",
      name: String(args.name ?? ""),
    }),
  },
  {
    name: "list_rules",
    description:
      "List the UI Kit design rules by id. Same output as `uikit-tools rules`.",
    inputSchema: {},
    request: (): LookupRequest => ({ kind: "rules" }),
  },
  {
    name: "get_rule",
    description:
      "A UI Kit design rule as written, by id (e.g. tokens/colors), a whole rule file (e.g. tokens), or the lint rule a finding cites (e.g. uikit/raw-elements). Same output as `uikit-tools rule <id>`.",
    inputSchema: {
      id: z
        .string()
        .describe("Rule id, e.g. tokens/colors, or a file, e.g. actions"),
    },
    request: (args: Args): LookupRequest => ({
      kind: "rule",
      id: String(args.id ?? ""),
    }),
  },
  {
    name: "find_tokens",
    description:
      "The UI Kit theme tokens with their values (light and dark) and what each is for, filtered by words such as border, hover or space; all of them without. Same output as `uikit-tools tokens [words]`.",
    inputSchema: {
      query: z
        .string()
        .optional()
        .describe("Words to match, e.g. border or primary hover"),
    },
    request: (args: Args): LookupRequest => ({
      kind: "tokens",
      query: String(args.query ?? ""),
    }),
  },
  {
    name: "lint",
    description:
      "Check code files or folders against the UI Kit design rules (raw elements, inline styles, hardcoded values, labels, deprecated APIs). Same output as `uikit-tools lint <paths>`.",
    inputSchema: {
      paths: z
        .array(z.string())
        .min(1)
        .describe("Files or folders, relative to the project, e.g. src"),
    },
    run: (args: Args, { cwd }: LoadOptions) =>
      lintText(lint(args.paths as string[], cwd)),
  },
];

/** Answer one MCP tool call; exported so tests can compare it with the CLI. */
export function callTool(
  name: string,
  args: Args = {},
  options: LoadOptions = {},
) {
  const tool = MCP_TOOLS.find((t) => t.name === name);
  try {
    if (!tool) throw new Error(`Unknown tool: ${name}`);
    const text = tool.run
      ? tool.run(args, options)
      : answer(tool.request!(args), options);
    return { content: [{ type: "text" as const, text }] };
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    return { content: [{ type: "text" as const, text }], isError: true };
  }
}

/**
 * Start the stdio MCP server. Data is read per call from the project the agent runs in,
 * so a missing UI Kit is reported to the agent as a tool error instead of a crash.
 */
export async function mcp(version: string) {
  const server = new McpServer({ name: "hv-uikit", version });
  for (const tool of MCP_TOOLS) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      async (args: Args) => callTool(tool.name, args),
    );
  }

  await server.connect(new StdioServerTransport());
  try {
    const { metadata } = loadMetadata();
    process.stderr.write(
      `hv-uikit MCP server: ${CORE}@${metadata.version}, ${metadata.components.length} components\n`,
    );
  } catch (error) {
    process.stderr.write(
      `hv-uikit MCP server: ${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
}
