# Retrievability test — HVUIKIT-7481

Five questions the team actually gets asked. Each names the answer we expect and
where that answer lives today, so a run can be scored rather than eyeballed.

A miss is one of two things (Kavcic, _The Design System Advantage Is Memory_):
the **document is missing**, or the **document exists but the language is too vague
to retrieve**. Record which — they need different fixes.

| #   | Question                                               | Expected answer                                                                | Where it lives today                                                                               |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 1   | Can I pass `sx` to `HvGrid`?                           | No — accepted by the types, destructured and dropped. Use `style`/`className`. | Nowhere before this spike. Now: `packages/core/src/Grid/Grid.doc.ts`. Ground truth: `Grid.tsx:216` |
| 2   | Why was `HvSimpleGrid` removed?                        | Removed in v7; use utility-grid layouts (`grid grid-cols-2 md:grid-cols-4`).   | `apps/docs/src/content/docs/migration.md` §"Components"                                            |
| 3   | How do I size a grid item now that `xs`/`sm` are gone? | Use `size={{ xs: 12, sm: 6 }}`.                                                | `migration.md` §12                                                                                 |
| 4   | Why is `@pentaho/uikit-config` not published?          | It is `private: true`, so lerna cannot version it.                             | Nowhere. Git history only.                                                                         |
| 5   | Which components must not be used for navigation?      | `HvButton` is for in-place actions; use a link for navigation.                 | Nowhere before this spike. Now: `packages/core/src/Button/Button.doc.ts`.                          |

## Scoring

For each question record: **hit** (top-3 result contains the answer),
**vague** (right document retrieved, answer not stated), or **missing**
(no document contains the answer).

Questions 4 is expected to MISS — it is the control. If a run "answers" it,
the retrieval is hallucinating rather than retrieving.
