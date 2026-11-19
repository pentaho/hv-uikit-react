import fs from "node:fs";
import path from "node:path";
import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { Command, InvalidArgumentError, Option } from "commander";

import { APP_SHELL_FEATURES, createApp, type AppShellFeature } from "./app.js";
import { createPlugin, titleFrom } from "./pentaho/create.js";
import { PLUGIN_ID } from "./pentaho/plugin.js";
import {
  packageManager,
  runBin,
  styled,
  toKebabCase,
  toPackageName,
  toPascalCase,
} from "./utils.js";

const TEMPLATES = {
  app: "an App Shell app",
  vite: "a plain Vite app",
  plugin: "a Pentaho plugin",
} as const;
type Template = keyof typeof TEMPLATES;

interface Answers {
  template: Template;
  name: string;
  title?: string;
  features?: AppShellFeature[];
  autoRoutes: boolean;
}

/** Prompts only where someone can answer them: an interactive terminal, outside CI. */
const canPrompt = () => Boolean(process.stdin.isTTY) && !process.env.CI;

const FEATURE_NAMES = Object.keys(APP_SHELL_FEATURES) as AppShellFeature[];

/** `--features help-link,color-mode-switcher` */
function parseFeatures(list: string): AppShellFeature[] {
  const names = list.split(",").filter(Boolean).map(toPascalCase);
  const unknown = names.filter((name) => !(name in APP_SHELL_FEATURES));
  if (unknown.length > 0)
    throw new InvalidArgumentError(
      `unknown feature ${unknown.join(", ")}; use ${FEATURE_NAMES.map(toKebabCase).join(", ")}`,
    );
  return names as AppShellFeature[];
}

/** Why a name can't be used, or nothing when it can. */
function nameProblem(name: string, template: Template) {
  if (name === ".") return undefined;
  const id = toPackageName(name);
  if (!id) return `"${name}" has no letters or digits to name a folder with`;
  if (template === "plugin" && !PLUGIN_ID.test(id))
    return `"${name}" makes the plugin id "${id}": it must start with a letter`;
  return undefined;
}

/** The answers the flags didn't give, asked in an interactive terminal. */
async function ask(given: Partial<Answers>): Promise<Answers> {
  const template =
    given.template ??
    (await select<Template>({
      message: "What do you want to create?",
      choices: Object.entries(TEMPLATES).map(([value, name]) => ({
        value: value as Template,
        name: name.replace(/^a[n]? /, (a) => a.toUpperCase()),
      })),
    }));
  const plugin = template === "plugin";
  const name =
    given.name ??
    (await input({
      message: plugin ? "Plugin name" : "App name",
      default: plugin ? "my-plugin" : "my-app",
      validate: (value) => nameProblem(value, template) ?? true,
    }));
  if (plugin)
    return {
      template,
      name,
      autoRoutes: true,
      title:
        given.title ??
        (await input({ message: "Title", default: titleFrom(name) })),
    };
  if (template === "vite") return { template, name, autoRoutes: true };
  return {
    template,
    name,
    features:
      given.features ??
      (await checkbox<AppShellFeature>({
        message: "Header features (space to select)",
        choices: FEATURE_NAMES.map((value) => ({ value })),
      })),
    autoRoutes:
      given.autoRoutes ??
      (await confirm({
        message: "Routes and menu from src/pages?",
        default: true,
      })),
  };
}

/** Refuses flags the template doesn't take, whether it was given or chosen in a prompt. */
function checkFlags(
  template: Template,
  { title, features, autoRoutes }: Partial<Answers>,
) {
  if (title !== undefined && template !== "plugin")
    throw new Error("--title is for -t plugin");
  if ((features || autoRoutes === false) && template !== "app")
    throw new Error("--features and --no-auto-routes are for -t app");
}

/** Empties `dir` but its .git, for --force. */
const empty = (dir: string) => {
  for (const entry of fs.readdirSync(dir))
    if (entry !== ".git")
      fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
};

