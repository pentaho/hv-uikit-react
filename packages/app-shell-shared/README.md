# @hitachivantara/app-shell-shared

App Shell Shared. Support package for shared functionality.

## Overview

This package provides shared React contexts for the App Shell. It allows embedded views and components to share state (e.g. access the app shell configuration).

It should be declared as external in your bundler configuration. An ESM bundle is provided in the package, which can be deployed, and the importmap can be configured to point to it.

For regular usage of the App Shell, you don't need to know about this package.
