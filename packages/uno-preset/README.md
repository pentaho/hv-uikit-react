# @pentaho/uikit-uno-preset

UI Kit UnoCSS preset.

## Installation

Install the package in your project directory with:

```sh
npm install -D unocss @pentaho/uikit-uno-preset
```

Add the `presetHv` to the array of presets in your `vite.config.ts` or `uno.config.ts` files:

```ts
// vite.config.ts
import { presetHv } from "@pentaho/uikit-uno-preset";
import unoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    unoCSS({
      presets: [presetHv()],
    }),
  ],
});
```

```ts
// uno.config.ts
import { presetHv } from "@pentaho/uikit-uno-preset";
import { defineConfig } from "unocss";

export default defineConfig({
  presets: [presetHv()],
});
```

## Usage

Use any of [Tailwind-like default utility](https://tailwindcomponents.com/cheatsheet/) classes along with the UI Kit theme utilities:

<img src="https://i.imgur.com/bKY5ZUG.png" alt="VSCode completions" width=400>
