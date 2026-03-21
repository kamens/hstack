/**
 * Layer 1 — Static Validation
 *
 * Structural checks for all hstack skills. Free, runs in <1s.
 * Validates: frontmatter, folder naming, template placeholders, generation freshness.
 */
import { describe, test, expect } from "bun:test";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join, basename, dirname } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dir, "..");
const SHARED_DIR = join(ROOT, "shared");

// Discover all skill directories (contain SKILL.md.tmpl)
function findSkills(): string[] {
  const skills: string[] = [];
  for (const entry of readdirSync(ROOT)) {
    const tmpl = join(ROOT, entry, "SKILL.md.tmpl");
    if (existsSync(tmpl)) skills.push(entry);
  }
  return skills;
}

const skills = findSkills();

describe("skill discovery", () => {
  test("at least one skill exists", () => {
    expect(skills.length).toBeGreaterThan(0);
  });
});

describe.each(skills)("skill: %s", (skillName) => {
  const skillDir = join(ROOT, skillName);
  const tmplPath = join(skillDir, "SKILL.md.tmpl");
  const mdPath = join(skillDir, "SKILL.md");

  test("SKILL.md.tmpl exists", () => {
    expect(existsSync(tmplPath)).toBe(true);
  });

  test("SKILL.md (generated) exists", () => {
    expect(existsSync(mdPath)).toBe(true);
  });

  test("SKILL.md has valid YAML frontmatter", () => {
    const content = readFileSync(mdPath, "utf-8");
    // Skip the auto-generated header comments
    const withoutHeader = content.replace(/^<!--.*?-->\n/gm, "").trim();
    const match = withoutHeader.match(/^---\n([\s\S]*?)\n---/);
    expect(match).not.toBeNull();

    const frontmatter = match![1];
    // Check required fields
    expect(frontmatter).toMatch(/^name:\s*.+$/m);
    expect(frontmatter).toMatch(/^description:\s*/m);
  });

  test("frontmatter name matches folder name", () => {
    const content = readFileSync(mdPath, "utf-8");
    const withoutHeader = content.replace(/^<!--.*?-->\n/gm, "").trim();
    const match = withoutHeader.match(/^---\n([\s\S]*?)\n---/);
    const nameMatch = match![1].match(/^name:\s*(.+)$/m);
    expect(nameMatch).not.toBeNull();
    expect(nameMatch![1].trim()).toBe(skillName);
  });

  test("SKILL.md.tmpl contains {{PREAMBLE}}", () => {
    const content = readFileSync(tmplPath, "utf-8");
    expect(content).toContain("{{PREAMBLE}}");
  });

  test("all template placeholders resolve to existing shared files", () => {
    const content = readFileSync(tmplPath, "utf-8");
    const placeholders = content.match(/\{\{(\w+)\}\}/g) || [];
    for (const placeholder of placeholders) {
      const name = placeholder.replace(/\{\{|\}\}/g, "").toLowerCase();
      const sharedFile = join(SHARED_DIR, `${name}.md`);
      expect(existsSync(sharedFile)).toBe(true);
    }
  });

  test("generated SKILL.md has no unresolved placeholders", () => {
    const content = readFileSync(mdPath, "utf-8");
    const remaining = content.match(/\{\{(\w+)\}\}/g);
    expect(remaining).toBeNull();
  });
});

describe("generation freshness", () => {
  test("all generated SKILL.md files match fresh generation (no stale files)", () => {
    // Run gen-skill-docs in dry-run mode and check output
    const bun = join(process.env.HOME || "~", ".bun/bin/bun");
    const result = execSync(
      `${bun} run scripts/gen-skill-docs.ts --dry-run 2>&1`,
      { cwd: ROOT, encoding: "utf-8" }
    );
    expect(result).not.toContain("STALE");
    expect(result).not.toContain("MISSING");
  });
});

describe("shared prose", () => {
  test("shared/preamble.md exists and is non-empty", () => {
    const path = join(SHARED_DIR, "preamble.md");
    expect(existsSync(path)).toBe(true);
    const content = readFileSync(path, "utf-8");
    expect(content.trim().length).toBeGreaterThan(100);
  });

  test("preamble contains persona definition", () => {
    const content = readFileSync(join(SHARED_DIR, "preamble.md"), "utf-8");
    expect(content).toContain("battle-hardened");
  });

  test("preamble contains escalation framework", () => {
    const content = readFileSync(join(SHARED_DIR, "preamble.md"), "utf-8");
    expect(content).toContain("Red");
    expect(content).toContain("Yellow");
    expect(content).toContain("Green");
  });

  test("preamble contains disclaimer philosophy", () => {
    const content = readFileSync(join(SHARED_DIR, "preamble.md"), "utf-8");
    expect(content).toContain("Disclaimer");
  });

  test("preamble contains mental health crisis protocol", () => {
    const content = readFileSync(join(SHARED_DIR, "preamble.md"), "utf-8");
    expect(content).toContain("988");
  });
});
