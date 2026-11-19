# AGENTS.md

This app runs in the App Shell, built with React, Vite and HV UI Kit.

## Commands

- `npm run dev`: run the app in a local App Shell.
- `npm run build`: production build.
- `npm test -- --run`: unit tests (Vitest), once.
- `npm run check`: format, types and lint, with the UI Kit design rules. Run it before you finish and fix what it reports.

## Structure

- `src/pages/<Page>/index.tsx`: one folder per view; the App Shell gives each its route and menu entry.
- `src/providers/Provider.tsx`: wraps every view (translations); add shared context here.
- `app-shell.config.ts`: the app's name, header and shell settings.