/** Writes the app or plugin into ./<name> (or the current folder for "."), then prints the next steps. */
function create(answers: Answers, force = false) {
  const here = answers.name === ".";
  const target = here
    ? process.cwd()
    : path.resolve(toPackageName(answers.name));
  // "." is named after its folder: checked before --force empties it
  const name = here ? path.basename(target) : answers.name;
  const problem = nameProblem(name, answers.template);
  if (problem) throw new Error(problem);
  checkFlags(answers.template, answers);

  const existed = fs.existsSync(target);
  if (existed && fs.readdirSync(target).some((entry) => entry !== ".git")) {
    if (!force)
      throw new Error(
        `${path.relative(process.cwd(), target) || "."} has files: use another name, or --force to empty it first`,
      );
    empty(target);
  }

  try {
    if (answers.template === "plugin")
      createPlugin(target, name, answers.title);
    else
      createApp(target, {
        name,
        appShell: answers.template === "app",
        features: answers.features,
        autoRoutes: answers.autoRoutes,
      });
  } catch (error) {
    if (!existed) fs.rmSync(target, { recursive: true, force: true });
    throw error;
  }

  const pm = packageManager();
  const steps = [
    ...(here ? [] : [`cd ${path.relative(process.cwd(), target)}`]),
    `${pm} install`,
    `${runBin(pm, "uikit-tools init")}   # set up coding agents`,
    `${pm} run dev`,
  ];
  console.log(
    `${styled("green", "✔")} Created ${TEMPLATES[answers.template]} in ${styled("bold", path.relative(process.cwd(), target) || ".")}\n\nNext:\n${steps.map((step) => `  ${step}`).join("\n")}`,
  );
}

export const createCommand = new Command("create")
  .argument("[name]", 'app or plugin name; "." for the current folder')
  .description("Create an App Shell app, a plain Vite app, or a Pentaho plugin")
  .addOption(
    new Option("-t, --template <template>", "what to create")
      .choices(Object.keys(TEMPLATES))
      .default("app"),
  )
  .addOption(
    new Option(
      "--features <list>",
      `App Shell header features, comma-separated: ${FEATURE_NAMES.map(toKebabCase).join(", ")}`,
    ).argParser(parseFeatures),
  )
  .option(
    "--no-auto-routes",
    "App Shell: list views and menu in app-shell.config.ts instead of from src/pages",
  )
  .option("--title <title>", "plugin title (default: from its name)")
  .option("-f, --force", "empty a folder that has files first (keeps .git)")
  // earlier names, still accepted
  .addOption(new Option("-w, --without-app-shell").hideHelp())
  .addOption(
    new Option("--app-shell-features <list>")
      .argParser(parseFeatures)
      .hideHelp(),
  )
  .addOption(new Option("--disable-file-based-routing").hideHelp())
  .action(async function (this: Command, name: string | undefined) {
    const options = this.opts();
    const fromCli = (option: string) =>
      this.getOptionValueSource(option) === "cli";

    const template: Template | undefined = options.withoutAppShell
      ? "vite"
      : fromCli("template")
        ? options.template
        : undefined;
    const features = options.features ?? options.appShellFeatures;
    const autoRoutes = options.disableFileBasedRouting
      ? false
      : fromCli("autoRoutes")
        ? options.autoRoutes
        : undefined;

    const resolved = template ?? (name ? "app" : undefined);
    if (resolved)
      checkFlags(resolved, { title: options.title, features, autoRoutes });

    const given = {
      template: resolved,
      name,
      title: options.title,
      features,
      autoRoutes,
    };
    if (name && resolved) {
      create(
        {
          ...given,
          template: resolved,
          name,
          autoRoutes: autoRoutes ?? true,
        },
        options.force,
      );
      return;
    }
    if (!canPrompt())
      throw new Error(
        "missing name: create <name> (prompts need an interactive terminal)",
      );
    const answers = await ask(given);
    checkFlags(answers.template, given);
    create(answers, options.force);
  });
