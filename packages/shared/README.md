# @hitachivantara/uikit-react-shared

The package provides shared **React contexts** for the UI Kit. It allows UI Kit components to share state (e.g. active theme) even if they are built with different versions of the UI Kit or are not using the same `HvProvider` instance.

This package is intended to be used in embedded scenarios, particularly when using the App Shell framework. In these cases, declare the `@hitachivantara/uikit-react-shared` package as external in your bundler configuration. An ESM bundle is provided in the package, which can be deployed, and the importmap can be configured to point to it.

For regular usage of the UI Kit, you don't need to know about this package. All the contexts and types are re-exported from the core package.
