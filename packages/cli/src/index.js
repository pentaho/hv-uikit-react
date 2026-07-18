/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";

import { createCommand as create } from "./create.js";
import { __rootPath } from "./utils.js";

const pkg = JSON.parse(fs.readFileSync(`${__rootPath}/package.json`, "utf-8"));

const program = new Command(pkg.name)
  // metadata
  .description(pkg.description)
  .version(pkg.version)
  // commands
  .addCommand(create);

try {
  program.parse(process.argv);
} catch (error) {
  if (error) console.log(chalk.red(error));
}
