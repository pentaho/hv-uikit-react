import chalk from "chalk";
import nodePlop from "node-plop";

import { __dirname } from "./utils.js";

const plop = await nodePlop(`${__dirname}/plopfile.js`);

const createReadMe = plop.getGenerator("createReadMe");

const createReadMeFile = async (path, name) => {
  await createReadMe.runActions({
    path,
    appName: name.replace(/([a-z])([A-Z])/g, "$1 $2"),
  });
};

export const createAppContents = async (appPath, name) => {
  console.log(`Creating ${chalk.cyan(name)} contents\n`);

  await createReadMeFile(appPath, name);
};
