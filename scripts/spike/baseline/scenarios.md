# HVUIKIT-7482 — baseline scenarios

Six tasks to give an agent, scored with `npm run spike:score`. They are chosen so
that an off-system answer is _plausible_ — a scenario the agent cannot get wrong
measures nothing.

## Components under test

The same four carrying authored guidance, so there is something for context to
convey. Each is picked for a distinct failure mode.

| Component  | Failure mode it probes                                   |
| ---------- | -------------------------------------------------------- |
| `HvButton` | many props; a raw `<button>` is the obvious wrong answer |
| `HvGrid`   | accepts `sx` and drops it; v6 `item`/`xs` muscle memory  |
| `HvSelect` | confusable with `HvDropDownMenu`                         |
| `HvDrawer` | composed from Dialog parts; closing is async             |

## Arms

Run every scenario three times, changing only the context:

1. **none** — no UI Kit context beyond what the model already knows
2. **dense** — `uikit-cli describe --dense` output for the four components (~2KB)
3. **lookup** — `AGENTS.md` present and the CLI available to call

Arm 1 is the baseline the ticket asks for. Arms 2 and 3 are what step 5 compares
against; recording them now costs little and avoids re-running arm 1 later.

## Scenarios

1. **Form panel.** A settings panel with a labelled text field, a dropdown of
   three options, and Save/Cancel actions.
   _Off-system tells:_ raw `<input>`/`<select>/<button>`, hardcoded padding.

2. **Responsive layout.** A three-column layout collapsing to one on small
   screens, with 24px gutters.
   _Off-system tells:_ `sx` on `HvGrid`, `item`/`xs`/`sm`, raw px.

3. **Side panel.** A drawer opening from the right with a title, body and a close
   action, plus a test asserting it closes.
   _Off-system tells:_ hand-rolled overlay; a test asserting the drawer is gone
   synchronously after `onClose`.

4. **Status colours.** A list where each row shows success, warning or error.
   _Off-system tells:_ literal hex instead of semantic tokens.

5. **Icon-only toolbar.** Four icon buttons in a row.
   _Off-system tells:_ raw `<button>`, missing `aria-label`.

6. **Migration.** Given a v6 snippet using `@hitachivantara/*`, `HvGrid item
xs={12}` and `zeroMinWidth`, update it to v7.
   _Off-system tells:_ anything the scorer reports as `stale-api`.

Scenario 6 is the control for the distinction the scorer draws: it measures
_wrong_ context from training data, not _missing_ context. Improvements there
come from the migration guide, not from component descriptions, and conflating
them would overstate what this work achieves.

## Recording a run

```bash
npm run spike:describe                      # build the index
npm run spike:score <generated-code-dir>    # per arm, per scenario
```

Record per scenario and arm: total findings and the per-category split. The
split matters more than the total — a drop in `raw-element` and no drop in
`stale-api` is a different result from the reverse.

## Known limits

- **The demo app is cleaner than product code.** The baseline is a floor, not an
  absolute. For comparison, today's real code scores: `apps/default-app` 19,
  `apps/app` 3, and the `generative-dashboards` POC 13.
- **The scorer only sees what it has rules for.** It does not judge whether the
  result is good UI — only whether it stayed on-system.
- **Only 24 of 78 components have guidance.** Arms 2 and 3 can only help on
  those; a scenario touching anything else measures the model, not the context.
