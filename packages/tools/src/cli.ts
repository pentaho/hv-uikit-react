#!/usr/bin/env node
import { program } from "commander";

import { init } from "./commands/init.js";
import { getComponentInfo, listComponents, loadMetadata } from "./commands/mcp.js";
import { mcp } from "./commands/mcp.js";
import { validate } from "./commands/validate.js";

program
  .name("uikit-tools")
  .description("HV UI Kit tools for consumers: init, validate, mcp")
  .version("1.0.0");

program
  .command("init [targetDir]")
  .description(
    "Generate agent instructions in the target directory (default: current directory)",
  )
  .option(
    "--harness <type>",
    "Target harness: 'claude' or 'copilot' (default: copilot)",
    "copilot",
  )
  .action(init);

program
  .command("validate <paths...>")
  .description("Validate code against HV UI Kit contracts")
  .option("--fix", "Attempt to auto-fix violations (not implemented yet)")
  .action(validate);

program
  .command("components")
  .description("List HV UI Kit components with pagination metadata")
  .option("--limit <number>", "Maximum number of components to return", "10")
  .option("--offset <number>", "Number of components to skip", "0")
  .action((options) => {
    const metadata = loadMetadata();
    const response = listComponents(metadata, {
      limit: Number(options.limit),
      offset: Number(options.offset),
    });
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(response, null, 2));
  });

program
  .command("info <component>")
  .description("Print the full contract for a specific HV UI Kit component")
  .action((component) => {
    const metadata = loadMetadata();
    const contract = getComponentInfo(metadata, component);

    if (!contract) {
      // eslint-disable-next-line no-console
      console.error(
        `Component "${component}" not found. Available components: ${metadata.components.map((c) => c.name).join(", ")}`,
      );
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(contract, null, 2));
  });

program
  .command("mcp")
  .description("Start the MCP server on stdio for agent integration")
  .action(async () => {
    await mcp();
  });

program.parse();
