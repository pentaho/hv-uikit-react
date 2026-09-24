#!/usr/bin/env bash
# Assemble the retrievable corpus for the memory test.
# Everything here is text a person wrote; generated API descriptions are excluded
# on purpose — the question is whether our *decisions* are findable.
set -euo pipefail
OUT="${1:-/tmp/uikit-memory-corpus}"
rm -rf "$OUT"; mkdir -p "$OUT"

cp apps/docs/src/content/docs/migration.md            "$OUT/" 2>/dev/null || true
cp AGENTS.md packages/AGENTS.md apps/docs/AGENTS.md   "$OUT/" 2>/dev/null || true
for f in .github/instructions/*.md; do cp "$f" "$OUT/"; done
for f in packages/*/CHANGELOG.md; do cp "$f" "$OUT/changelog-$(basename "$(dirname "$f")").md"; done
for f in packages/core/src/*/[A-Z]*.doc.ts; do cp "$f" "$OUT/$(basename "$f")"; done

echo "corpus: $OUT"
echo "  files: $(find "$OUT" -type f | wc -l | tr -d ' ')"
echo "  lines: $(cat "$OUT"/* 2>/dev/null | wc -l | tr -d ' ')"
