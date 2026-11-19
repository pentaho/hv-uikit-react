import path from "node:path";
import { Command } from "commander";

import { packagePlugin } from "./pentaho/package.js";
import { styled } from "./utils.js";

export const packageCommand = new Command("package")
  .argument("[dir]", "the plugin project", ".")
  .description("Build a Pentaho plugin, check it, and zip it for the server")
  .option("--built", "use the existing build in dist")
  .action((dir: string, options: { built?: boolean }) => {
    const result = packagePlugin(path.resolve(dir), { built: options.built });
    if (result.code === 0) {
      console.log(`${styled("green", "✔")} ${result.text}`);
    } else {
      process.stderr.write(`error: ${result.text}\n`);
      process.exitCode = result.code;
    }
  });
