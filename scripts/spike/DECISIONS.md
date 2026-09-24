# HVUIKIT-7481 — approach and tools for agent context

Decisions, trade-offs and risks for giving agents enough UI Kit context to write
on-system code. Each decision was tested against this repository rather than
chosen on paper; the evidence is cited so it can be re-checked.

Status of this document: spike output. If the approach is adopted it should move
to `docs/`, under review, next to the code it describes.

---

## 1. How to describe components, machine-readably

**Chosen.** Extract everything derivable from source; author only what is not.

| Field                                  | Source                                                 |
| -------------------------------------- | ------------------------------------------------------ |
| props, types, required, descriptions   | `react-docgen-typescript` on `<C>.tsx`                 |
| style classes and their JSDoc          | `createClasses()` in `<C>.styles.{ts,tsx}`, via TS AST |
| design tokens used                     | `theme.*` references in styles                         |
| examples                               | exported Storybook stories, via TS AST                 |
| usage, best practices, a11y, decisions | hand-written `<C>.doc.ts`                              |

**`react-docgen` does not work here.** Storybook is configured with it
(`.storybook/main.ts:52`) and it returns **0 props** for `HvButton`, because the
props come from TypeScript types it cannot resolve. `react-docgen-typescript`
returns them all. Storybook's own docs tab is likely affected.

**Guidance is colocated** as `<C>.doc.ts`, beside the component, typed as
`HvComponentDoc`. Colocation means an API change and its guidance land in the
same pull request. The first attempt put guidance in `apps/docs` MDX frontmatter;
that splits a single change across two packages and was reverted.

