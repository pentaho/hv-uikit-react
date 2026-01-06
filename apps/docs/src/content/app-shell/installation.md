# Installation

## Automatic setup

We recommend using the `@hitachivantara/uikit-cli` to create a new app, which sets up everything automatically:

```sh
npx @hitachivantara/uikit-cli@latest create my-app
```

Once the installation is complete, you can:

1. Change directory to the newly created project folder.
2. Install the dependencies with `npm install`.
3. Run `npm run dev` to start the development server.

## Manual setup

To create a new **App Shell** app manually, you first need to setup [Vite](https://vite.dev).
Vite also provides a [CLI tool](https://npm.im/create-vite) to automatically set-up a project:

```sh
npm create vite@latest my-app -- --template react-ts
```

After having a Vite project setup, you can:

1. Install the App Shell Vite plugin:

```sh
npm install -D @hitachivantara/app-shell-vite-plugin
```

2. Add the `HvAppShellVitePlugin` to the vite `plugins` section:

```ts
import { HvAppShellVitePlugin } from "@hitachivantara/app-shell-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    // ...
    HvAppShellVitePlugin({
      modules: ["src/App"],
    }),
  ],
});
```

3. Create the `app-shell.config.ts` in the root directory. For now, add the following configuration:

```ts
import type { HvAppShellConfig } from "@hitachivantara/app-shell-vite-plugin";

export default {
  logo: { name: "HITACHI" },
  menu: [
    {
      label: "Home",
      target: "/",
    },
  ],
  mainPanel: {
    views: [
      {
        route: "/",
        bundle: "@self/App.js",
      },
    ],
  },
} satisfies HvAppShellConfig;
```

For more information about the **App Shell** configuration check the [configuration file reference](./configuration).

4. The file `src/App.tsx` can be removed as the vite plugin will add it automatically as a virtual resource if not present.
   However, if you still see the need to have it in your app, then replace its content with the code below:

```tsx
import HvAppShell from "@hitachivantara/app-shell-ui";

export default function App() {
  return <HvAppShell configUrl={`${document.baseURI}app-shell.config.json`} />;
}
```

5. You are good to go! Run your brand new **App Shell** app! 🚀

```sh
npm run dev
```
