# App Shell API Reference

While one objective might be producing reusable ES modules, that can be used independently of the **App Shell**, some functionalities do require modules to be aware if they're being executed within the **App Shell** and to be able to access some of its functionalities.
For that, integration packages are provided, that can be used by the modules to access the **App Shell** functionalities.

## Navigation

The navigation tree and routing is managed by **App Shell**, and unknown to the modules at dev and build time.
In order to be able to navigate between _Views_ and access navigation information, the **App Shell Navigation package** provides a set of functions that can be used by the modules.

### `useHvNavigation`

The main goal is to allow the module to navigate to a given _View_ regardless of its application.

A destination can be defined as:

1. A `string`, identifying either the module identifier of the _View_ or the final path to navigate to.
2. A `ViewDestination` object, representing the _View_ to navigate to and can have the following properties:
   1. `viewBundle` - The module identifier of the _View_
   2. `pathParams` - The path parameters to be compiled against the route based on the viewBundle
   3. `search` - A URL search string, beginning with a `?`
   4. `hash` - A URL fragment identifier, beginning with a `#`
3. A `Partial<Path>` object, representing the final path to navigate to and can have the following properties:
   1. `pathname` - A URL pathname, beginning with a `/`
   2. `search` - A URL search string, beginning with a `?`
   3. `hash` - A URL fragment identifier, beginning with a `#`

---

Multiple views can share the same module identifier but have different routes. The App Shell selection depends on the search mode. It can be one of the following:

- `auto`: Searches within views whose route is a subpath of the current active view, progressively going up path segments until a match is found.
- `top`: Finds the view closest to the root, i.e. with the least number of path segments.

If multiple views match the search criteria, the function returns the one that appears first in the App Shell configuration.

The hook exports 2 functions:

#### `navigate`

This method accepts two arguments, being:

1. `to` - A destination as mentioned above.
2. `options` - Options object:
   1. `mode` - The search mode to use when searching for the route of a View on the App Shell configuration. Defaults to "auto".
   2. `replace` - By default, `history.push()` is used, however, if set to true, then `history.replace()` is used instead.
   3. `state` - Any data to be associated with the new location.

#### `getViewRoute`

Searches for the route of a _View_ on the App Shell configuration.
It accepts a `string` or a `ViewDestination` object as argument, together with the search mode, and returns a `string` with the compiled path or undefined if the bundle doesn't exist.

### `useHvLocation`

This hook provides access to the `location` object, just like the `useLocation` hook from react-router, but extended with the `views` property, which is an array of the _Views_ rendered on the current page.

### `useHvCurrentNavigationPath`

The `useHvCurrentNavigationPath` hook provides information about the current _View_ location on hierarchy of menu items, allowing, for instance, to build a breadcrumb.
It returns an array of object with the following structure:

- `label` - This field represents the label or name of the menu item. The value of this field is internationalized using the current active locale.
- `path` - This field indicates the menu item's path, if any.

## Theming

The **App Shell** listens to the CustomEvent `@hv/app-shell:theme:trigger` to allow changes in the color mode in runtime.

When dispatching this event, the detail object should include:

- `colorMode`: The theme color mode. If it doesn't exist on the theme, then **App Shell** will simply cycle to the next color mode, if any exists, otherwise will keep the one currently active.

For event dispatching, utilize the `globalThis` variable and below is an example on how to trigger the change:

```tsx
import {
  HvAppShellEventTheme,
  HvAppShellEventThemeTrigger,
} from "@hitachivantara/app-shell-events";

const customEvent = new CustomEvent<HvAppShellEventTheme>()(
  HvAppShellEventThemeTrigger,
  {
    detail: {
      colorMode: "wicked",
    },
  },
);

globalThis.dispatchEvent(customEvent);
```

## Notifications

The **App Shell** supports notification features to capture user attention effectively.
It offers two distinct modes to deliver timely information and facilitate immediate action:

- [Banner](/components/banner): For persistent messages that require user engagement.
- [Snackbar](/components/snackbar): For transient messages that convey brief, auto-dismissing alerts.

To trigger notifications, the **App Shell** listens to the CustomEvent `@hv/app-shell:notifications:trigger`.

When dispatching this event, the detail object should include:

- `type`: The notification type (`"snackbar"` or `"banner"`).
- `variant`: The `variant` of the notification, following the [`HvBanner`](/components/banner) API.
- `message`: The notification text to be displayed.
- `actions`: Actions to display.
- `onAction`: The callback function ran when an action is triggered, receiving action as parameter.

For event dispatching, utilize the `globalThis` variable and below is an example on how to trigger a "success" snackbar notification with the message "This is a snackbar":

```ts
const actions = {
  actions: [
    { id: "action1", label: "Action 1" },
    { id: "action2", label: "Action 2" },
  ],
  onAction: (evt, action) => {
    // do something
  },
};
const customEvent = new CustomEvent<HvAppShellEventNotification>()(
  HvAppShellEventNotificationTrigger,
  {
    detail: {
      type: "snackbar",
      variant: "success",
      message: "This is a snackbar",
      ...actions,
    },
  },
);
globalThis.dispatchEvent(customEvent);
```
