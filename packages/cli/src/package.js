import fs from "fs-extra";

export function updatePackageJson(appPath, packageName) {
  // replace package name
  const pkgFile = `${appPath}/package.json`;
  const pkgData = fs.readFileSync(pkgFile, { encoding: "utf-8" });
  const pkgUpdated = pkgData.replace("uikit-app", packageName);
  fs.writeFileSync(pkgFile, pkgUpdated);
}
