#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";

import { createCommand as create } from "./create.js";
import { describeCommand as describe } from "./describe.js";
import { initCommand as init } from "./init.js";
import { __rootPath } from "./utils.js";

const pkg = JSON.parse(fs.readFileSync(`${__rootPath}/package.json`, "utf-8"));

const program = new Command(pkg.name)
  // metadata
  .description(pkg.description)
  .version(pkg.version)
  // commands
  .addCommand(create)
  .addCommand(describe)
  .addCommand(init);

try {
  program.parse(process.argv);
} catch (error) {
  if (error) console.log(chalk.red(error));
}
