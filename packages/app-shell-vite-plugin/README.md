# @hitachivantara/app-shell-vite-plugin

App Shell Vite Plugin: Streamlines development and build processes for App Shell.

## Overview

The `@hitachivantara/app-shell-vite-plugin` enhances the App Shell experience by automating essential development and build tasks, such as processing configurations, creating virtual endpoints, and managing importmaps and base paths.

This plugin is responsible for the hard lifting during development time and build time. It performs the following actions:

- copy all the required `js` bundles to the final "bundles" folders;
- process the `app-shell.config.ts` file;
- create virtual endpoints to support dev mode;
- create virtual `main.tsx` and `App.tsx` files. These files are there strictly for development purposes, as what ultimately matters are the ESM modules exported and consumed by others;
- create `importmap` and inject it into `index.html`;
- create `<base href="...">` tag and inject it into `index.html`.

## How to use

Install the plugin:

```sh
npm install -D @hitachivantara/app-shell-vite-plugin
```

Add the plugin to the vite plugin list in `vite.config.ts`.

```ts
import { HvAppShellVitePlugin } from "@hitachivantara/app-shell-vite-plugin";

export default defineConfig(({ mode }) => {
  return {
    plugins: [HvAppShellVitePlugin({ mode })],
  };
});
```

## app-shell.config.ts

The configuration file must be placed at the root directory of the app and the vite-plugin can process the `app-shell.config.ts` file.

## Configuration properties

- `modules`: all modules that an application wants, and needs, to export so that they can be consumed by either **App Shell** or any other applications.
- `type`: controls the way application build process is executed. By using the `app` option, the build process will generate the complete set of final files ( index.html, assets, etc). Using the `bundle` option, will only create the final files for the entries defined at the `modules` property. `app` value is typically recommended for the scenarios where App Shell is used at standalone scenarios, and `bundle` for microservices environments. By default, `type` value is set to `app` at local development, but it will change to `bundle` value at CI environments (relying at the standard env property that normally available at these environments). To use `app` , value needs to be explicitly set at `vite.config` file.

### Automatic features

- `autoViewsAndRoutes`: automatically exports views from the `src/pages` directory (or any other specified folder defined in the `viewsFolder` property). This includes automatic route configuration (merges with existing ones, if any). The resulting views will be added automatically to views defined at the configuration file (associated bundle will also be added to the final modules list)
- `autoMenu`: creates a navigation menu derived from the views. This ensures a more organized and streamlined development process.

> Empty Configuration Validity: With these automatic features in place, the configuration file isn't even mandatory for dev environments.

## \<base href> tag

The `<base href="...">` tag is automatically injected at the `index.html` file during the build process and its value will be the same as:

1. the `base` property of Vite configuration if it is defined;
2. or the `baseUrl` property of the App Shell configuration file;
3. or `/`, if none of the above are set.

In the below snippet, the value injected in the base href tag will be `/example/` regardless of the App Shell configuration file.

```ts
export default defineConfig(({ mode }) => {
  return {
    plugins: [HvAppShellVitePlugin({ mode })],
    base: "/example/",
  };
});
```
