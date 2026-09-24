# Baseline app — HVUIKIT-7482

The target an agent writes into during a baseline run. Deliberately minimal: it
provides the UI Kit dependencies and nothing else, so that what lands in
`src/scenarios/` is the agent's output rather than a reaction to existing code.

It is not in the workspace, not built by CI, and not published.

## Running an arm

1. Empty `src/scenarios/`.
2. Give the agent one scenario from `../scenarios.md`, with the context for the
   arm under test (none / dense / lookup).
3. Have it write the component into `src/scenarios/<n>-<name>.tsx`.
4. Score it:

```bash
npm run spike:score scripts/spike/baseline/app/src/scenarios
```

Record the total and the per-category split in `../results.md`. The split is the
interesting part: a drop in `raw-element` with no drop in `stale-api` means
something different from the reverse.
