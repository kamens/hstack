#!/bin/bash
# Install hstack skills into Claude Code
# Usage: ./install.sh [--global | --project]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

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

# Determine install scope
if [ "$1" = "--global" ]; then
  SKILLS_DIR="$HOME/.claude/skills"
elif [ "$1" = "--project" ]; then
  SKILLS_DIR="$(pwd)/.claude/skills"
else
  # Interactive prompt (for manual terminal use)
  echo "Where should hstack skills be installed?"
  echo ""
  echo "  1) Global (default) — available in all projects"
  echo "     → ~/.claude/skills/"
  echo ""
  echo "  2) Project-local — scoped to the current directory"
  echo "     → $(pwd)/.claude/skills/"
  echo ""
  printf "Choose [1]: "
  read -r choice

  case "${choice:-1}" in
    1)
      SKILLS_DIR="$HOME/.claude/skills"
      ;;
    2)
      SKILLS_DIR="$(pwd)/.claude/skills"
      ;;
    *)
      echo "Invalid choice"
      exit 1
      ;;
  esac
fi

mkdir -p "$SKILLS_DIR"

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
echo "Done. ${#SKILLS[@]} hstack skills installed to $SKILLS_DIR"
echo "Start a new Claude Code session to use them."
