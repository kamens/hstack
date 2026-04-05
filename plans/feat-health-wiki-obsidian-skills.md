# feat: Disease-Focused LLM Wiki for Obsidian

## Overview

Add skills to hstack that let a user bootstrap and maintain a personal, disease-focused knowledge base as an Obsidian vault — following Andrej Karpathy's "LLM Wiki" pattern, steered by hstack's battle-hardened doctor persona.

**The pitch:** Hand this to a friend whose kid was just diagnosed with something scary. One slash command creates a war room — not a boring medical encyclopedia, but the briefing you'd get from a brilliant doctor who also has this disease themselves and is obsessively on top of every trial, every community thread, every practical hack. It cuts through the noise: here's what matters most, here's what to push your doctor on, here's what the community is excited about and whether it's real, here's what you should be doing right now. Then they drop in their own lab results and doctor's notes, and the wiki absorbs those too, cross-referencing personal data against the research. The LLM maintains everything. The human curates sources, asks questions, and thinks.

**Karpathy's core insight we're stealing:** "The tedious part of maintaining a knowledge base is not the reading or the thinking — it's the bookkeeping." The LLM handles cross-references, consistency, index maintenance, and updates. The human never edits the wiki directly.

**The voice that makes this different:** The wiki persona is a hardened but compassionate ER doctor who has this disease themselves, is obsessively tracking every trial and every community thread and even the more controversial ideas, and is honestly and openly telling their best friend what to do and what the level of certainty is / risks are, as if they're making the decisions for themselves or their own child.

This is NOT a medical encyclopedia that checks boxes with boring facts everyone knows. Every page should read like a briefing from someone who's *in it with you* — "Here's what I'm watching. Here's what I'd push your doctor on. Here's what the community is excited about and whether I think it's real. Here's what I'd be doing if I were you." The wiki is a war room, not a textbook.

## Four Skills

| Skill | Verb | What it does |
|-------|------|-------------|
| `health-wiki-init` | Bootstrap | Create a disease wiki from scratch with researched content |
| `health-wiki-ingest` | Absorb | Process personal health files dropped into raw/ |
| `health-wiki-refresh` | Update | Re-research the landscape and update the wiki |
| `health-wiki-lint` | Health-check | Find contradictions, gaps, orphans, stale claims |

No "query" skill needed — that's just Claude reading the vault and answering questions, which it already does.

## Vault Structure (Karpathy's Three Layers)

```
my-condition-wiki/
├── .obsidian/                  # Created by Obsidian on first open (we don't touch this)
├── CLAUDE.md                   # Layer 3: Schema — principles for how to maintain this vault
├── index.md                    # Navigation: catalog of all wiki pages with summaries
├── log.md                      # Navigation: append-only chronological record of all operations
│
├── raw/                        # Layer 1: Immutable sources (human-curated, FIRST-CLASS QUERYABLE)
│   └── (whatever the human drops in — organized however they like)
│
└── wiki/                       # Layer 2: LLM-generated and LLM-maintained
    ├── overview.md             # The war room briefing — what matters, what to do, what to watch
    ├── disease/                # "What am I dealing with?" — mechanism, diagnosis, prognosis, biomarkers
    ├── treatments/             # "What can be done?" — approved, off-label, trials you can enroll in
    ├── living/                 # "How do I live with this?" — lifestyle, daily mgmt, tech, community wisdom
    ├── frontier/               # "What's coming?" — early research, pipeline, exciting but not yet actionable
    └── personal/               # "What's my situation?" — your data, timeline, trends, cross-refs to raw/
```

The 5 top-level folders are fixed scaffolding. Within each, the LLM decides what pages and sub-groupings make sense for this specific disease. `wiki/living/` for Type 1 diabetes might have pages on CGMs, pump site management, and school accommodations — while for a rare cancer it might just have fatigue management and caregiver support. The skeleton is fixed; the flesh is emergent.

### Key Design Decisions

