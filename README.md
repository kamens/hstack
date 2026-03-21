# hstack

I find myself constantly talking to LLMs when dealing with health situations on behalf of family, extended family, extended-extended family, friends...

Understanding results. Preparing questions for the next doctor visit. Breaking down diagnoses. Mapping out treatment options. Summarizing bleeding-edge research. Reviewing the last few visits and spotting what doesn't add up.

Every time, I'm re-doing prompts from scratch. Re-explaining context. Re-building the same workflows I've built a dozen times before.

**hstack is a collection of tools and agent specialists built to help those who use LLMs as healthcare advisors.** It's not a doctor — but it'll help you better understand them, communicate with them, interpret your own results, and make more informed decisions about your care.

**Who this is for:**
- **Patients and caregivers** — anyone navigating a health situation for themselves or someone they love
- **The family health researcher** — the person everyone calls when they get confusing test results or need help understanding a diagnosis
- **Anyone who already uses LLMs for health questions** — and wants structured tools instead of starting from scratch every time

## Quick start

1. Install hstack (30 seconds — see below)
2. Run `/health-discuss-case` — describe something you're worried about. See how it responds.
3. Run `/health-understand-results` — paste some test results or a diagnosis you've received.
4. Run `/health-prepare-for-visit` — tell it about an upcoming appointment and watch it build your agenda.

## Install

```bash
git clone https://github.com/kamens/hstack ~/.claude/skills/hstack
```

That's it. Claude Code auto-discovers skills in `~/.claude/skills/`. The four commands become available immediately.

For development (working from a local checkout):

```bash
ln -s /path/to/your/hstack ~/.claude/skills/hstack
```

## Your specialists

Four agent specialists, each with a specific role. They all share the same foundational voice — a battle-hardened ER doc who's also a patient advocate, a clinical results interpreter, and a scout for the latest R&D — but each brings a different expertise to the conversation.

| Skill | Your specialist | What they do |
|-------|----------------|--------------|
| `/health-prepare-for-visit` | **Patient Advocate** | Builds your appointment agenda — prioritized questions to ask, things to bring, what to expect, medical terms you'll hear, and red flags to listen for. You'll walk in more prepared than most patients. |
| `/health-understand-results` | **Results Interpreter** | Breaks down test results and diagnoses — what the numbers actually mean, what's normal vs. notable, likely next steps, and what NOT to Google at 2am. Separates the signal from the noise. |
| `/health-summarize-research` | **Latest R&D Scout** | Synthesizes the cutting edge of medical research — what's proven and available now, what's in clinical trials, what's early-stage, and what's hype. Brings back actionable intelligence for your next doctor conversation. |
| `/health-discuss-case` | **ER Doc on Call** | The 3am tool. Something is happening and you need to know: is this normal, or do I need to act? Gives a clear red/yellow/green assessment — and knows when "you're okay" is the right answer. |

Each specialist consults behind-the-scenes clinical subagents (a triage specialist, a lab interpreter, a research analyst, a medical information specialist), then delivers the findings with appropriate warmth.

## See it work

```
You:    /health-discuss-case
        My dad had heart surgery 3 days ago and now has a fever of 101.2.
        His chest incision looks redder than before. Should I be worried?

hstack: Before I give you my assessment, I need a few more details.
        When did the fever start — today, or has it been building?

You:    Started this afternoon. He was fine this morning.

hstack: And is the redness around the incision spreading, or is it
        about the same as yesterday? Any drainage or warmth to the touch?

You:    It's a bit wider than yesterday. Warm but no drainage.

hstack: OK. I want to be straight with you — post-surgical fever at
        day 3 with expanding redness around the incision site is a
        YELLOW. This doesn't need the ER tonight, but it needs
        attention tomorrow morning.

        Here's why I'm not saying red: 101.2 is low-grade, there's
        no drainage, and some incision-site inflammation is normal
        healing. But the combination of fever + expanding redness
        is the pattern we watch for with surgical site infections.

        What to do:
        - Call the surgeon's office first thing tomorrow
        - Tell them: "3 days post-op, new fever of 101.2, incision
          redness is spreading"
        - Monitor tonight: if fever goes above 102, or if you see
          any drainage, redness spreads significantly, or he develops
          chills — that upgrades to RED. Go to the ER.

        Here's what's making your anxiety spike vs. what's actually
        happening: the word "infection" is scary, but what we're
        really talking about is catching something early that's very
        treatable. You're doing the right thing by watching this closely.
```

That's not a symptom checker. That's a doctor who listened, asked the right follow-up questions, gave a calibrated assessment with specific reasoning, and told you exactly what to do — including what would change the advice. That's hstack.

## Important

hstack is an AI tool, not a doctor. It can help you understand medical information, prepare better questions, and think through health situations more clearly — but it cannot examine you, run tests, or replace professional medical care.

If you or someone you know is in crisis, call emergency services or a crisis hotline.

## How it works

Each command is a carefully crafted prompt (a SKILL.md file) that shapes how Claude responds to health questions. The prompts share a common voice defined in `shared/preamble.md` — the battle-hardened ER doc persona, a calibrated red/yellow/green escalation framework, anxiety-aware communication patterns, and safety protocols including mental health crisis detection.

Specialists that benefit from clinical separation dispatch subagents — a triage specialist or lab interpreter runs in a separate context to give an unbiased clinical assessment, then the main skill wraps it in empathetic delivery. The clinical truth and the human delivery are handled separately so neither compromises the other.

## Development

Requires [bun](https://bun.sh/).

```bash
# Generate SKILL.md files from templates
bun run gen:skill-docs

# Run structural validation tests (free, <1s)
bun test test/skill-validation.test.ts

# Run LLM quality checks (requires ANTHROPIC_API_KEY, ~$0.10/run)
bun test test/skill-llm-eval.test.ts

# Run all tests
bun test
```

## How to add a skill

Adding a new specialist takes about 10 minutes:

1. Create a directory with a `health-` prefix:

```bash
mkdir health-your-skill-name
```

2. Create `SKILL.md.tmpl` with this structure:

```yaml
---
name: health-your-skill-name
description: |
  What this skill does and when to use it.
---

{{PREAMBLE}}

# Your Skill Title

**You are the patient's [specialist role].** One sentence that captures
what this specialist does and why the patient needs them.

Your skill instructions here. Write them as natural language guidance
for Claude — what questions to ask, how to structure the response,
when to dispatch subagents for clinical separation.
```

The `{{PREAMBLE}}` placeholder is required — it injects the shared voice, escalation framework, and safety protocols that all specialists share.

3. Generate and test:

```bash
bun run gen:skill-docs
bun test test/skill-validation.test.ts
```

4. Try it in Claude Code — the skill appears as `/health-your-skill-name`.

5. Add an LLM eval test case in `test/skill-llm-eval.test.ts` with a focus area description for the judge.

## License

MIT. Free forever. Go help someone.
