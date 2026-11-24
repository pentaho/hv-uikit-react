# AGENTS.md

This is a standalone app built with React, Vite and HV UI Kit (no App Shell).

## Commands

- `npm run dev`: run the app on a local dev server.
- `npm run build`: production build.
- `npm test -- --run`: unit tests (Vitest), once.
- `npm run check`: format, types and lint, with the UI Kit design rules. Run it before you finish and fix what it reports.
- `npm run shots`: with `npm run dev` running, screenshot the pages listed in `review/shots.json` into `review/` (`npx --no-install uikit-cli shots --help`); look at each before you finish.

## Structure

- `src/routes.tsx`: the routes; `src/pages/<Page>`: one folder per page; `src/pages/layout`: the header and navigation.
- `src/App.tsx`: the providers (UI Kit theme, translations, router).
