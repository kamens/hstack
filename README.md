# hstack

Health advocacy tools for Claude Code. Structured slash commands that help you navigate medical situations — prepare for doctor visits, understand test results, research conditions, and talk through health concerns with a calm, informed voice.

Think of it as having a battle-hardened ER doctor on speed dial. Not an overly cautious chatbot that says "consult your doctor" to everything — a genuinely helpful guide who gives you real assessments, explains what's actually happening, and knows the difference between "your anxiety is worse than your symptoms" and "get in the car now."

## Install

```bash
git clone https://github.com/YOUR_USERNAME/hstack ~/.claude/skills/hstack
```

That's it. Claude Code auto-discovers skills in `~/.claude/skills/`. The four commands become available immediately.

For development (working from a local checkout):

```bash
ln -s /path/to/your/hstack ~/.claude/skills/hstack
```

## Commands

### `/health-prepare-for-visit`

Prepare for a doctor appointment. Builds an agenda with questions to ask (prioritized by importance), things to bring, what to expect during the visit, medical terms you'll hear, and red flags to listen for.

Use before any medical visit: new diagnosis, follow-up, specialist referral, second opinion, procedure, or routine checkup.

### `/health-understand-results`

Understand a diagnosis or interpret test results. Breaks down what findings mean in plain language, separates "normal and you can stop worrying" from "worth discussing with your doctor," outlines likely next steps, and tells you what NOT to Google at 2am.

Use after receiving lab results, imaging, pathology, a new diagnosis, or anything medical you need help understanding.

### `/health-summarize-research`

Summarize the current state of research on a condition or treatment. Distinguishes between what's available now, what's in clinical trials, what's early-stage research, and what's theoretical. Includes a hype check — what the headlines say vs. what the evidence actually shows.

Use when you want the full landscape of a health topic, emerging treatments, or informed questions for your doctor.

### `/health-discuss-case`

Talk through a health situation. The "3am worry" tool. Something is happening and you need to know: is this normal, or do I need to act?

Gives you a clear red/yellow/green assessment — red means act now, yellow means call your doctor soon, green means you're okay with specific reasons why. Also works as an ongoing case discussion partner for complex health situations over time.

## How It Works

Each command is a carefully crafted prompt (a SKILL.md file) that shapes how Claude responds to your health questions. The prompts share a common voice and approach defined in `shared/preamble.md` — the battle-hardened ER doc persona, calibrated escalation framework, anxiety-aware communication patterns, and safety protocols.

Commands that benefit from clinical separation use subagents — a research or triage specialist runs in a separate context to give an unbiased clinical assessment, then the main skill wraps it in empathetic delivery.

## Important

hstack is an AI tool, not a doctor. It can help you understand medical information, prepare better questions, and think through health situations more clearly — but it cannot examine you, run tests, or replace professional medical care.

The skills are designed to be genuinely helpful rather than reflexively cautious. They will give you real assessments and honest guidance. But they will also tell you to go to the ER when you need to, and they will tell you when a situation is beyond what AI can responsibly advise on.

## Development

Requires [bun](https://bun.sh/).

```bash
# Generate SKILL.md files from templates
bun run gen:skill-docs

# Run structural validation tests (free, <1s)
bun test test/skill-validation.test.ts

# Run LLM quality checks (requires ANTHROPIC_API_KEY, ~$0.15/run)
bun test test/skill-llm-eval.test.ts

# Run all tests
bun test
```

## How to Add a Skill

1. Create a new directory with a `health-` prefix:

```bash
mkdir health-your-skill-name
```

2. Create `SKILL.md.tmpl` in that directory with this structure:

```yaml
---
name: health-your-skill-name
description: |
  What this skill does and when to use it.
---

{{PREAMBLE}}

# Your Skill Title

Your skill instructions here. Write them as natural language guidance
for Claude — what persona to adopt, what questions to ask, how to
structure the response, when to use subagents.
```

The `{{PREAMBLE}}` placeholder is required — it injects the shared persona, escalation framework, and safety protocols.

3. Generate the SKILL.md:

```bash
bun run gen:skill-docs
```

4. Test it:

```bash
bun test test/skill-validation.test.ts
```

5. Try it in Claude Code — the skill appears as `/health-your-skill-name`.

6. Add an LLM eval test case in `test/skill-llm-eval.test.ts` with a canonical patient message and skill-specific judging criteria.

## License

MIT
