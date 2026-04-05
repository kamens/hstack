#!/bin/bash
# Install hstack skills into Claude Code
# Usage: ./install.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"

mkdir -p "$SKILLS_DIR"

SKILLS=(
  health-prepare-for-visit
  health-understand-results
  health-summarize-research
  health-discuss-case
  health-wiki-init
  health-wiki-ingest
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
echo "Done. ${#SKILLS[@]} health skills installed."
echo "Start a new Claude Code session to use them."
