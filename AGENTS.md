# UI Kit

React component library for Pentaho, published under the `@pentaho/*` scope.
npm workspaces + lerna-lite, independent versioning.

## Looking things up

```bash
npx uikit-cli describe <Component>   # API, tokens, examples, usage guidance
npx uikit-cli describe <Component> --dense   # token-efficient variant
npx uikit-cli describe --list        # every component in the index
npx uikit-cli init --agents          # write this context into a product repo
```

Use this before writing UI Kit code. It is generated from the source, so it does not
drift, and it carries gotchas that the type signatures do not — for example `HvGrid`
accepts `sx` and silently drops it.

## Layout

| Path                               | What                                 |
| ---------------------------------- | ------------------------------------ |
| `packages/core`                    | Components (`HvButton`, `HvGrid`, …) |
| `packages/styles`                  | Theme and design tokens              |
| `packages/viz`, `packages/widgets` | Charts, composite widgets            |
| `packages/app-shell-*`             | Application shell                    |
| `packages/cli`                     | `uikit-cli`                          |
| `packages/config`                  | Shared prettier / oxlint / tsconfig  |
| `apps/docs`                        | Documentation site (nextra)          |

Nested `AGENTS.md` files add rules for `packages/` and `apps/docs`.

## Code Review

- Ensure new features and fixes are covered by tests. Skip features that are purely visual, as they're tested by an external tool (Chromatic).
- Ensure the Pull Request title uses Conventional Commits and is descriptive of the changes made.

## Checks

```bash
npm run lint && npm run typecheck && npm test && npm run prettier
```

Migration guidance for v6 → v7 lives in `apps/docs/src/content/docs/migration.md`.
