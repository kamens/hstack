# hstack — Development Guide

Health advocacy tools for Claude Code.

## Commands

```bash
bun run gen:skill-docs          # Generate SKILL.md from templates
bun run gen:skill-docs --dry-run # Check if generated files are stale
bun test test/skill-validation.test.ts  # Layer 1: structural checks (<1s, free)
bun test test/skill-llm-eval.test.ts    # Layer 2: LLM quality checks (~$0.15)
bun test                                # All tests
```

## Architecture

```
shared/preamble.md          ← Single source of truth for voice, safety, escalation
        │
        ▼
health-*/SKILL.md.tmpl      ← Skill templates (what you edit)
        │
   gen-skill-docs.ts        ← Replaces {{PREAMBLE}} with shared/preamble.md contents
        │
        ▼
health-*/SKILL.md           ← Generated output (committed, don't edit directly)
```

## Conventions

- Skill directories are named `health-*` (obviously health-related for coexistence with coding tools)
- Every SKILL.md.tmpl must include `{{PREAMBLE}}` — this injects the shared persona and safety protocols
- Generated SKILL.md files are committed so users can install without a build step
- After editing any .tmpl or shared/ file, run `bun run gen:skill-docs` and commit the generated output
- Frontmatter `name:` must match the folder name

## Adding a Skill

1. `mkdir health-your-skill-name`
2. Create `SKILL.md.tmpl` with frontmatter (`name`, `description`) and `{{PREAMBLE}}`
3. `bun run gen:skill-docs`
4. Add a test case in `test/skill-llm-eval.test.ts`
5. `bun test`

## Voice

The shared preamble defines a "battle-hardened ER doc" persona. All skills inherit this voice. When writing skill prompts:

- Be calibrated, not cautious — give real assessments
- Be direct but warm — acknowledge anxiety without dismissing it
- Use subagents for clinical separation — let the subagent be dispassionate, let the main skill be empathetic
- Never refuse to engage with a health question
- Weave disclaimers naturally, don't stamp them as banners
