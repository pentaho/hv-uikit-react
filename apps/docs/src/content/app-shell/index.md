# App Shell

The **App Shell** is a [micro-frontend](https://micro-frontends.org) framework for building applications.  
Together with the **UI Kit**, it aims to provide a consistent user experience across applications by adopting design patterns and addressing architectural key concepts of **composability** and **portability**.

At its core, **App Shell** consists of:

1. A [Vite](https://vite.dev) [plugin](https://github.com/pentaho/hv-uikit-react/tree/master/packages/app-shell-vite-plugin) that enhances development and handles building of the micro-frontend [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
2. Routing utilities and configuration, built on top of [React Router](https://reactrouter.com), that bring the application modules together.
3. A collection of common UI patterns such as the navigation system (header, vertical navigation) and notifications.

## App Shell Packages

The **App Shell** comprises the following packages:

- [`@pentaho/app-shell-events`](https://npm.im/@pentaho/app-shell-events)
- [`@pentaho/app-shell-i18next`](https://npm.im/@pentaho/app-shell-i18next)
- [`@pentaho/app-shell-navigation`](https://npm.im/@pentaho/app-shell-navigation)
- [`@pentaho/app-shell-services`](https://npm.im/@pentaho/app-shell-services)
- [`@pentaho/app-shell-shared`](https://npm.im/@pentaho/app-shell-shared)
- [`@pentaho/app-shell-ui`](https://npm.im/@pentaho/app-shell-ui)
- [`@pentaho/app-shell-vite-plugin`](https://npm.im/@pentaho/app-shell-vite-plugin)

Each package plays a specific role in enabling modularity, consistent layout, and runtime integration of independently deployed frontend modules.
