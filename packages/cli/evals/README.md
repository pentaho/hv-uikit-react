# Agent evals

Does the UI Kit's agent tooling help a coding agent turn a request into a working, acceptable Pentaho plugin, and at
what cost? Each task is run with the tooling (`full`: the plugin template plus `uikit-tools init`) and without it
(`bare`: the same template with the tooling taken out, checked gone before the agent starts), several times each,
since agents vary. Repo-only: not published.

- `tasks/<id>.json`: the request in an admin's words, what a reviewer checks, and the screenshots to take.
- `run.ts`: one trial. It creates the plugin, sets up the condition, runs Claude Code headless on the request in a
  fresh HOME, then the **gate** (the plugin's own `check`, `build` and `package`, and its page coming up) and the
  review screenshots. Writes `result.json`. Exit 3 is an infrastructure failure (install, network, login): rerun.
- `grade.ts`: the **blind grader**. Claude reads each trial's screenshots, from a folder that says nothing of the
  condition, and judges whether it's an acceptable answer to the request. Check it against a person on a few trials.
- `report.ts`: per task and arm, the gate, acceptable, pass^k (every run acceptable) and cost, then full minus bare.

| Task              | What it exercises                                                              |
| ----------------- | ------------------------------------------------------------------------------ |
| `users`           | A list with search, a filter, edit in a dialog, deactivate one or several      |
| `data-connection` | Grouped settings, errors on save, a connection test that can fail, saved state |
| `report-usage`    | KPIs against last month, views per day, top and unopened reports               |

The guides were tuned against these three: a claim that the tooling helps on new work needs new tasks.

## Run

Needs Node, npm and Docker (Docker Desktop, Colima or Linux). The agent runs with `bypassPermissions`, so only ever in
the trial container.

```sh
packages/cli/evals/setup.sh                       # build, pack this branch's packages, build the image
export CLAUDE_CODE_OAUTH_TOKEN=…                  # a token made for the evals: claude setup-token
packages/cli/evals/batch.sh users                 # a smoke test: one task, one run per arm (~15 min, $2–4 on Sonnet)
RUNS=3 packages/cli/evals/batch.sh                # a claim: all three tasks, 3 to 5 runs per arm
```

Until the packages are released, `setup.sh` packs them into `packs/` (git-ignored), which ships in the image: each
trial creates the plugin with the packed CLI and installs every `@pentaho/*` from its tarball (`file:` plus
`overrides`). Nothing listens on the host. Once they're released, `setup.sh --published` builds the image without
packs, and the trials install from npm like any user.

`batch.sh` puts each trial in `.evals/<task>-<arm>-<n>` (the plugin, `transcript.jsonl`, `result.json`, `review/`),
grades them with `claude` in a fresh HOME, and prints the report: counts per arm, since a few runs are noisy. Under
Colima, oxlint needs `colima ssh -- sudo sysctl -w vm.overcommit_memory=1` (it resets when Colima restarts); `setup.sh`
warns without it.

## Tests

`npx vitest run evals` in `packages/cli`.