**`.doc.ts`, not `.doc.mjs`.** Astryx (Meta's public design system) uses `.mjs`
with a `@type` JSDoc annotation. In this repo `allowJs` is on but `checkJs` is
unset, so that annotation would be decorative. With `.doc.ts` the schema is
enforced: setting an invalid `status` produces a TS error and fails CI.

**Trade-offs**

- Extraction is free; authoring is not. All 78 core components extract in 41s
  with 0 failures. **24 of 78** have authored guidance. The ratio, not the
  tooling, is the cost.
- Doc files are build-time only. They are not exported and do not ship —
  verified: 0 `.doc.*` entries in `npm pack`.

**Risks**

- **Components inheriting upstream types cannot be described by extraction.**
  `HvGridProps extends Omit<MuiGridProps, …>`, so MUI's entire system surface
  resolves as ours: 115 props, 9% documented, including `sx` — which
  `Grid.tsx:216` destructures and never forwards. Advertising it would make an
  agent _worse_ than no context. Mitigated by `props.only` in the doc schema,
  which states the real surface; a denylist was tried first and does not scale.
- Authored guidance can go stale silently. `Grid.doc.ts` claims `sx` is dropped;
  nothing fails if someone starts forwarding it. See "not decided" below.
- **Authored guidance can also be wrong on arrival.** While reviewing this work I
  asserted, in `Dialog.doc.ts`, that focus moves into the dialog on open and
  returns to the trigger on close. Writing a test for it showed focus lands on
  MUI's `.MuiDialog-container`, outside the `role="dialog"` element — the claim
  was more specific than the behaviour supports, and it was removed. It was
  inferred from knowing MUI rather than checked. Nothing in the pipeline would
  have caught it; only writing the test did.

---

## 2. How agents look up the UI Kit

**Chosen, with the transport deliberately left open.** `uikit-cli describe
<Component>` serves a build-time index; `--dense` gives a token-efficient variant.

Extraction needs TypeScript sources, which are not published, so the CLI cannot
extract at runtime. The index is generated at build time and served — that
constraint shapes the design more than the CLI-vs-MCP question does.

**Trade-offs**

- The whole library is **~40k tokens full, ~8k dense** (of ~120k usable). At 8k,
  bundling everything is affordable, so retrieval is an optimisation rather than
  a requirement. An earlier estimate of "~40 components fit" was wrong.
- For the 54 components without authored guidance, dense output is an import
  line and a props list — information an agent already has from the shipped
  `.d.ts`. The payload is thin for those, which is why the transport choice is
  not urgent.

**Risks**

- **`uikit-cli` is not installed where it is needed.** Neither the scaffolded
  baselines nor the real POC app depend on it, so `npx uikit-cli describe` would
  fetch from npm on every call. Closing this is the next step, not more transport.
- **Version coupling.** An MCP server or a globally-run CLI describes _a_
  version. A product on `v6.x` querying a v7 source gets confidently wrong
  answers. Only bundling at scaffold time keeps context pinned to the installed
  version.

**MCP: not now.** Its value is search over a corpus too large to bundle. At 8k
tokens there is no such corpus. It would earn its keep pointed at the _decision_
memory — migration guide, 19 changelogs, 8112 commits, 1261 PRs — which is
unbounded and currently unindexed.

---

## 3. How agents are set up in a product repo

**Chosen.** Nested `AGENTS.md`: root, `packages/`, `apps/docs/`.

The six files in `.github/instructions/` already held the rules; they were
converted rather than rewritten, and now point at `AGENTS.md` while keeping their
`applyTo` frontmatter so Copilot still scopes correctly. 171 duplicated lines
removed; 0 duplicated rules remain.

**Trade-offs**

- Two files per rule set (the pointer and the canonical source) instead of one.
  Accepted because Copilot needs `applyTo` and `AGENTS.md` is tool-agnostic.

**Risks**

- Nothing verifies the pointers stay valid. Links and anchors were checked once,
  by hand.

---

## 4. Which tooling runs the design-system checks

**Parked.** No consumer yet — the rules to enforce are not written.

Relevant measurement if this restarts: **oxlint 1.63 → 1.82 surfaces ~891
findings** in this repo. Any new rule must start as a warning or be baselined.
oxlint's JS plugin API is still alpha, so ESLint remains the fallback.

---

## 5. Whether design tokens need an exchange format now

**Parked.** TypeScript tokens stay the source. DTCG export only matters for the
Figma contract, which is explicitly post-gate. Recorded, not built.

---

## 6. Whether a maintainer wiki adds value

**Decided: no, for anything the agent work depends on.**

A GitHub wiki is a git repo of markdown, and `AGENTS.md` can link to it — both
true, and Astryx does exactly that. The argument is not technical:

```
pentaho/hv-uikit-react.wiki — 4 pages, 1 commit, last touched 2023-02-03
  Architecture-Document---[Draft].md   still "[Draft]" after 3.5 years
  Definition-of-Done.md
  Github-Actions-Configurations.md
  Home.md
```

That is the measured outcome for this team, not a prediction. Two further
reasons: a wiki has one live version, while this repo maintains `master` and
`v6.x` whose component APIs differ; and it has no PR review or CI.

Version-independent process material (Definition of Done, release process) is
fine where it is. Anything the CLI or retrieval must see belongs in the repo.

**Unrelated but worth acting on:** `Github-Actions-Configurations.md` lists
internal runner IPs and hostnames on a _public_ wiki, and has since 2023.

---

## Not decided

- **How to keep authored claims true.** `migration.md:55` described
  `@pentaho/uikit-config` as public while it was `private: true` — not wrong when
  written, stale when the code moved. Fixed by #5281, but nothing in CI compares
  documentation against behaviour, and the doc files now carry the same exposure.
- **Coverage.** 24 of 78 components have guidance. Below some threshold this
  machinery does not pay for itself, and that threshold is still unknown — the
  first baseline run did not isolate it, because every finding it produced was
  version drift rather than missing description.
- **Whether any of this changes what an agent writes.** That is HVUIKIT-7482.
  Until it runs, the supportable claim is that the `sx` trap now reaches the
  agent — not that the agent heeds it.
