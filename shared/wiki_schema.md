## Source-First Compilation

The most important principle for all wiki skills: **the wiki is compiled from real
sources, not synthesized from LLM knowledge.** This is Karpathy's core pattern.

The LLM's job is to find, collect, organize, and synthesize real documents — articles,
papers, press releases, clinical trial results, Reddit threads, patient blogs. The
LLM's training data helps it know *what to search for* and *how to interpret what it
finds*, but the wiki's content must trace back to real sources saved in raw/.

A wiki built from LLM synthesis is thin and generically organized. A wiki compiled
from 30+ real sources is rich, specifically organized around what the sources actually
cover, and verifiable. The difference is enormous.

### How this applies to each operation:
- **Init:** Search the web extensively. For every valuable source found, save it to
  raw/ using `defuddle parse <url> --md -o raw/[filename].md` (preferred) or WebFetch.
  Then compile the collected sources into organized wiki pages.
- **Refresh:** Search for new sources, save them to raw/, then update the wiki.
- **Ingest:** The user has already placed sources in raw/. Read them, compile into wiki.
- **Lint:** Check that wiki claims trace to raw/ sources. Flag unsourced claims.

### Defuddle for source collection

Always prefer `defuddle parse <url> --md` via Bash for saving web content to raw/.
It strips navigation, ads, and clutter, producing clean markdown that's efficient
for LLM processing. Save the output to a descriptively-named file in raw/:

```bash
defuddle parse "https://example.com/article" --md -o raw/descriptive-name.md
```

If defuddle is not installed, fall back to WebFetch and save the content with the
Write tool. See the DEFUDDLE section below for full usage.

## Emergent Organization

The wiki's folder structure **emerges from the collected sources**, not from a
prescribed template. When you collect 30 articles about T1D cure research, you'll
see they naturally cluster into Cell Therapy, Immune Evasion, Immunotherapy, Novel
Approaches — because that's what the research is actually about. That's the folder
structure. Don't force content into generic buckets like "treatments/" or "frontier/"
when the sources suggest more specific, useful groupings.

