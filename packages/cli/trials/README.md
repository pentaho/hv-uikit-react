# Agent trials

Real requests given to a coding agent with the `pentaho-plugin` and `pentaho-plugin-package` skills, then checked: does
a request become a running, packaged plugin, in how long and at what cost. Repo-only: not published with the CLI.

- `tasks/<id>.json`: the request, verbatim; its shape (`list`, `form` or `detail`); an optional approved `design`
  folder; what the checker expects (`views`, the `states` that need a screenshot, the `samples` states, the
  `components`) and what the design review looks for (`review`).
- `run.ts`: runs one trial unattended. `check.ts`: the checker. `screenshot.ts`: the screenshot helper the agent is
  told about. `RESULTS.md`: one row per run.

| Task               | Shape  | Design |
| ------------------ | ------ | ------ |
| `connections-list` | list   | no     |
| `scheduled-jobs`   | list   | no     |
| `connection-new`   | form   | no     |
| `schedule-health`  | detail | yes    |

## Run a trial

`run.ts` starts Claude Code with `--permission-mode bypassPermissions`, so the agent runs any command without
asking, not only inside its temp folder. Run trials in a VM, container or disposable account, and cap the spend with
`--budget`.

1. Optional, to try what's on a branch: a local registry with this repo's packages. Publishing a version twice fails,
   so wipe the storage each time (`run.ts` gives every run a fresh npm cache).

   ```sh
   npm run build                                   # at the repo root
   rm -rf /tmp/uikit-trials-registry /tmp/uikit-trials-packs
   npx --yes verdaccio@6.11.3 --config packages/cli/trials/verdaccio.yaml   # in its own terminal: localhost:4873
   for p in styles utils shared core uno-preset config tools cli app-shell-services app-shell-shared \
     app-shell-events app-shell-i18next app-shell-navigation app-shell-ui app-shell-vite-plugin; do
     npm pack -w packages/$p --pack-destination /tmp/uikit-trials-packs   # the e2e script's PACKED list
   done
   for t in /tmp/uikit-trials-packs/*.tgz; do
     npm publish "$t" --registry http://localhost:4873 --//localhost:4873/:_authToken=trial
   done
   ```

   It serves `@pentaho/*` only from what's published there, everything else from npm.

2. Run the agent, from the repo root (`--dry-run` prints the commands; about 15 minutes and a few dollars otherwise):

   ```sh
   node packages/cli/trials/run.ts schedule-health --model claude-opus-5-5 [--registry http://localhost:4873] [--budget 10]
   ```

   In a fresh temp folder, it copies the task's design in as `design/`, runs
   `npx @pentaho/uikit-tools init --agents claude` for the skills, then `claude -p` headless with the request verbatim,
   one line saying no one will answer questions, and the screenshot helper's path. The transcript goes to
   `<folder>/transcript.jsonl`; then it runs the checker.

3. The checker (also by hand: `node packages/cli/trials/check.ts <task> <plugin dir> --transcript <jsonl>`) runs the
   plugin's `npm run check`, its tests, `uikit-tools lint src` and `npm run build`; checks `plugin.json`, the samples,
   the components, `<id>.zip` (as `uikit-cli package` writes it, after the last change under `src/`) and a real PNG
   `review/<nn>-<state>.png` per required state. From the transcript (Claude Code's stream-json, or its session file
   under `~/.claude/projects/`) it takes the date, minutes, model, tool calls, tokens and cost, and whether the agent
   ran `npm run check` and took screenshots; `--minutes`, `--calls`, `--tokens`, `--cost` and `--agent` override them.
   It writes `<plugin dir>.trial.json` and exits 1 if a check failed.

4. Review the screenshots against the task's numbered `review` list (and the design, if any), then log the run: the
   check command `run.ts` printed, plus `--met 1,2,4 --review "<verdict>" --findings "<…>" --log`, appends the row to
   `RESULTS.md`.

## Screenshots

`node packages/cli/trials/screenshot.ts shots.json --out review` takes every shot in one browser session (Playwright,
from the repo). `shots.json`:

```json
[
  { "name": "01-list", "url": "http://localhost:5173/connections" },
  {
    "name": "02-delete",
    "url": "http://localhost:5173/connections",
    "width": 390,
    "steps": [
      { "click": { "role": "checkbox", "name": "Select row" } },
      { "click": "Delete" },
      { "fill": ["Name", "x"] },
      { "press": "Escape" },
      { "scroll": "End" }
    ]
  }
]
```

Each waits for the page's `h1`; `click` takes the exact text or a role and accessible name, `fill` the exact label.
The shot is the full height, the App Shell's inner scrolling container included.

## Tests

`npx vitest run trials` (in `packages/cli`) runs the checker on a tiny fake plugin and an anonymised transcript, and the
runner's argument handling.
