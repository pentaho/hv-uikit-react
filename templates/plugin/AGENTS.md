# AGENTS.md

This is a Pentaho plugin's UI, built with React, Vite and HV UI Kit in the App Shell.

## Commands

- `npm run dev`: run the plugin in a local App Shell, on its sample data (`samples.json`).
- `npm run build`: production build.
- `npm test -- --run`: unit tests (Vitest), once.
- `npm run check`: format, types and lint, with the UI Kit design rules. Run it before you finish and fix what it reports.
- `npm run package`: build, check and zip the plugin for a Pentaho server.
- `npm run shots`: with `npm run dev` running, screenshot the views listed in `review/shots.json` into `review/` (`npx --no-install uikit-cli shots --help`).

## Structure

- `plugin.json`: the plugin's id, title, menu entry and views; the one place they're written.
- `src/pages/<view id>.tsx`: one page per view, inside `ViewLayout` (`src/components/ViewLayout.tsx`).
- `src/providers/Provider.tsx`: wraps every view; add shared context here.
- `src/lib/api.ts`: the Pentaho server's APIs; add each call's response to `samples.json`.
