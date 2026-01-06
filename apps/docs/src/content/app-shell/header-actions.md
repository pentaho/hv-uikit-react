# Header Actions

The **App Shell** allows to add actions to the right-hand side of the header.
These actions are defined in the **App Shell** configuration file, under the `header.actions` property and will be displayed in the same order as they are declared on the configuration file.

Header actions support [conditions](./configuration#conditions), allowing conditional display of actions based on runtime criteria such as user permissions or feature flags.

## Example

Create `src/header/SayHelloButton.tsx` with the following code:

```tsx
export default function Hello({ planet = "Earth" }: { planet: string }) {
  return <button onClick={() => alert(`Hello ${planet}!`)}>Say Hello</button>;
}
```

Add the _Header Action_ to your configuration:

```ts
const header = {
  actions: [
    {
      bundle: "@hv-apps/my-app/header/SayHelloButton.js",
      config: {
        planet: "Mars",
      },
    },
    // Conditional header action
    {
      bundle: "@hv-apps/my-app/header/AdminButton.js",
      conditions: [
        {
          bundle: "@hv-apps/my-app/conditions/useIsAdmin.js",
        },
      ],
    },
  ],
};
```

## Built-in Header Actions

### App Switcher

The **App Shell** provides an App Switcher _Header Action_ that opens a panel with a list of available _Products_, implementing the UI Kit's [`HvAppSwitcher`](/components/app-switcher) component.

To use this action, the bundle must be defined as `@hv/app-switcher-client/toggle.js` and the config object for it has the following options:

- `title`: The App Switcher panel title. Supports internationalization.
- `apps`: Array of apps that are included at the app switcher panel. Each App has the following properties:
  - `label`: Title of the app. **Required**. Supports internationalization.
  - `description`: Description of the app. Supports internationalization.
  - `url`: URL to be used for navigation when clicking the button. **Required**. Supports internationalization.
  - `target`: `NEW` or `SELF`. If value provided is `NEW`, it will open the provided url in a new tab. If value is `SELF`, will navigate in the current browser tab. **Required**.
  - `icon`: The icon associated with the app.
    - `iconType`: Type of icon to be used (at this moment the only possible value is `uikit`).
    - `name`: Name of the icon to be used (as identified at [UI Kit's icons library](/docs/icon-library#library))

Example:

```ts
const headerAction = {
  bundle: "@hv/app-switcher-client/toggle.js",
  config: {
    title: "Apps",
    apps: [
      {
        label: "App 1",
        description: "Application 1",
        url: "#",
        target: "NEW",
        icon: { iconType: "uikit", name: "Dummy" },
      },
      {
        label: "App 2",
        description: "Application 2",
        url: "#",
        target: "SELF",
        icon: { iconType: "uikit", name: "Warehouse" },
      },
      {
        label: "App 3",
        url: "#",
        target: "NEW",
      },
    ],
  },
};
```

### Help Button

To use this action, the bundle must be defined as `@hv/help-client/button.js` and the config object for it has the following options:

- `url`: URL to be used for navigation when clicking the button. **Required**. Supports internationalization.
- `description`: Description of the button. Supports internationalization. If no value is provided the fallback value will be `url`.

Example:

```ts
const headerAction = {
  bundle: "@hv/help-client/button.js",
  config: {
    url: "https://www.hitachivantara.com/",
    description: "Hitachi Vantara Help Link",
  },
};
```

### Color Mode Switcher

The **App Shell** provides a built-in Color Mode Switcher _Header Action_ that can be used to change the active color mode.
It will cycle through the available color modes of the active theme, effectively toggling between light and dark modes on the built-in themes.

To use this action, the bundle must be defined as `@hv/theming-client/colorModeSwitcher.js`. It has no config options:

```ts
const headerAction = {
  bundle: "@hv/theming-client/colorModeSwitcher.js",
};
```