1. **One vault per disease.** No multi-disease vaults. Simple.
2. **raw/ is immutable AND first-class queryable.** The LLM reads but never modifies source files. Critically, raw/ is not just an input hopper — it's a first-class part of the knowledge base. When discussing personal results in conversation, the LLM should always read and reference the original file in raw/, not just the wiki's interpretation. Wiki pages are indexes and interpretations; raw data is the source of truth. Every wiki page that interprets a raw source must embed or link back to it (e.g., `Source: [[raw/personal/bloodwork-2026-03.pdf]]`).
3. **wiki/ has fixed scaffolding, emergent content.** The human never edits wiki/ directly. Five top-level folders are fixed (`disease/`, `treatments/`, `living/`, `frontier/`, `personal/`) plus `overview.md`. Within each folder, the LLM decides what pages and sub-groupings make sense for this specific disease. The CLAUDE.md records the structure init chose (a manifest of folders and their purposes) so that ingest, refresh, and lint stay consistent.
4. **index.md and log.md live at vault root** — easy to find, Obsidian shows them prominently. index.md is the real navigation map regardless of what structure the LLM chose.
5. **No required Obsidian plugins.** Callouts, wikilinks, frontmatter, and Mermaid all work with core Obsidian.
6. **Personal data has a clear provenance chain.** Raw personal files in raw/ are always linked from any wiki interpretation page. A conversation about "my March labs" should pull up the actual PDF, not just the wiki summary. Cross-references between personal data and research pages use wikilinks, but personal interpretations and research content live in clearly distinct pages.

### Evidence Tier System

Every wiki page uses Obsidian callouts to label evidence quality inline:

```markdown
> [!success] Clinically Validated
> Metformin is your foundation — non-negotiable unless you have kidney issues. Reduces HbA1c
> by 1-1.5% (UKPDS, landmark RCT, n=4209). If you're not on it, ask your doctor why not.

> [!info] Active Clinical Trials
> Phase 3 trial of tirzepatide for NASH — this is the one to watch. Recruiting now, results
> expected 2027. If you qualify, seriously consider enrollment. NCT number: [link].

> [!warning] Early Research
> Mouse model shows GLP-1 agonists may be neuroprotective (Chen et al., 2025). Not yet in
> humans — don't get excited yet, but keep this on your radar. Could matter in 5-10 years.

> [!question] Community/Anecdotal
> Multiple Reddit threads in r/diabetes report improved energy on berberine 500mg.
> [Source: reddit.com/r/diabetes/comments/...]. Not clinically validated, but enough people
> report it independently that it's worth tracking. Discuss with your doctor before trying.
```

Tiers: `Clinically Validated` → `Active Clinical Trials` → `Early Research` → `Theoretical` → `Community/Anecdotal`

This is intentionally NOT parental. Reddit anecdotes sit alongside RCTs. They're clearly labeled, not filtered out. A proactive patient wants the full landscape.

### Frontmatter Convention

```yaml
---
title: Metformin
tags:
  - treatment/medication
  - evidence/clinically-validated
aliases:
  - Glucophage
sources: 4
last_updated: 2026-04-05
---
```

Tags use `/` nesting: `research/clinical-trial`, `lifestyle/nutrition`, `personal/lab-result`, `technology/monitoring`, etc.

### CLAUDE.md (Vault Schema)

Each vault gets a CLAUDE.md that teaches Claude how to maintain it. This is Karpathy's "Layer 3" — the schema that turns a generic LLM into a disciplined wiki maintainer. Generated by `health-wiki-init`, it includes:

- The disease name, who it's for, and any known context
- **The structural manifest:** the 5 top-level folders, what pages init created within each, and their purposes — so ingest/refresh/lint stay consistent with init's decisions
- **The voice:** "You are a hardened but compassionate ER doctor who has this disease yourself. You obsessively track every trial, every community thread, even the controversial ideas. You are honestly and openly telling your best friend what to do and what the level of certainty and risks are, as if you're making the decisions for yourself or your own child. Every page is a war-room briefing, not an encyclopedia entry. Lead with what matters. Have opinions. Be honest about uncertainty. Include the controversial stuff, clearly labeled."
- Evidence tier definitions and callout syntax
- Frontmatter conventions
- Wikilink and cross-reference rules
- Raw source provenance requirements (every interpretation links back to raw/)
- Index.md and log.md update protocols
- Explicit instruction: "When discussing personal results in conversation, always read the original raw file, not just the wiki interpretation"
- Instructions for the LLM to follow when operating on this vault

