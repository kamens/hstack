#!/bin/bash
# Install hstack skills into Claude Code
# Usage: ./install.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"

mkdir -p "$SKILLS_DIR"

SKILLS=(
  hstack-prepare-for-visit
  hstack-understand-results
  hstack-summarize-research
  hstack-discuss-case
  hstack-wiki-init
  hstack-wiki-ingest
  hstack-wiki-refresh
  hstack-wiki-lint
  hstack-wiki-battle-plan
)

for skill in "${SKILLS[@]}"; do
  target="$SKILLS_DIR/$skill"
  if [ -L "$target" ] || [ -e "$target" ]; then
    echo "Updating: $skill"
    rm -f "$target"
  else
    echo "Installing: $skill"
  fi
  ln -s "$SCRIPT_DIR/$skill" "$target"
done

echo ""
echo "Done. ${#SKILLS[@]} hstack skills installed."
echo "Start a new Claude Code session to use them."
