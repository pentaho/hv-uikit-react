# Navigation

The **App Shell** implements the UI Kit's Navigation System, comprised of a a top horizontal navigation ([`HvHeader`](/components/header)) and a left-side [`HvVerticalNavigation`](/components/vertical-navigation) bar, and the menu items are defined in the **App Shell** configuration file, under the [`menu`](./configuration#menu) property.

Example: Add the following menu item to your configuration:

```tsx
menu: [
  {
    label: "Hello",
    target: "/hello",
  },
];
```

Check the [configuration file reference](./configuration#menu) for more information on how to build the _Product's_ navigation menu.

You can also enable the `autoMenu` option that when set, will have the plugin trying to automatically add the configured views as menu entries. Any menu defined in the App Shell config file will be overwritten.
For more details refer to the [plugin documentation](https://github.com/pentaho/hv-uikit-react/tree/master/packages/app-shell-vite-plugin#readme).

## Conditional Navigation with Conditions

Menu items support [conditions](./configuration#conditions) to control their visibility based on runtime criteria. Menu configuration elements with an associated target view are implicitly subject to any conditions declared by the view's configuration element, which are composed with any conditions locally declared in the menu configuration element (implementing an AND logic where all conditions must be met for the menu to be visible).

```tsx
menu: [
  {
    label: "Admin Panel",
    target: "/admin",
    // This menu will be subject to any conditions from the /admin view
    // You can also add explicit menu-specific conditions:
    conditions: [
      {
        bundle: "@hv-apps/my-app/conditions/useShowInMenu.js",
      },
    ],
  },
];
```

This ensures that menu items are automatically excluded from the configuration when their corresponding views are inaccessible, maintaining a consistent user experience. Additionally, a menu is excluded if its parent menu is excluded, and a menu without a target view is excluded if it has no visible child menus.

## Navigation between Views

Each _View_ doesn't know the final route path it will be mounted at, as it is defined by the application that integrates it. Most noticeable, the _View_ doesn't know the path of other _Views_ it wants to navigate to.

To allow _Views_ to navigate to other _Views_, the **App Shell Navigation** provides a `useHvNavigation` hook that returns a `navigate` function. The hook also returns `getViewRoute` function, that receives a _View_'s bundle id and optional parameters to compose a returning URL.

Example: Add the following code to `pages/Hello.tsx`:

```tsx
import { Link } from "react-router-dom";
import { useHvNavigation } from "@hitachivantara/app-shell-navigation";

export default function Hello() {
  const { getViewRoute } = useHvNavigation();

  const routeUrl = getViewRoute({
    viewBundle: "/pages/Persons/Detail",
    pathParams: { id: 123 },
  });

  return (
    <div>
      <h1>Hello World!</h1>
      <Link to={routeUrl}>Go to Person 123</Link>
    </div>
  );
}
```

Check the [API Reference](./api-reference#navigation) for more information and other navigation related functions.

### Generic development guidelines

- You can pass state from a _View_ to another using the `options.state` property of the `navigate` function. This state can be retrieved by the target _View_ using the `useLocation` hook from `react-router-dom`. Use it only for contextual information that is not to be persisted in the URL. For other cases, when the state is to be persisted in the URL and to survive a page refresh, use the query string.
- Persist in-page state, like filters on a list, using the query string. This allows the user to share the current page with others, and to bookmark it. Use the `options.replace` property to update the query string without adding a new entry to the history.
- Modal dialogs are not part of the navigation tree. As such, opening and closing a modal dialog should not be triggered by, or trigger, a navigation event. Routes are reserved for page wide updates.
- Don't rely on `history.goBack()`/`history.go(-1)` as the user may have navigated directly to the current page. You can persist state to the location when navigating and use that to go back to the previous page, or to a default when the user navigates directly to the current page.
- The hash fragment can be used for in-page navigation, like jumping to a section on a page.

### More navigation

Besides navigation between _Views_, one can use the [**App Shell** built-in actions](./header-actions#built-in-header-actions) to navigate to:

- multiple conceptually separate _Products_;
- a new tab with the configured url.