---

## Skill 1: `health-wiki-init`

**Role:** The architect. Bootstraps a complete disease wiki from a single disease name.

### Workflow

```
Step 1: Ask what condition
Step 2: Ask who this is for (self, child, parent, partner) + any known context
Step 3: Create vault directory structure
Step 4: Dispatch parallel research subagents (5 domains)
Step 5: Compile research into wiki pages (emergent structure)
Step 6: Generate index.md, log.md, CLAUDE.md, overview.md
Step 7: Tell user how to open in Obsidian
```

### Step 1-2: Gather Context

Use AskUserQuestion (one at a time, per hstack convention):
- "What condition or disease should this wiki cover?"
- "Who is this for — yourself, your child, a parent, a partner? And what do you already know about the situation?"

### Step 3: Scaffold

Create the full directory tree. Write placeholder index.md and log.md.

### Step 4: Parallel Research Subagents

Dispatch 5 Agent subagents simultaneously:

**Subagent A — Disease & Frontier Scout:**
> "You are an obsessive clinical research tracker — the doctor who reads every new paper the week it drops. For [CONDITION], cover two domains:
>
> **The disease itself** (for wiki/disease/):
> - The disease mechanism — but focus on what's *actionable* about understanding it
> - The biomarkers that actually matter for tracking progression and treatment response
> - Diagnosis, prognosis, disease subtypes if relevant
>
> **The frontier** (for wiki/frontier/) — things a proactive patient can't act on yet but should watch:
> - The most promising research directions — what's actually exciting vs. what's hype
> - Early-stage research that could matter in 1-5 years
> - Key researchers and institutions doing the real work
> - How far away each thing is from being real (be honest, not hype-y)
>
> Be precise. Label evidence quality. Include specific trial names, phases, NCT numbers. Frame everything through: what does a proactive patient DO with this information? For frontier items, the answer is 'watch this' — and explain why it's worth watching."

**Subagent B — Treatment Landscape Mapper:**
> "You are the doctor who knows every option and has opinions about them. For [CONDITION], don't give a boring list — give the briefing a patient needs to walk into their doctor's office armed:
> - Current standard of care — what's non-negotiable and why
> - Where the standard of care is *insufficient* and what to push for beyond it
> - All approved treatments with honest assessment of comparative effectiveness — which ones actually move the needle
> - Off-label treatments with real evidence — what's worth discussing with your doctor
> - Clinical trials currently recruiting that a patient could actually enroll in — these are actionable NOW
> - The treatment decisions that are actually hard (where reasonable doctors disagree)
> Be specific about drug names, dosages, and evidence quality. Have opinions. Say which options you'd be pushing for. Anything a patient can access or enroll in TODAY belongs here."

**Subagent C — Lifestyle & Integrative Research Scout:**
> "You are the lifestyle medicine researcher who actually lives with [CONDITION] and has tried everything. Don't just list interventions — tell a proactive patient what's worth their time and energy:
> - Nutrition: what actually has evidence, what's promising, what's a waste of money. Be specific about protocols, not just 'eat healthy'
> - Exercise: specific types and intensities that matter for this condition, not generic advice
> - Sleep, stress, mental health: the stuff that doctors mention for 30 seconds but actually matters enormously
> - Supplements: what has real evidence, what's community-endorsed, what's snake oil. Name names.
> - Complementary approaches: honest assessment, not dismissive and not credulous
> Label evidence tiers clearly. Include community-sourced info alongside clinical. A proactive patient wants the full landscape, not just what's in the guidelines."

**Subagent D — Technology & Tools Scout:**
> "You are the patient who has tested every device, app, and tool available for [CONDITION]. For a proactive patient who wants to be in control:
> - Monitoring devices and wearables — what's best in class, what's actually useful vs. gimmicky
> - Apps that actually help (not just the ones with the best marketing)
> - Assistive tech that makes daily life meaningfully better
> - How to set up effective self-monitoring and what to track
> - Patient advocacy organizations that actually do things (not just awareness campaigns)
> - The online communities where the real conversations happen
> Be specific — product names, model numbers, costs where known. Have opinions about what's worth the money."

