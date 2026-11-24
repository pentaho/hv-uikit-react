// `uikit-cli package`: a plugin project built for a Pentaho server and zipped as the server takes it, one <id>/ folder
// to unzip into pentaho-solutions/system: plugin.xml, pentaho-app-shell.config.json, and the built bundles in
// webclient/. Before zipping, it checks the build holds every bundle the configuration names.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { zipSync, type Zippable } from "fflate";

import { packageManager } from "../utils.js";
import { PLUGIN_FILE, readPlugin, type Plugin } from "./plugin.js";
import {
  appShellConfig,
  bundlesOf,
  pluginXml,
  WEBCLIENT_DIR,
} from "./server-files.js";

/** Where `npm run build` writes the bundles (vite's default). */
const BUILD_DIR = "dist";

/** A fixed time on every entry: the same plugin gives the same zip. */
const MTIME = new Date("1980-01-01T00:00:00Z");

export interface PackageResult {
  /** 0 packaged, 1 the project or its build has a problem, 2 not a plugin project. */
  code: 0 | 1 | 2;
  text: string;
}

/** The local App Shell's config the build writes: the server's comes from plugin.json instead. */
const LOCAL_CONFIG = "app-shell.config.json";

/** The SBOM's copy for a site's root: under webclient/ it's never at one, and sbom/bom.json is the same file. */
const WELL_KNOWN = ".well-known";

/** Every file the build made, as paths relative to it, in a stable order. */
const builtFiles = (buildDir: string) =>
  fs
    .readdirSync(buildDir, { recursive: true, encoding: "utf8" })
    .filter(
      (file) =>
        file !== LOCAL_CONFIG &&
        !file.startsWith(WELL_KNOWN) &&
        // lstat: a link is never followed out of the build into the zip
        fs.lstatSync(path.join(buildDir, file)).isFile(),
    )
    .map((file) => file.split(path.sep).join("/"))
    .toSorted();

/** The plugin's files, inside its <id>/ folder: the server's two files, then the build as webclient/. */
function pluginFiles(plugin: Plugin, buildDir: string): Zippable {
  const files: Zippable = {
    [`${plugin.id}/plugin.xml`]: Buffer.from(pluginXml(plugin)),
    [`${plugin.id}/pentaho-app-shell.config.json`]: Buffer.from(
      appShellConfig(plugin),
    ),
  };
  for (const file of builtFiles(buildDir))
    files[`${plugin.id}/${WEBCLIENT_DIR}/${file}`] = fs.readFileSync(
      path.join(buildDir, file),
    );
  return files;
}

/** Builds the project in `dir` (unless `built`), checks it and writes <dir>/<id>.zip. */
export function packagePlugin(
  dir: string,
  { built = false } = {},
): PackageResult {
  if (!fs.existsSync(path.join(dir, PLUGIN_FILE)))
    return {
      code: 2,
      text: `${dir} has no ${PLUGIN_FILE}: run package in a plugin project`,
    };
  const read = readPlugin(dir);
  if (!read.ok) return { code: 1, text: read.problems.join("\n") };
  const { plugin } = read;

  if (!built) {
    const pm = packageManager();
    const build = spawnSync(pm, ["run", "build"], {
      cwd: dir,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (build.status !== 0)
      return { code: 1, text: `the build failed (${pm} run build)` };
  }

  const buildDir = path.join(dir, BUILD_DIR);
  const missing = fs.existsSync(buildDir)
    ? bundlesOf(plugin).filter(
        (bundle) => !fs.existsSync(path.join(buildDir, bundle)),
      )
    : [BUILD_DIR];
  if (missing.length > 0)
    return { code: 1, text: `not built: ${missing.join(", ")}` };

  const files = pluginFiles(plugin, buildDir);
  const file = path.join(dir, `${plugin.id}.zip`);
  fs.writeFileSync(file, zipSync(files, { mtime: MTIME }));
  return {
    code: 0,
    text: `${path.relative(process.cwd(), file) || file} (${Object.keys(files).length} files): unzip it into the server's pentaho-solutions/system. The server needs the App Shell and UI Kit versions it's built with.`,
  };
}
