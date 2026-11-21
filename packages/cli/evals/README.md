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

1. A local registry with this branch's packages (a version publishes once: wipe the storage each time):

   ```sh
   npm run build
   rm -rf /tmp/uikit-evals-registry /tmp/uikit-evals-packs
   npx --yes verdaccio@6.11.3 --config packages/cli/evals/verdaccio.yaml   # its own terminal: localhost:4873
   for p in styles utils shared core viz widgets uno-preset config tools cli app-shell-services app-shell-shared \
     app-shell-events app-shell-i18next app-shell-navigation app-shell-ui app-shell-vite-plugin; do
     npm pack -w packages/$p --pack-destination /tmp/uikit-evals-packs
   done
   for t in /tmp/uikit-evals-packs/*.tgz; do
     npm publish "$t" --registry http://localhost:4873 --//localhost:4873/:_authToken=evals
   done
   ```

   `@pentaho/uikit-tools` and `@pentaho/uikit-cli` are `private`: publish a copy of each tarball without the flag.

2. The image. The agent runs with `bypassPermissions`, so only ever in the container. Under Colima, oxlint needs
   `colima ssh -- sudo sysctl -w vm.overcommit_memory=1` (it resets when Colima restarts).

   ```sh
   docker build -f packages/cli/evals/Dockerfile -t uikit-evals packages/cli
   ```

3. Three runs per task and arm (about 10 minutes and $1–2 each on Sonnet; two at a time at most), then grade and
   report. Use a token made for the evals (`claude setup-token`); it's masked in the transcript.

   ```sh
   for n in 1 2 3; do for task in users data-connection report-usage; do for condition in full bare; do
     mkdir -p ".evals/$task-$condition-$n"
     docker run --rm --cpus 2 --memory 2800m -e CLAUDE_CODE_OAUTH_TOKEN \
       -v "$PWD/.evals/$task-$condition-$n":/trial -v uikit-evals-npm:/tmp/npm-cache uikit-evals \
       "$task" --model claude-sonnet-5-5 --condition "$condition" --dir /trial \
       --registry http://host.docker.internal:4873 --budget 10
   done; done; done
   node packages/cli/evals/grade.ts .evals/*/
   node packages/cli/evals/report.ts .evals
   ```

## Tests

`npx vitest run evals` in `packages/cli`.