**Subagent E — Veteran Patient Scout (REAL SOURCES ONLY):**
> "You are a researcher who goes INTO patient communities to find the hidden nuggets — the practical, hard-won wisdom that never shows up in clinical papers.
>
> **Your method:** Use WebSearch to find Reddit threads (search for '[CONDITION] site:reddit.com', 'r/[condition]'), patient forums, personal blogs, and advocacy group discussions. Use WebFetch to read the actual content. You are a reporter, not an inventor.
>
> **ZERO HALLUCINATION RULE:** Report ONLY what you actually find in real sources you read. Include the URL for every claim. If you can't find real sources for something, don't mention it. Never invent product names, subreddit names, blog names, or patient tips from your training data. Everything must trace to a URL you fetched.
>
> For [CONDITION], find:
> - Practical daily-living tips that experienced patients converge on (specific product recommendations, hacks, routines)
> - Patterns across multiple threads — things many patients report independently
> - The 'things I wish someone told me when diagnosed' wisdom
> - Emotional/psychological coping strategies that real patients say actually work
> - Common pitfalls and mistakes the community warns newly-diagnosed patients about
> - The specific communities, blogs, and patient advocates that keep coming up
>
> For each nugget: quote or closely paraphrase the source, include the URL, note how many people seem to echo the same thing. The value is in the specificity and the provenance."

### Step 5: Compile into Wiki Pages — The War Room

Take all 5 subagent outputs and compile them into the `wiki/` structure. The 5 top-level folders are fixed (`disease/`, `treatments/`, `living/`, `frontier/`, `personal/`). Within each, decide what pages and groupings serve this specific disease best.

**The compilation pass is where the voice lives or dies.** The subagents produce raw clinical/research output. This step transforms it into war-room briefings written in the voice of a hardened but compassionate ER doctor who has this disease themselves — someone obsessively tracking every trial and every community thread, even the controversial ideas, and honestly telling their best friend what to do and what the level of certainty and risks are, as if they're making the decisions for themselves or their own child.

Every page should:
- **Lead with what matters most** — not background, not definitions, but "here's what you need to know and do"
- **Have opinions** — "this is the treatment I'd push for," "this trial is the one to watch," "ignore the hype about X"
- **Be honest about uncertainty** — "the evidence here is thin but the signal is interesting," "this is controversial and here's why"
- **Frame everything as actionable** — not "metformin reduces HbA1c" but "metformin is your foundation — make sure you're on it and here's what to discuss about dosage"
- **Include the controversial stuff** — clearly labeled, but present. A proactive patient wants the full landscape.

Format conventions:
- Frontmatter with title, tags, aliases, sources, last_updated
- Evidence tier callouts (see Evidence Tier System)
- Wikilinks to related pages
- Plain-language explanations with medical terms defined inline
- Links back to raw sources where applicable

### Step 6: Generate Navigation + Schema

**index.md:**
```markdown
---
title: Index
---
# [CONDITION] Wiki — Index

> Last compiled: 2026-04-05

## Overview
- [[overview]] — The big picture

(Sections below are generated by the LLM based on whatever organizational
structure it chose for this disease. The index is the map — whatever
folders and pages exist, they're cataloged here with one-line summaries.)

## [Section 1 — e.g., "Understanding the Disease"]
- [[page]] — one-line summary
...

## [Section N — e.g., "Community Wisdom"]
...

## Personal
_No personal data ingested yet. Drop files into raw/personal/ and run /health-wiki-ingest._
```

**log.md:**
```markdown
---
title: Log
---
# Wiki Log

## 2026-04-05 — init
- Created wiki for [CONDITION]
- Researched: clinical landscape, treatments, lifestyle, technology
- Generated: [N] wiki pages
- Sources: LLM knowledge base (no external sources ingested yet)
```

**CLAUDE.md:** Generated schema document teaching Claude how to maintain this specific vault.

### Step 7: Open Instructions

Tell user: "Your wiki is ready at `[path]`. Open it in Obsidian: File → Open Vault → Open folder as vault → select `[path]`. Start with [[overview]] or [[index]]."

### Edge Cases

