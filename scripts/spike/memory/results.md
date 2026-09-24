# Retrievability test — first run

Corpus: 31 files, 1505 lines (migration guide, changelogs, instruction files,
AGENTS.md, the four anchor component pages). Generated API descriptions excluded
on purpose — the question is whether our _decisions_ are findable.

Instrument: keyword co-occurrence. Weaker than the hybrid (BM25 + vector + rerank)
setup QMD provides, so treat these as a floor: hybrid retrieval would find more,
but it cannot find what was never written down.

| #   | Question                             | Before spike             | After spike           |
| --- | ------------------------------------ | ------------------------ | --------------------- |
| 1   | Can I pass `sx` to `HvGrid`?         | **missing**              | hit — `Grid.doc.ts`   |
| 2   | Why was `HvSimpleGrid` removed?      | hit — `migration.md`     | hit                   |
| 3   | How do I size a grid item now?       | hit — `migration.md` §12 | hit                   |
| 4   | Why is `uikit-config` not published? | **wrong**                | resolved — see below  |
| 5   | Is `HvButton` for navigation?        | **vague**                | hit — `Button.doc.ts` |

## Findings

**Q4 caught a real contradiction, since resolved.** At the time of the run,
`migration.md:55` listed `@pentaho/uikit-config` as _"Renamed, public"_ while the
package was `private: true` and could not be published. An agent retrieving that line
would have got a confident, wrong answer — Kavcic's "partial context creates expensive
confidence", reproduced exactly.

Resolved by #5281, which flipped `private` to `false`; the line is now accurate. The
failure mode matters more than the instance: the documentation was not wrong when
written, it went stale when the code changed underneath it. Nothing in CI compares the
two — which is the gap this control question was designed to expose, and it is still open.

**Q5 was a false positive before the spike.** The only match was a table row about
`@pentaho/app-shell-navigation` — the word "navigation" next to the word "HvButton",
with no answer. Right document, wrong reason.

**Q1 and Q5 only became answerable because we wrote them down.** Both are properties
of the code that extraction cannot produce. This is the invisible-column argument in
miniature: two of five questions the team actually asks were unanswerable from a
corpus that already contained a migration guide, 19 changelogs and 6 instruction files.

**The corpus is small.** 1505 lines. The real decision memory is 8112 commits and
1261 merged PRs, none of it indexed. That is the next thing to test, and the reason
to run this again with QMD rather than grep.

## Next

1. Fix `migration.md:55` — it is actively misleading.
2. Re-run with QMD (`npx @tobilu/qmd`) over the same corpus to measure what hybrid
   retrieval adds on top of keyword matching.
3. Extend the corpus with PR bodies and re-score. If commit history is retrievable,
   the invisible column is mostly already written — just not indexed.
