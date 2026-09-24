#!/usr/bin/env bash
# Launch gate: fails when unfinished text is about to ship.
# Scans HTML, Markdown, JSON and TS/TSX (public copy) but not scripts or dependencies.
set -u
PAT='>[[:space:]]*(Benefit|Detail|Lorem ipsum|TODO|TBD|Guide · Date)[[:space:]]*<|REPLACE_WITH_[A-Z_]+|PASTE-[A-Z-]+-HERE'
HITS=$(grep -rniE --include='*.html' --include='*.md' --include='*.json' --include='*.tsx' --include='*.ts' \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=scripts --exclude-dir=.github --exclude-dir=.worktrees --exclude-dir=docs \
  -e "$PAT" . | grep -viE 'package(-lock)?\.json|launch-gate' || true)
if [ -n "$HITS" ]; then
  echo "LAUNCH GATE FAILED: placeholder text found."; echo "$HITS" | head -40; exit 1
fi
echo "Launch gate passed: no placeholder text."