- **Vault already exists at path:** Ask user — overwrite, pick a new name, or abort. Don't silently clobber.
- **Very rare disease:** LLM knowledge may be thin. Be honest: "I have limited information on [condition]. The wiki will be thinner than for a common disease — but it's a starting point, and you can build it up by dropping research into raw/."

---

## Skill 2: `health-wiki-ingest`

**Role:** The librarian. Processes personal health files dropped into raw/ and weaves them into the wiki.

### Workflow

```
Step 1: Find the vault (look for CLAUDE.md with wiki schema)
Step 2: Scan raw/ for unprocessed files
Step 3: For each new file, dispatch interpretation subagent
Step 4: Create/update wiki pages in wiki/personal/
Step 5: Cross-reference with existing research pages
Step 6: Update index.md and log.md
```

### Processed File Tracking

`log.md` is the source of truth. When a file is ingested, it gets logged:
```markdown
## 2026-04-10 — ingest
- Processed: raw/personal/bloodwork-2026-03.pdf
- Created: [[personal/labs-2026-03]]
- Updated: [[personal/timeline]], [[index]]
- Cross-referenced: [[research/biomarkers]], [[treatments/metformin]]
```

To detect unprocessed files: read log.md, extract all previously-processed filenames, compare against current raw/ contents.

### Interpretation Subagent

For each new file, dispatch an Agent subagent styled after health-understand-results:

> "You are a clinical laboratory specialist / radiologist / pathologist (as appropriate). Interpret this document precisely:
> - What type of result is this?
> - For each finding: value, normal range, clinical significance
> - Patterns across values
> - How these results relate to [CONDITION]
> - What additional context would help
> Do not soften findings. Be precise."

### Wiki Page Generation

The LLM decides what pages and groupings best serve this patient's personal data. Some likely patterns:

- A chronological timeline page (append new entries as they arrive)
- Per-result interpretation pages (detailed breakdown of each lab/visit/imaging)
- Trend-tracking pages when multiple results exist (e.g., "HbA1c: 7.2 (Jan) → 6.8 (Mar) → 6.5 (Jun)")

But the structure is emergent — if a patient's data naturally clusters around "cardiology visits" and "endocrinology visits," that's a valid organization too. Let the data shape it.

**Critical: raw source provenance.** Every wiki interpretation page MUST link back to the original raw file:
```markdown
> **Source:** [[raw/personal/bloodwork-2026-03.pdf]]
> _The interpretation below is based on this document. For the original unedited data, open the source directly._
```

This ensures the human (or a future LLM conversation) can always get back to the actual raw data, not a telephone-game reinterpretation.

Cross-reference: add wikilinks from personal pages to relevant research/treatment pages. When personal results are clinically relevant to existing wiki content, add cross-reference callouts to those pages too (e.g., "See also: [[personal/labs-2026-03]] for your own HbA1c trend").

### Edge Cases

- **No vault found:** "I don't see a wiki vault here. Run /health-wiki-init first to create one."
- **No new files:** "All files in raw/ have already been processed. Drop new files into raw/personal/ and run this again."
- **Non-text files:** Use Read tool for PDFs and images (both supported). For unsupported formats, ask user to convert or describe.
- **Ambiguous files:** Ask user what the document is if it can't be auto-detected.

---

## Skill 3: `health-wiki-refresh`

**Role:** The researcher returning with updates. Re-researches the landscape and updates the wiki with what's changed.

### Workflow

```
Step 1: Find and read the vault (CLAUDE.md, index.md, log.md)
Step 2: Understand what's already covered and when it was last updated
Step 3: Dispatch research subagents focused on what's CHANGED
Step 4: Update existing pages, create new ones for new findings
Step 5: Mark what's new vs. confirmed vs. superseded
Step 6: Update index.md and log.md
```

### Step 2: Baseline Assessment

Read index.md to understand current coverage. Read log.md to find last refresh date. Read overview.md and skim key pages to understand current state.

### Step 3: Targeted Research

Dispatch the same 5 subagent types as init (clinical, treatments, lifestyle, technology, veteran patient), but with explicit "what's changed" instructions:

