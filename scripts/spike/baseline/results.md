# HVUIKIT-7482 — baseline, first run

Run date: 2026-09-23. Model: Claude Sonnet. One generation per cell.
Scored with `npm run spike:score`; raw output kept under `runs/` so the numbers
can be re-checked.

## Result

| Scenario              | arm 1 · no context | arm 2 · dense context |
| --------------------- | ------------------ | --------------------- |
| 1 · form panel        | 1                  | 0                     |
| 2 · responsive layout | 10                 | 0                     |
| 6 · migration         | 3                  | 0                     |
| **total**             | **14**             | **0**                 |

By category:

| Category      | arm 1 | arm 2 |
| ------------- | ----- | ----- |
| `stale-api`   | 14    | 0     |
| `raw-element` | 0     | 0     |
| `raw-color`   | 0     | 0     |
| `raw-spacing` | 0     | 0     |
| `unsupported` | 0     | 0     |

## What the numbers say

**Every finding was `stale-api`.** Not one `raw-element`, `raw-color` or
`raw-spacing`. Without any context the agent still reached for `HvGrid` and
`HvButton` rather than `<div>` and `<button>`, and still used tokens rather than
hex. What it got wrong was the _version_: `@hitachivantara/*` imports, and the
`xs`/`sm` breakpoint props that v7 removed.

That distinction is the point of separating the categories, and it reframes the
problem. The agent does not lack knowledge of the UI Kit — it has **v6**
knowledge from training data, stated confidently. Component descriptions address
missing context; this baseline is dominated by _wrong_ context, which is what the
migration guide and the `decisions` blocks in the doc files address.

**The migration scenario is the clearest case.** Asked to update a v6 snippet,
arm 1 dropped `item` and `zeroMinWidth` but kept the `@hitachivantara` import and
the `xs`/`sm` props — a partial migration that compiles against the wrong scope.
Arm 2 produced the correct result including `zeroMinWidth` → `style={{ minWidth: 0 }}`.

## Limits — read before quoting the numbers

- **n = 1 per cell.** Three scenarios, one model, one generation each. This is a
  starting point, not a measurement. Repeat runs will vary.
- **Arm 2's context contained the answers.** The dense block for `HvGrid` states
  the `size` migration and the removed `zeroMinWidth` explicitly. Scoring 0 shows
  the agent _uses_ supplied context; it does not show it would generalise to
  components whose doc files say less.
- **The scorer only sees what it has rules for.** It does not judge whether the
  result is good UI, only whether it stayed on-system and on-version.
- **The demo app is empty.** No existing code to imitate, so this is cleaner than
  a real repository. Today's real code scores: `apps/default-app` 19,
  `apps/app` 3, `generative-dashboards` POC 13.
- **Arm 3 (lookup via CLI) was not run.** Arms 1 and 2 bracket the range; arm 3
  tests whether an agent will _choose_ to look something up, which is a different
  question.

## Reproducing

```bash
npm run spike:describe
# generate into scripts/spike/baseline/runs/<arm>/ per scenarios.md
npm run spike:score scripts/spike/baseline/runs/<arm>
```

The generating agent must be a fresh session. An agent that has seen this
repository's context cannot produce a valid arm 1.
