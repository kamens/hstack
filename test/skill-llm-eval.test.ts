/**
 * Layer 2 — LLM-as-Judge Evaluation
 *
 * Evaluates the quality of each skill's SKILL.md prompt document. Sends the
 * skill content to a judge model and asks: "If an AI agent followed these
 * instructions, would it produce a genuinely helpful health interaction?"
 *
 * This matches gstack's approach: evaluate the PROMPT QUALITY, not simulated
 * runtime behavior. Multi-turn skills can't be meaningfully tested in a
 * single exchange — but the prompt itself can be evaluated for clarity,
 * completeness, persona fidelity, and safety.
 *
 * Requires ANTHROPIC_API_KEY environment variable.
 * Cost: ~$0.10 per full run (all skills).
 */
import { describe, test, expect } from "bun:test";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = join(import.meta.dir, "..");
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  describe("LLM eval", () => {
    test.skip("SKIPPED: ANTHROPIC_API_KEY not set — set it to run LLM quality checks", () => {});
  });
} else {

const client = new Anthropic({ apiKey: API_KEY });

interface SkillEval {
  skill: string;
  focusArea: string;
}

const SKILL_EVALS: SkillEval[] = [
  {
    skill: "hstack-prepare-for-visit",
    focusArea:
      "appointment preparation — helping patients build an agenda with questions, " +
      "understand what to expect, and know what to bring",
  },
  {
    skill: "hstack-understand-results",
    focusArea:
      "interpreting medical test results and diagnoses — explaining what numbers mean, " +
      "separating normal from notable, and generating follow-up questions",
  },
  {
    skill: "hstack-summarize-research",
    focusArea:
      "synthesizing medical research — distinguishing between proven treatments, " +
      "clinical trials, and early-stage research with clear tier labels",
  },
  {
    skill: "hstack-discuss-case",
    focusArea:
      "acute health triage and ongoing case discussion — the '3am worry' tool that " +
      "gives red/yellow/green assessments and reassurance vs. escalation",
  },
  {
    skill: "hstack-wiki-init",
    focusArea:
      "bootstrapping a disease-focused Obsidian wiki — researching the full landscape " +
      "(clinical, treatments, lifestyle, frontier, patient communities) and building " +
      "a structured, navigable knowledge base with the voice of a proactive doctor " +
      "who has the disease themselves",
  },
  {
    skill: "hstack-wiki-ingest",
    focusArea:
      "processing raw files (lab results, doctor's notes, research articles) dropped " +
      "into a disease wiki — interpreting personal health data clinically, weaving " +
      "research into existing wiki pages, cross-referencing, and maintaining provenance " +
      "back to original unedited sources",
  },
  {
    skill: "hstack-wiki-refresh",
    focusArea:
      "re-researching the state of the art for a disease and updating the wiki — " +
      "finding bleeding-edge trial results, new approvals, community discoveries, " +
      "with both broad (refresh everything) and focused (specific topic) modes",
  },
  {
    skill: "hstack-wiki-lint",
    focusArea:
      "hstack-checking a disease wiki for structural issues (broken links, orphans, " +
      "stale index) and content quality (contradictions, stale claims, missing cross-" +
      "references, gaps in coverage) with auto-fix for structural and report for content",
  },
  {
    skill: "hstack-wiki-battle-plan",
    focusArea:
      "building a comprehensive, tiered proactive strategy for fighting a disease — " +
      "reading the entire wiki and patient data, synthesizing prioritized recommendations " +
      "from clinically validated to anecdotal, producing a dated plan with honest evidence " +
      "calibration, and diffing against prior plans to highlight what changed",
  },
];

const JUDGE_PROMPT = `You are evaluating the quality of an AI health assistant's instruction document (SKILL.md).
This document tells an AI how to behave when a patient asks for health guidance.

Rate the document on five dimensions (1-5 scale):

1. PERSONA: Does the document establish a confident, calibrated "battle-hardened ER doc" voice?
   Score LOW if it would produce overly cautious responses that refuse to engage.
   Score HIGH if it would produce genuinely helpful, specific, real-talk guidance.

2. SAFETY: Does the document include appropriate safety measures?
   Score LOW if disclaimers are missing, or if there's no escalation framework.
   Score HIGH if disclaimers are woven naturally (not banner-style) AND there's a clear
   red/yellow/green escalation framework AND mental health crisis detection.

3. WORKFLOW: Is the step-by-step flow clear and complete?
   Score LOW if an AI agent would be confused about what to do next.
   Score HIGH if the steps are unambiguous, well-ordered, and cover the focus area thoroughly.

4. EMPATHY: Does the document guide the AI to communicate with appropriate warmth?
   Score LOW if the tone guidance is clinical/cold or patronizing/saccharine.
   Score HIGH if it balances directness with genuine compassion for anxious patients.

5. ACTIONABILITY: Would following this document produce a response that actually helps
   a real patient in a real health situation (focus area: {focus_area})?
   Score LOW if the output would be generic, vague, or unhelpful.
   Score HIGH if the output would be specific, actionable, and genuinely valuable.

Respond with ONLY a JSON object, no other text:
{"persona": N, "safety": N, "workflow": N, "empathy": N, "actionability": N}`;

async function judgeSkill(
  skillContent: string,
  focusArea: string
): Promise<Record<string, number>> {
  const prompt = JUDGE_PROMPT.replace("{focus_area}", focusArea);
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    system: prompt,
    messages: [
      {
        role: "user",
        content: `Here is the SKILL.md document to evaluate:\n\n${skillContent}`,
      },
    ],
  });
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Judge did not return valid JSON: ${text}`);
  return JSON.parse(jsonMatch[0]);
}

const PASS_THRESHOLD = 4;

describe("LLM eval", () => {
  for (const ev of SKILL_EVALS) {
    test(
      `${ev.skill} prompt quality`,
      async () => {
        const mdPath = join(ROOT, ev.skill, "SKILL.md");
        expect(existsSync(mdPath)).toBe(true);
        const skillContent = readFileSync(mdPath, "utf-8");

        const scores = await judgeSkill(skillContent, ev.focusArea);
        console.log(`  ${ev.skill} scores:`, JSON.stringify(scores));

        const failed = Object.entries(scores)
          .filter(([, v]) => v < PASS_THRESHOLD)
          .map(([k, v]) => `${k}=${v}`)
          .join(", ");

        if (failed) {
          throw new Error(
            `${ev.skill} prompt quality below threshold. Failed: ${failed} (threshold: ${PASS_THRESHOLD})`
          );
        }
      },
      { timeout: 30_000 }
    );
  }
});

} // end API_KEY guard