> "You are a [role]. The wiki was last updated [DATE]. For [CONDITION], focus on what has CHANGED since then:
> - New trial results published / new treatments approved / new community discoveries
> - Updated guidelines or shifting consensus
> - Significant new research findings
> Also flag anything in the current wiki that may now be outdated.
> If nothing significant has changed in your domain, say so — don't invent updates."

The veteran patient subagent specifically looks for new community threads, trending patient-reported discoveries, and shifts in community sentiment.

Use WebSearch to find recent developments if available.

### Step 4-5: Update Pages

For each updated page, use Obsidian callout to mark what changed:

```markdown
> [!tip] Updated 2026-07-01
> New Phase 3 results for [drug] published. Updated efficacy data below.
```

For superseded information:
```markdown
> [!warning] Superseded
> ~~Previous recommendation was X.~~ Updated guidelines now recommend Y (see [[research/new-guidelines]]).
```

### Step 6: Log It

```markdown
## 2026-07-01 — refresh
- Researched updates since 2026-04-05
- Updated: [[treatments/sglt2-inhibitors]], [[research/clinical-trials]]
- New pages: [[research/new-trial-results-2026]]
- Confirmed current: [[lifestyle/nutrition]], [[technology/cgm-devices]]
- No significant changes: lifestyle domain, technology domain
```

### Edge Cases

- **First refresh on a fresh vault:** Treat like a validation pass — confirm init content is still current.
- **LLM knowledge hasn't changed:** Be honest: "My knowledge hasn't been updated since the wiki was created. For truly current information, consider adding recent articles to raw/ and running /health-wiki-ingest."

---

## Skill 4: `health-wiki-lint`

**Role:** The quality inspector. Health-checks the wiki for structural and content issues.

### Workflow

```
Step 1: Find and read the vault
Step 2: Structural checks (orphans, broken links, index completeness)
Step 3: Content checks (contradictions, stale claims, missing cross-references)
Step 4: Generate lint report
Step 5: Auto-fix structural issues, flag content issues for user
Step 6: Update log.md
```

### Structural Checks (Auto-fixable)

- **Orphan pages:** Wiki pages with no inbound wikilinks → add to index.md and link from relevant pages
- **Broken wikilinks:** Links to pages that don't exist → create stub pages or fix the link
- **Index staleness:** Pages exist but aren't in index.md → add them
- **Missing frontmatter:** Pages without required frontmatter fields → add defaults
- **Missing evidence tiers:** Claims without callout tier labels → flag for tagging

### Content Checks (Report-only, user decides)

- **Contradictions:** Page A says X, page B says Y → report both with page links
- **Stale claims:** Claims with dates that suggest they need re-verification → flag with suggestion
- **Gaps:** Topics mentioned but with no dedicated page → suggest new pages
- **Thin pages:** Pages with very little content → suggest expansion or merger
- **Personal-research disconnects:** Personal results that aren't cross-referenced with relevant research → suggest links

### Lint Report Format

Generate a lint report as a temporary page (wiki/lint-report.md or displayed in terminal):

```markdown
# Lint Report — 2026-07-15

## Auto-Fixed
- Added 3 orphan pages to [[index]]
- Fixed 2 broken wikilinks
- Added frontmatter to 4 pages

## Needs Attention
> [!warning] Contradiction
> [[treatments/metformin]] says "first-line for all Type 2" but
> [[research/new-guidelines]] mentions "shared decision-making preferred."
> These may need reconciliation.

> [!question] Gap
> "Gut microbiome" mentioned in 4 pages but has no dedicated article.
> Consider creating [[research/gut-microbiome]].

> [!info] Stale
> [[research/clinical-trials]] last updated 2026-04-05 (90+ days).
> Consider running /health-wiki-refresh.

## Stats
- Total pages: 34
- Healthy: 28
- Issues found: 6 (3 auto-fixed, 3 flagged)
```

---

## Shared Infrastructure

### New Shared Template: `shared/wiki-schema.md`

A new shared markdown file (like preamble.md) that gets injected via `{{WIKI_SCHEMA}}` into all wiki skills. Contains:

- Vault directory structure specification
- Evidence tier definitions and callout syntax
- Frontmatter conventions
- Wikilink and cross-reference rules
- index.md and log.md format specifications

This prevents the four skills from diverging on vault conventions.

### Template System

