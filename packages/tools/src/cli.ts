#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { Command, CommanderError, InvalidArgumentError } from "commander";

import { hook } from "./commands/hook.js";
import { AGENT_NAMES, init } from "./commands/init.js";
import { printLookup } from "./commands/lookup.js";
import { mcp } from "./commands/mcp.js";
import { lint, lintText } from "./core/lint.js";

const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as {
  version: string;
};

/** `--limit 10`: a whole number, 0 or more. */
function count(value: string) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0)
    throw new InvalidArgumentError("expected a whole number, 0 or more");
  return number;
}

const program = new Command("uikit-tools")
  .description("HV UI Kit tools for apps and their coding agents")
  .version(version)
  .exitOverride();

program
  .command("init [folder]")
  .description(
    "Point the project's agents at the installed UI Kit rules: AGENTS.md, each agent's MCP config, and for Claude Code the lint hook and the skills",
  )
  .option(
    "--agents <list>",
    `comma-separated: ${AGENT_NAMES.join(", ")}, or all`,
    "claude,copilot",
  )
  .action((folder: string | undefined, options: { agents: string }) =>
    init(folder, options),
  );

program
  .command("components")
  .description("List the UI Kit components")
  .option("--limit <number>", "most components to list (default: all)", count)
  .option("--offset <number>", "components to skip", count, 0)
  .action((options: { limit?: number; offset: number }) =>
    printLookup({ kind: "components", ...options }),
  );

program
  .command("info <component>")
  .description("A component's import, props and design guidance")
  .action((name: string) => printLookup({ kind: "component", name }));

program
  .command("rules")
  .description("List the UI Kit design rules")
  .action(() => printLookup({ kind: "rules" }));

program
  .command("rule <id>")
  .description(
    "A design rule as written, by id (tokens/colors), a whole rule file (tokens), or a lint rule (uikit/raw-elements)",
  )
  .action((id: string) => printLookup({ kind: "rule", id }));

program
  .command("tokens [words...]")
  .description(
    "The theme tokens, with values and what each is for; filter by words (border, hover, space)",
  )
  .action((words: string[]) =>
    printLookup({ kind: "tokens", query: words.join(" ") }),
  );

program
  .command("lint [paths...]")
  .description(
    "Check code against the UI Kit design rules, with the oxlint and rules this package ships (default: the current folder)",
  )
  .action((paths: string[]) => {
    try {
      const result = lint(paths);
      process.stdout.write(`${lintText(result)}\n`);
      if (!result.ok) process.exitCode = 1;
    } catch (error) {
      process.stderr.write(`${(error as Error).message}\n`);
      process.exitCode = 2;
    }
  });

program
  .command("hook")
  .description(
    "Claude Code PostToolUse hook: lint the file just written with the UI Kit design rules (init adds it)",
  )
  .action(hook);

program
  .command("mcp")
  .description("Start the hv-uikit MCP server on stdio")
  .action(() => mcp(version));

// Exit codes: 0 done, 1 a finding or no match, 2 a usage or run error.
for (const command of program.commands) command.exitOverride();
try {
  await program.parseAsync();
} catch (error) {
  // commander has printed the help, the version or the usage error already
  if (!(error instanceof CommanderError)) throw error;
  process.exitCode = error.exitCode === 0 ? 0 : 2;
}
