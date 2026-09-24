# Agent-context spike

Research scaffolding for HVUIKIT-7481 and HVUIKIT-7482. Everything here is
deletable: the parts intended to survive already live in their real homes.

## Where things are

| Lives here (spike, deletable)                            | Lives in the repo proper (durable)                      |
| -------------------------------------------------------- | ------------------------------------------------------- |
| `describe.ts` — extract props, classes, tokens, examples | `packages/core/src/types/doc.ts` — the doc schema       |
| `render.ts` — turn that into agent-facing markdown       | `packages/core/src/*/<C>.doc.ts` — authored guidance    |
| `build-index.ts` — generate the shippable index          | `packages/cli/src/describe.js` — the `describe` command |
| `spike.test.ts` — Tier 1 checks                          |                                                         |
| `baseline/` — HVUIKIT-7482 scorer, scenarios, runs       |                                                         |
| `memory/` — retrievability test over the decision corpus |                                                         |

The split is deliberate. If the approach is adopted, only `build-index.ts` needs
a new home — it becomes a build step in `packages/cli`, since that is where its
output already goes. The rest is research and can be dropped.

## Commands

```bash
npm run spike:describe            # build the index into packages/cli/src/descriptions
npm run spike:test                # Tier 1 checks (needs the index)
npm run spike:score <path>        # count off-system findings in generated code
npx uikit-cli describe <C>        # what an agent actually calls
npx uikit-cli describe <C> --dense
npx uikit-cli init --agents       # bundle the context into a consuming project
```

The index is generated, gitignored, and must be built before the CLI or the tests
will work.

## Reading order

1. `DECISIONS.md` — the six 7481 decisions, with trade-offs and risks. Start here.
2. `baseline/scenarios.md` — how a 7482 run is set up.
3. `baseline/results.md` — the first run, with its limits stated alongside the numbers.
4. `memory/results.md` — whether existing decision memory is retrievable at all.

## What this does not show

The baseline compares generated code against a scorer. It does not show whether
the guidance is _good_, only whether the output stayed on-system and on-version.
Coverage is 24 of 78 components; scenarios touching the rest measure the model
rather than the context.
