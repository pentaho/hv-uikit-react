#!/usr/bin/env node

/**
 * Test client for the MCP server.
 * Spawns the MCP server and invokes tools.
 *
 * Usage:
 *   npx tsx src/test-mcp-client.ts list_components --limit 3
 *   npx tsx src/test-mcp-client.ts get_component_contract --component HvAvatar
 */
import { spawn } from "child_process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const args = process.argv.slice(2);

  if (!args[0]) {
    console.error(
      "Usage: test-mcp-client.ts <tool> [options]\n" +
        "  test-mcp-client.ts list_components --limit 3\n" +
        "  test-mcp-client.ts get_component_contract --component HvAvatar",
    );
    process.exit(1);
  }

  const toolName = args[0];
  const toolArgs: Record<string, unknown> = {};

  // Parse arguments
  for (let i = 1; i < args.length; i += 2) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      const value = args[i + 1];

      if (key === "limit" || key === "offset") {
        toolArgs[key] = parseInt(value, 10);
      } else {
        toolArgs[key] = value;
      }
    }
  }

  // Spawn the MCP server
  const serverProcess = spawn("node", ["packages/tools/dist/cli.js", "mcp"]);

  // Create stdio client transport
  const transport = new StdioClientTransport({
    command: "node",
    args: ["packages/tools/dist/cli.js", "mcp"],
  });

  const client = new Client(
    {
      name: "test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    },
  );

  try {
    // Connect and initialize
    await client.connect(transport);

    // eslint-disable-next-line no-console
    console.log(`[test-client] Connected to MCP server`);

    // Call the tool
    if (toolName === "list_components") {
      const limit = (toolArgs.limit as number) || 10;
      const offset = (toolArgs.offset as number) || 0;

      // eslint-disable-next-line no-console
      console.log(
        `[test-client] Calling list_components (limit=${limit}, offset=${offset})`,
      );

      const result = await client.callTool({
        name: "list_components",
        arguments: { limit, offset },
      });

      // eslint-disable-next-line no-console
      console.log("\nResult:\n");
      // eslint-disable-next-line no-console
      const content = result.content as Array<{ type: string; text?: string }>;
      console.log(
        content[0]?.type === "text"
          ? content[0]?.text
          : JSON.stringify(content, null, 2),
      );
    } else if (toolName === "get_component_contract") {
      const componentName = toolArgs.componentName as string;

      if (!componentName) {
        console.error("Error: --component <name> is required");
        process.exit(1);
      }

      // eslint-disable-next-line no-console
      console.log(
        `[test-client] Calling get_component_contract (component=${componentName})`,
      );

      const result = await client.callTool({
        name: "get_component_contract",
        arguments: { componentName },
      });

      // eslint-disable-next-line no-console
      console.log("\nResult:\n");
      // eslint-disable-next-line no-console
      const content2 = result.content as Array<{ type: string; text?: string }>;
      console.log(
        content2[0]?.type === "text"
          ? content2[0]?.text
          : JSON.stringify(content2, null, 2),
      );
    } else {
      console.error(`Unknown tool: ${toolName}`);
      process.exit(1);
    }

    await transport.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main().catch(console.error);
