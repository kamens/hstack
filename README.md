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

Open Claude Code and paste this. Claude does the rest.

> Install hstack: run **`git clone https://github.com/kamens/hstack ~/.claude/skills/hstack && cd ~/.claude/skills/hstack && ./install.sh`**

Start a new Claude Code session and the four `/health-*` commands are available immediately.

Or run it yourself in a terminal — same command, same result.

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

Real example using `/health-prepare-for-visit`:

```
You:    /health-prepare-for-visit
        8 year old daughter has intense leg pain from hip to knee.
        Struggled to walk but otherwise doesn't look sick. Urgent care
        took xray and flu/covid tests — nothing came up. Told us to
        monitor for septic infection in hip, which sounds scary.
        Should I take her to ER? What do I ask?

hstack: [asks about recent illness, fever, when pain started, whether
         she can bear any weight...]

        [dispatches medical research specialist — researches pediatric
         hip pain differentials, Kocher criteria, ER protocols...]

        I'm an AI, not your daughter's doctor — but I can help you
        think through this clearly, because right now you're scared
        and that's making everything feel more urgent than it may be.

        ASSESSMENT: PROBABLY NOT AN EMERGENCY — BUT GETTING LABS IS SMART

        The most likely diagnosis is transient synovitis — the single
        most common cause of acute hip pain in kids her age...
        "Monitor for it" and "she probably has it" are very different.

        Your daughter likely meets 0-1 of 4 Kocher criteria, which puts
        the probability of septic arthritis at less than 3%.

        ...

        SHOULD YOU GO TO THE ER?

        Go now if: fever develops, can't bear weight at all, starts
        looking sick, or pain isn't helped by ibuprofen.

        OK to see pediatrician in the morning if: no fever, resting
        comfortably, bearing some weight, acting like herself.

        ...

        MUST-ASK QUESTIONS

        1. "Can we get a CBC, CRP, and ESR?" — if all normal, septic
           arthritis is essentially ruled out.
        2. "Can we get a hip ultrasound?" — no fluid = very reassuring.
        3. "What's her Kocher criteria score?" — tells the doctor you
           want a real number, not just "we're monitoring."
        4. "What specific symptoms should bring us back immediately?"
        5. "Should we follow up with pediatric orthopedics?"

        ...

        WORDS YOU'LL HEAR

        Transient synovitis — temporary hip inflammation. Most likely
            diagnosis. Goes away on its own.
        Septic arthritis — bacterial joint infection. Rare but serious.
        Effusion — fluid in the joint. Present in both — so fluid
            alone doesn't mean infection.
        Kocher criteria — 4-factor scoring system that predicts
            probability of septic arthritis.
        CRP / ESR — blood inflammation markers. Normal = very reassuring.
        Arthrotomy — surgical joint cleaning. Sounds scary but excellent
            outcomes in kids.

        ...

        ABOUT THE SURGERY FEAR

        If — and this is a big "if" — she did have septic arthritis:
        it's a joint washout, not a replacement. Kids bounce back fast.
        Full recovery is the expected outcome with early treatment.

        You went to urgent care today and are asking these questions
        tonight. You're already ahead of the curve.

        TONIGHT'S GAME PLAN

        1. Ibuprofen at the right dose for her weight
        2. Check temperature every 3-4 hours
        3. Watch for red flags above
        4. Pediatrician first thing in the morning — or ER tonight if
           you won't sleep otherwise
        5. "Parent can't sleep" is a legitimate reason to go to the ER
```

## Important

hstack is an AI tool, not a doctor. It can help you understand medical information, prepare better questions, and think through health situations more clearly — but it cannot examine you, run tests, or replace professional medical care. Use it as a thinking partner, not a substitute for real medical advice. The authors are not liable for decisions made based on its output.

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
