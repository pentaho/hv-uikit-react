# Agent evals

Does the UI Kit's agent tooling help a coding agent turn a request into a working, acceptable Pentaho plugin, and at
how much effort? Each task is run with the tooling (`full`: the plugin template plus `uikit-tools init`) and without it
(`bare`: the same template with the tooling taken out, checked gone before the agent starts), several times each,
since agents vary. Repo-only: not published.

- `tasks/<id>.json`: the request in an admin's words, what a reviewer checks, and the screenshots to take.
- `run.ts`: one trial. It creates the plugin, sets up the condition, runs Claude Code headless on the request in a
  fresh HOME, then the **gate** (the plugin's own `check`, `build` and `package`, and its page coming up) and the
  review screenshots. Writes `result.json`, with the request the agent was given, its effort, and the screenshots the
  script couldn't take. Exit 3 is an infrastructure failure (install, network, login): rerun.
- `grade.ts`: the **blind grader**. Claude reads each trial's screenshots, from a folder that says nothing of the
  condition, and judges as a Pentaho designer would whether the plugin is an acceptable answer to the request it was
  given: the task's checklist, as far as the request asks for it, and four design standards from the UI Kit rules
  (sections, dialogs, form width, input and error handling). It's told which screenshots are missing, so a gap alone
  isn't a failure. Check it against a person on a few trials.
- `report.ts`: per task and arm, the gate and acceptable as counts (acceptable: the gate passed and the grader accepts
  it), why each other run isn't, and the
  effort per run (output and thinking tokens, context re-read and written, turns, minutes) with full ÷ bare. Then
  verdicts by fixed rules: a difference in acceptable needs 3 or more graded runs per arm on every task, a pooled
  one-sided Fisher p below 0.05 and no task going the other way; one in effort, ranges that don't overlap. Tokens are
  reported by kind, never added up (most are cheap cache re-reads), and in no currency.

| Task              | What it exercises                                                              |
| ----------------- | ------------------------------------------------------------------------------ |
| `users`           | A list with search, a filter, edit in a dialog, deactivate one or several      |
| `data-connection` | Grouped settings, errors on save, a connection test that can fail, saved state |
| `report-usage`    | KPIs against last month, views per day, top and unopened reports               |

The guides were tuned against these three: a claim that the tooling helps on new work needs new tasks.

## Run

Needs Node, npm and Docker (Docker Desktop, Colima or Linux). The agent runs with `bypassPermissions`, so only ever in
the trial container. The container runs as uid 1000 and writes the trial into `.evals/`: on Linux that folder must be
writable by uid 1000 (Docker Desktop and Colima map the user for you). A trial stopped at its time limit counts as the
agent's run, not an infrastructure failure.

```sh
packages/cli/evals/setup.sh                       # build, pack this branch's packages, build the image
export CLAUDE_CODE_OAUTH_TOKEN=…                  # a token made for the evals: claude setup-token
packages/cli/evals/batch.sh users                 # a smoke test: one task, one run per arm (~15 min)
RUNS=5 packages/cli/evals/batch.sh                # a first read: all three tasks, 5 runs per arm (~2 h)
```

Until the packages are released, `setup.sh` packs them into `packs/` (git-ignored), which ships in the image: each
trial creates the plugin with the packed CLI and installs every `@pentaho/*` from its tarball (`file:` plus
`overrides`). Nothing listens on the host. Once they're released, `setup.sh --published` builds the image without
packs, and the trials install from npm like any user.

`batch.sh` puts each trial in `.evals/<task>-<arm>-<n>` (the plugin, `transcript.jsonl`, `result.json`, `review/`),
grades them with `claude` in a fresh HOME, and prints the report. A new batch replaces the trials of the same names, so
move a batch you want to keep into a folder of its own first; `report.ts` reads any folder of trials. Under
Colima, oxlint needs `colima ssh -- sudo sysctl -w vm.overcommit_memory=1` (it resets when Colima restarts); `setup.sh`
warns without it.

## How many runs

Effort differs by a lot between the arms, and each run gives a number: 3 runs per arm whose ranges don't overlap
already show it, 5 settle it. Acceptable is a yes or no per run, so it needs more: with the report's rule, a real gap
of 80% against 40% is found 35% of the time at 3 runs per arm per task, 60% at 5 and 84% at 8. Below 8, "no difference
shown" mostly means the runs couldn't tell. Before trusting the grader, a person checks it on a few trials (adding
`"human": { "acceptable": 1 or 0 }` to their result.json); the report counts the agreement. Each trial is capped at
`MAX_TURNS` (default 150) and 60 minutes.

## Tests

`npx vitest run evals` in `packages/cli`.
