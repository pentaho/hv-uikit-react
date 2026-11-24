#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { Command, CommanderError } from "commander";

import { createCommand } from "./create.js";
import { packageCommand } from "./package-command.js";
import { shotsCommand } from "./shots.js";
import { PACKAGE_DIR } from "./utils.js";

const { version, description } = JSON.parse(
  readFileSync(path.join(PACKAGE_DIR, "package.json"), "utf8"),
) as { version: string; description: string };

const program = new Command("uikit-cli")
  .description(description)
  .version(version)
  .addCommand(createCommand.exitOverride())
  .addCommand(packageCommand.exitOverride())
  .addCommand(shotsCommand.exitOverride())
  .exitOverride();

// Exit codes: 0 done, 1 a check failed, 2 a usage or run error, 130 canceled (Ctrl-C).
try {
  await program.parseAsync();
} catch (error) {
  if (error instanceof CommanderError) {
    // commander has printed the help or the usage error already
    process.exitCode = error.exitCode === 0 ? 0 : 2;
  } else if (error instanceof Error && error.name === "ExitPromptError") {
    process.exitCode = 130;
  } else {
    process.stderr.write(
      `error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 2;
  }
}
