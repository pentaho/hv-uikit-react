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
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";

import { createAppShellBaseline, setupAppShell } from "./app-shell.js";
import { createAppContents } from "./contents.js";
import { createNavigationFiles } from "./navigation.js";
import { updatePackageJson } from "./package.js";
import { __dirname, toPascalCase, toSentenceCase } from "./utils.js";

/** @type import("inquirer").QuestionCollection */
const questions = [
  {
    type: "input",
    name: "name",
    message: "App name",
    default: "uikit-app",
    validate(val) {
      if (typeof val === "string") {
        return true;
      }

      return "Please enter a valid name";
    },
  },
  {
    type: "confirm",
    name: "useAppShell",
    message: "Use App Shell?",
    default: true,
  },
  {
    type: "checkbox",
    message: "Do you want to enable App Shell features? If so, choose which:",
    name: "appShellFeatures",
    choices: ["Help Link", "Color Mode Switcher", "App Switcher"],
    when(answers) {
      return answers.useAppShell;
    },
    filter(val) {
      return val.map((v) => toPascalCase(v));
    },
  },
  {
    type: "confirm",
    name: "appShellAutoMenu",
    message: "Use automatic menu generation in App Shell?",
    default: true,
    when(answers) {
      return answers.useAppShell;
    },
  },
  {
    type: "checkbox",
    message: "Do you want to use templates? If so, choose which:",
    name: "templates",
    choices: fs
      .readdirSync(`${__dirname}/templates`, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => toSentenceCase(d.name)),
    filter(val) {
      return val.map((v) => toPascalCase(v));
    },
  },
];

const createAppBaseline = (appPath) => {
  const basePath = `${__dirname}/baselines/vite`;

  console.log(`\nCreating a new UI Kit app in\n${chalk.green(appPath)}\n`);

  // copy baseline contents
  fs.copySync(basePath, appPath, { overwrite: true });
  fs.moveSync(`${appPath}/_gitignore`, `${appPath}/.gitignore`);
  fs.moveSync(`${appPath}/_package.json`, `${appPath}/package.json`);
  fs.moveSync(`${appPath}/_oxlintrc.json`, `${appPath}/.oxlintrc.json`);
};

const create = async ({
  name = "uikit-app",
  useAppShell = true,
  appShellFeatures = [],
  appShellAutoMenu = true,
  templates = [],
}) => {
  console.log(chalk.cyan("\nUI kit app generator\n"));

  const packageName = name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const appPath = `${process.cwd()}/${packageName}`;

  // create app baseline from receipt
  if (useAppShell) {
    await createAppShellBaseline(appPath);
  } else {
    createAppBaseline(appPath);
  }
  // create app contents from recipe templates selection
  const dependencies = await createAppContents(
    appPath,
    name,
    templates,
    useAppShell,
  );

  if (useAppShell) {
    await setupAppShell(
      appPath,
      name,
      appShellFeatures,
      appShellAutoMenu,
      packageName,
    );
    console.log(
      `App Shell documentation: ${chalk.cyan(
        "https://pentaho.github.io/uikit-docs/master/app-shell",
      )}`,
    );
  } else {
    await createNavigationFiles(appPath);
  }

  updatePackageJson(appPath, packageName, dependencies);

  console.log(`\nDone! Now run:\n`);
  console.log(` cd ${chalk.green(packageName)}`);
  console.log(` npm install`);
  console.log(` npm run dev`);
};

export const createCommand = new Command()
  .command("create [name]")
  .description(
    "Create new UI Kit app using the provided baselines and templates",
  )
  .option("-w --without-app-shell", "Whether to not include AppShell.")
  .option(
    "--app-shell-features <appShellFeatures>",
    "AppShell features to enable (comma separated).",
  )
  .option(
    "--disable-file-based-routing",
    "Disable AppShell options for file based routing and automatic menu generation.",
  )
  .option("-t --templates <templates>", "Templates to use (comma separated).")
  .action(async (name, options) => {
    const isInteractive = !name;

    if (isInteractive) {
      const results = await inquirer.prompt(questions);
      create(results);
    } else {
      const {
        withoutAppShell,
        appShellFeatures,
        disableFileBasedRouting,
        templates,
      } = options;

      create({
        name,
        useAppShell: !withoutAppShell,
        appShellFeatures: appShellFeatures?.split(",").map(toPascalCase),
        appShellAutoMenu: !disableFileBasedRouting,
        templates: templates?.split(",").map(toPascalCase),
      });
    }
  });
