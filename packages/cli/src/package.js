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
import fs from "fs-extra";

// utility function to order alphabetically an object's keys
const sortObjectKeys = (obj) => {
  return Object.keys(obj)
    .toSorted()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
};

export const updatePackageJson = async (appPath, packageName, dependencies) => {
  // replace package name
  const pckgFile = `${appPath}/package.json`;
  const pckgData = fs.readFileSync(pckgFile, { encoding: "utf-8" });
  const pckgUpdated = pckgData.replace("uikit-app", packageName);
  fs.writeFileSync(pckgFile, pckgUpdated);

  // if there are any dependencies.dependencies or dependencies.devDependencies, append them to the package.json file
  if (Object.keys(dependencies).length) {
    const packageJsonPath = `${appPath}/package.json`;
    const packageJson = fs.readJsonSync(packageJsonPath);

    if (dependencies.dependencies != null) {
      Object.assign(packageJson.dependencies, dependencies.dependencies);
      packageJson.dependencies = sortObjectKeys(packageJson.dependencies);
    }

    if (dependencies.devDependencies != null) {
      Object.assign(packageJson.devDependencies, dependencies.devDependencies);
      packageJson.devDependencies = sortObjectKeys(packageJson.devDependencies);
    }

    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
  }
};