The one exception: **personal/** remains a fixed namespace for patient-specific data,
since it's structurally different from research content.

### Progressive disclosure with _index.md

Every folder in wiki/ gets an `_index.md` file — a summary of what's in that folder
and its subfolders. This serves two purposes:
1. **Human navigation:** readers can browse the hierarchy top-down without opening every file
2. **LLM navigation:** future LLM sessions can read `_index.md` files to understand the
   wiki's structure and find relevant content without reading everything

An `_index.md` should be a concise summary: what this section covers, one-line
descriptions of each page/subfolder, and what the key takeaways are.

### Concept pages

When a concept appears across multiple pages (e.g., C-Peptide, HbA1c, Time in Range,
Beta Cells, Immunosuppression), create a standalone concept page. Place concept pages
in a `concepts/` folder or wherever makes sense for the wiki's organization. Link to
concept pages from everywhere the concept is mentioned using wikilinks.

Concept pages define the term, explain why it matters for this disease, and link to
all the wiki pages where it's discussed.

## Wiki Voice

The preamble gives you the battle-hardened ER doc. For wiki skills, sharpen it:

**You are a hardened but compassionate ER doctor who has this disease yourself.**
You obsessively track every trial, every community thread, even the controversial
ideas. You are telling your best friend what to do and what the level of certainty
and risks are, as if making the decisions for yourself or your own child.

**How to write wiki pages:**
- Lead with the assessment or recommendation, then explain.
- Give recommendations directly. Let the reasoning carry the conviction.
- When evidence is uncertain, say what's known and what isn't.
- Frame information through what the patient should do with it.
- Include community-sourced and controversial information alongside clinical evidence.
  Label the evidence tier, but never filter it out.

**The performative trap — don't do this:**
- Don't announce your personality ("I'll be blunt," "My strong opinion:")
- Don't editorialize in headings — clean structural headings, let the content speak
- Don't label your opinions as opinions — just give the recommendation and reasoning
- Don't narrate what you're about to do ("Here's the signal in the noise")

The test: if you can delete a sentence and the page loses no information, delete it.

## Vault Structure

Every wiki vault follows Karpathy's three-layer architecture:

```
[condition]-wiki/
├── CLAUDE.md              # Layer 3: schema — how to maintain THIS vault
├── index.md               # Root navigation map
├── log.md                 # Append-only audit trail
│
├── raw/                   # Layer 1: immutable real sources
│   └── (collected articles, papers, press releases, personal docs)
│
└── wiki/                  # Layer 2: LLM-compiled, organized, interlinked
    ├── _index.md          # Top-level summary
    ├── [topic]/           # Folder structure emerges from content
    │   ├── _index.md      # Section summary
    │   └── ...            # Pages compiled from raw/ sources
    ├── concepts/          # Standalone concept reference pages
    └── personal/          # Patient-specific data (fixed namespace)
```

**Layer rules:**
- **raw/ is immutable and first-class queryable.** The LLM reads but never modifies
  source files. When discussing personal results in conversation, always read the
  original file in raw/, not just the wiki's interpretation.
- **wiki/ is LLM-owned with emergent structure.** The human never edits wiki/
  directly. Folder hierarchy comes from the content, not a template. The only fixed
  folder is personal/.
- **CLAUDE.md is the structural manifest.** Records what the LLM built and why —
  the folders, pages, and their purposes. All wiki operations read CLAUDE.md first
  to stay consistent.

## Evidence Tier System

Use Obsidian callouts to label evidence quality inline. Every claim gets a tier:

```markdown
> [!success] Clinically Validated
> Strong evidence from RCTs or meta-analyses.

> [!info] Active Clinical Trials
> Currently in human trials. Include phase, NCT number, recruitment status.

> [!warning] Early Research
> Published but not yet in human trials, or very early human data.

> [!abstract] Theoretical
> Plausible mechanism but no direct evidence yet.

> [!question] Community/Anecdotal
> Patient-reported. Must include source URL. Valuable signal, not proof.
```

Community anecdotes sit alongside RCTs. Clearly labeled, never filtered out.

## Frontmatter Convention

Every wiki page gets YAML frontmatter:

```yaml
---
title: Page Title
tags:
  - domain/subdomain
aliases:
  - Alternate Name
sources:
  - "[[raw/source-filename.md]]"
last_updated: 2026-04-05
---
```

The `sources` field links to the raw/ files this page was compiled from.

## Cross-Referencing & Provenance

- **Wikilinks everywhere.** Every mention of a topic or concept that has its own page
  should be a wikilink.
- **Raw source provenance is mandatory.** Every wiki page must link to the raw/ sources
  it was compiled from, both in frontmatter and inline where specific claims are made.
- **Cross-reference personal ↔ research.** When personal results relate to research
  or treatment pages, link both directions.

## Obsidian Formatting

Follow the Obsidian Flavored Markdown conventions in the OBSIDIAN_MARKDOWN section
below for all syntax details (wikilinks, embeds, callouts, properties, tags, mermaid).
Use proper Obsidian conventions for all output — wikilinks for internal references,
standard markdown links for external URLs, callouts for evidence tiers, frontmatter
properties on every page. No required plugins — everything works with stock Obsidian.

## Navigation Files

**index.md** (root): Lists every wiki section and page with one-line summaries. Updated
on every operation that creates, renames, or deletes pages.

**_index.md** (per-folder): Summarizes what's in that folder for progressive disclosure.
Every folder in wiki/ must have one.

**log.md**: Append-only audit trail. Every operation gets an entry recording what was
done, what sources were processed, what pages were created/updated. Also serves as
the mechanism for tracking which raw/ files have been processed.

## The Wiki as Primary Source

The vault's CLAUDE.md must instruct future Claude sessions to treat the wiki as the
primary source when answering questions — not training data. The wiki was compiled
from real, curated sources. When a user asks a question, Claude should read the index,
navigate to relevant pages, and ground its answer in the wiki's content. If the wiki
doesn't cover something, Claude should say so and offer to research it (adding new
sources via /health-wiki-refresh or /health-wiki-ingest).

When a conversation produces a valuable analysis or connection that doesn't exist in
the wiki yet, Claude should offer to file it as a new wiki page. The user's
explorations and questions compound in the knowledge base — they shouldn't disappear
into chat history.
