# Workflow Rules

## Component contracts

Before using a component, look it up: `npx --no-install uikit-tools info <Component>`, or several at once (`info HvTable HvPagination HvBulkActions`); `components` lists them all. Check its props, variants, states and don'ts rather than guessing.

## Validation

Before finishing, run `npx --no-install uikit-tools lint <paths>` and the project's checks (`npm run check`), fix what they report, and rerun them. Lint doesn't check layout, component choice, confirmations or data states: screenshot every page and state (`npm run shots`, with `npm run dev` running) and look at each.
