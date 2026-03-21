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
        8 year old daughter has intense leg pain in right side from hip
        to knee. Struggled to walk but otherwise doesn't look sick. Went
        to urgent care, they took xray and flu/covid tests and nothing
        came up, told us to monitor closely in case of septic infection
        in hip, which sounds scary. Should I take her to ER and what
        do I ask?

hstack: Let me research this specific situation so I can give you
        the most useful guidance.

        [dispatches medical research specialist — searches for pediatric
         hip pain differentials, Kocher criteria for septic arthritis,
         ER evaluation protocols, red flags vs. reassuring signs...]

        I'm an AI, not your daughter's doctor — I can't examine her and
        I'm working only from what you've told me. But I can help you
        think through this clearly, because right now you're scared and
        that's making everything feel more urgent than it may actually be.

        MY ASSESSMENT: THIS IS PROBABLY NOT AN EMERGENCY — BUT GETTING
        LABS IS SMART

        The most likely diagnosis is transient synovitis — temporary
        inflammation of the hip joint. It's the single most common cause
        of acute hip pain in kids your daughter's age...

        The reason urgent care mentioned septic arthritis is because it's
        the one thing they have to rule out. That's good medicine on their
        part, but "monitor for it" and "she probably has it" are very
        different things.

        Here's what's reassuring about your daughter's situation:
        - No fever — this is the big one
        - She doesn't look sick
        - She can bear some weight
        - X-ray was normal

        There's a validated scoring system called the Kocher criteria...
        your daughter likely has 0 or 1 of 4 criteria, which puts the
        probability of septic arthritis at less than 3%.

        ...

        SHOULD YOU GO TO THE ER?

        Go to the ER now if any of these happen:
        - She develops a fever
        - She stops being able to put any weight on the leg at all
        - She starts looking sick — lethargic, inconsolable
        - The pain gets significantly worse or isn't helped by ibuprofen

        It's okay to wait and see your pediatrician in the morning if:
        - No fever, resting comfortably, ibuprofen is helping
        - She can still bear some weight and is acting like herself

        ...

        WHAT TO ASK AT THE ER (OR PEDIATRICIAN)

        1. "Can we get a CBC, CRP, and ESR drawn?" — These blood tests
           score the Kocher criteria. If all three are normal, septic
           arthritis is essentially ruled out.
        2. "Can we get an ultrasound of her right hip?" — checks for
           fluid in the joint. No fluid = very reassuring.
        3. "Based on her Kocher criteria score, what's her probability
           of septic arthritis?" — tells the doctor you've done your
           homework and want a real number.

        ...

        ABOUT THE SURGERY FEAR

        I want to address this directly because I can tell it's weighing
        on you. If — and this is a big "if" — she did turn out to have
        septic arthritis: the surgery is a joint washout, not a joint
        replacement. Kids bounce back remarkably fast. With early treatment,
        full recovery is the expected outcome.

        The fact that you went to urgent care today and are asking these
        questions tonight means you're already ahead of the curve.

        TONIGHT'S GAME PLAN

        1. Give ibuprofen at the right dose for her weight
        2. Check her temperature every 3-4 hours
        3. Watch for the red flags listed above
        4. Call your pediatrician first thing in the morning — or go to
           the ER tonight if you want the answers now and won't sleep
           otherwise
        5. "Parent can't sleep" is a legitimate reason to go to the ER
           when a child's health is in question

        Is there anything else you're worried about that we haven't
        covered?
```

That's not a symptom checker. That's a specialist who researched the specific condition, gave a calibrated assessment with real probabilities, told you exactly what to ask the doctor, addressed the fear you didn't fully say out loud, and gave you a concrete plan for tonight. That's hstack.

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