Each skill follows existing hstack convention:
- `health-wiki-*/SKILL.md.tmpl` with frontmatter + `{{PREAMBLE}}` + `{{WIKI_SCHEMA}}`
- `gen-skill-docs.ts` already supports arbitrary `{{PLACEHOLDER}}` → `shared/placeholder.md` — no changes needed to the generator

### Dependency on kepano/obsidian-skills

The skill templates should reference kepano/obsidian-skills for Obsidian formatting. In the SKILL.md.tmpl, instruct Claude to use the `obsidian-markdown` skill from kepano if installed. If not installed, the wiki skills still work — they just include inline Obsidian formatting guidance (which we provide in `shared/wiki-schema.md`).

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Create `shared/wiki-schema.md` with vault structure, evidence tiers, frontmatter conventions, callout syntax
- [ ] Create `health-wiki-init/SKILL.md.tmpl` — the bootstrap skill
- [ ] Update `scripts/gen-skill-docs.ts` — no changes needed (already supports arbitrary placeholders)
- [ ] Run `bun run gen:skill-docs` to generate SKILL.md
- [ ] Add to `install.sh` SKILLS array
- [ ] Add eval case to `test/skill-llm-eval.test.ts`
- [ ] Test manually: `/health-wiki-init` with a real disease
- [ ] Open resulting vault in Obsidian and verify it looks right

### Phase 2: Personal Data
- [ ] Create `health-wiki-ingest/SKILL.md.tmpl` — personal file processing
- [ ] Generate, install, test
- [ ] Test: drop a PDF lab result into raw/personal/, run ingest, verify wiki/personal/ pages

### Phase 3: Maintenance
- [ ] Create `health-wiki-refresh/SKILL.md.tmpl` — re-research and update
- [ ] Create `health-wiki-lint/SKILL.md.tmpl` — health-check
- [ ] Generate, install, test both
- [ ] Test full lifecycle: init → ingest → refresh → lint

### Phase 4: Polish
- [ ] Manual QA of the full flow with 2-3 different diseases
- [ ] Tune subagent prompts based on output quality
- [ ] Update README.md with wiki skills documentation
- [ ] Update TODOS.md

## What We're NOT Building

- **No custom search tool.** The wiki is small enough that Claude reads index.md and navigates. Karpathy's qmd is for 400K+ word wikis; we'll get there later if needed.
- **No web UI.** Obsidian IS the viewer.
- **No RAG pipeline.** Claude reads the files directly.
- **No database.** Markdown files are the database.
- **No Obsidian plugin.** The vault works with stock Obsidian.
- **No FHIR/CCD/HL7 parsers.** Claude's Read tool handles PDFs and images. Good enough for v1.
- **No multi-disease vaults.** One vault per condition. If someone has two conditions, they make two vaults (or we revisit later).

## Acceptance Criteria

- [ ] `/health-wiki-init [condition]` produces a vault that opens cleanly in Obsidian with navigable wikilinks, clear evidence tiers, and comprehensive disease coverage
- [ ] `/health-wiki-ingest` correctly processes a dropped PDF lab result, creates personal timeline entries, and cross-references with research pages
- [ ] `/health-wiki-refresh` identifies what's changed and updates pages with clear "updated" / "superseded" markers
- [ ] `/health-wiki-lint` catches structural issues (orphans, broken links) and flags content issues (contradictions, gaps)
- [ ] All 4 skills pass Layer 1 structural tests and Layer 2 LLM eval (4+/5 on all dimensions)
- [ ] The voice is the hardened ER doc who has this disease — opinionated, proactive, honest about uncertainty, leading with what matters, never boring or encyclopedic
- [ ] A non-technical user can hand-open the vault in Obsidian and navigate it intuitively

## References

- [Karpathy LLM Wiki idea](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — three-layer architecture, ingest/lint/query ops
- [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) — Obsidian-aware agent skills
- [gstack](https://github.com/garrytan/gstack) — skill architecture inspiration
- `shared/preamble.md` — hstack voice and safety framework
- `health-summarize-research/SKILL.md.tmpl` — research subagent pattern to build on
- `health-understand-results/SKILL.md.tmpl` — results interpretation pattern for ingest
