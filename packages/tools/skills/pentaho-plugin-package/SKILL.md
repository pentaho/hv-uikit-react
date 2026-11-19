---
name: pentaho-plugin-package
description: Package a Pentaho plugin for a server - build its bundles, check them against the plugin's configuration and write one zip to unzip into a server's pentaho-solutions/system, then report what it holds. Use when someone asks to package, ship, export or hand over a plugin built with pentaho-plugin.
license: Apache-2.0
compatibility: Needs Node 22.22+, 24.15+ or 26+, and npm access to @pentaho/uikit-cli and @pentaho/uikit-tools.
---

# Package a Pentaho plugin

**Working with the person.** Talk in their words; the zip's path is the only path they need.

**Tools.** The project's `npm run check` and `npm run package` (the UI Kit CLI's `uikit-cli package`).

## 1. Clean first

In the plugin's folder, `npm run check` passes. Fix what it names; don't package around it.

## 2. Package

`npm run package` builds the bundles, checks the build holds every bundle the configuration names, and
writes `<id>.zip`: one `<id>/` folder with `plugin.xml`, `pentaho-app-shell.config.json` and the built `webclient/`.
If it names a problem, fix the project and run it again; never edit the zip or what it generated.

## 3. Hand-off

- The zip, and that it installs by unzipping into a server's `pentaho-solutions/system`.
- Its menu entry and views, and which states were seen on a screenshot.
- Its limits: it runs on sample data; it needs a server with the App Shell and UI Kit versions it is built with; the
  plugin conventions are inferred and not yet checked on a server; nothing was deployed.
