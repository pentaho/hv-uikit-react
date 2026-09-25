#!/usr/bin/env node
import { program } from "commander";

import { init } from "./commands/init.js";
import { mcp } from "./commands/mcp.js";
import { validate } from "./commands/validate.js";

program
  .name("uikit-tools")
  .description("HV UI Kit tools for consumers: init, validate, mcp")
  .version("1.0.0");

program
  .command("init [targetDir]")
  .description(
    "Generate AGENTS.md in the target directory (default: current directory)",
  )
  .action(init);

program
  .command("validate <paths...>")
  .description("Validate code against HV UI Kit contracts")
  .option("--fix", "Attempt to auto-fix violations (not implemented yet)")
  .action(validate);

program
  .command("mcp")
  .description("Start the MCP server on stdio for agent integration")
  .action(async () => {
    await mcp();
  });

program.parse();
