# UI Kit App

An app in the App Shell, built with React and HV UI Kit. Each folder in `src/pages` is a view, with its route and menu entry (`app-shell.config.ts` for the rest).

```sh
npm install
npm run dev     # the app in a local App Shell
npm run check   # format, types and lint, with the UI Kit design rules
npm test        # unit tests
```

For coding agents: `npx --no-install uikit-tools init` points them at the UI Kit's design rules and lookups.
