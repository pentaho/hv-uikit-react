import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";

import { __dirname } from "./utils.js";

const DIR = `${__dirname}/descriptions`;

const pick = (entry, dense) =>
  dense ? entry.file.replace(/\.md$/, ".dense.md") : entry.file;

const readIndex = () => {
  try {
    return fs.readJsonSync(`${DIR}/index.json`);
  } catch {
    return null;
  }
};

/** Case-insensitive match on name, with or without the Hv prefix. */
const find = (index, query) => {
  const q = query.toLowerCase().replace(/^hv/, "");
  return index.filter((e) =>
    e.name.toLowerCase().replace(/^hv/, "").includes(q),
  );
};

export const describeCommand = new Command()
  .name("describe")
  .description("print a component's API, tokens, examples and usage guidance")
  .argument("[component]", "component name, e.g. Button or HvButton")
  .option("-l, --list", "list every component in the index")
  .option("-d, --dense", "token-efficient output for pasting into a chat")
  .action((component, options) => {
    const index = readIndex();

    if (!index) {
      console.error(
        chalk.red("No description index found in this uikit-cli build."),
      );
      process.exitCode = 1;
      return;
    }

    if (options.list || !component) {
      const guided = index.filter((e) => e.hasGuidance).length;
      console.log(index.map((e) => e.name).join("\n"));
      console.log(
        chalk.dim(
          `\n${index.length} components, ${guided} with usage guidance`,
        ),
      );
      return;
    }

    const matches = find(index, component);

    if (matches.length === 0) {
      console.error(chalk.red(`No component matching "${component}".`));
      console.error(
        chalk.dim("Run `uikit-cli describe --list` to see what is available."),
      );
      process.exitCode = 1;
      return;
    }

    if (matches.length > 1) {
      const exact = matches.find(
        (e) =>
          e.name.toLowerCase() ===
          `hv${component.toLowerCase().replace(/^hv/, "")}`,
      );
      if (!exact) {
        console.error(
          chalk.yellow(`"${component}" matches ${matches.length} components:`),
        );
        console.error(matches.map((e) => `  ${e.name}`).join("\n"));
        process.exitCode = 1;
        return;
      }
      console.log(
        fs.readFileSync(`${DIR}/${pick(exact, options.dense)}`, "utf-8"),
      );
      return;
    }

    console.log(
      fs.readFileSync(`${DIR}/${pick(matches[0], options.dense)}`, "utf-8"),
    );
  });
