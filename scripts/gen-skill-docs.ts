#!/usr/bin/env bun
/**
 * Template generator for hstack skills.
 *
 * Reads each SKILL.md.tmpl, replaces {{PLACEHOLDER}} markers with the contents
 * of the corresponding shared/*.md file (lowercased), and writes SKILL.md.
 *
 * External dependencies (e.g., kepano/obsidian-skills) are fetched from GitHub
 * at gen time and cached in shared/. If the fetch fails, the last cached copy
 * is used as a fallback.
 *
 * Usage:
 *   bun run scripts/gen-skill-docs.ts            # generate all
 *   bun run scripts/gen-skill-docs.ts --dry-run   # compare without writing
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "fs";
import { join, basename, dirname, relative } from "path";

const ROOT = dirname(dirname(import.meta.path));
const SHARED_DIR = join(ROOT, "shared");
const DRY_RUN = process.argv.includes("--dry-run");

// External dependencies: placeholder name → raw GitHub URL
// These are fetched fresh on each gen run and cached in shared/<name>.md
const EXTERNAL_DEPS: Record<string, string> = {
  obsidian_markdown:
    "https://raw.githubusercontent.com/kepano/obsidian-skills/main/skills/obsidian-markdown/SKILL.md",
  defuddle:
    "https://raw.githubusercontent.com/kepano/obsidian-skills/main/skills/defuddle/SKILL.md",
};

// Fetch external dependencies into shared/, with fallback to cached copies
async function syncExternalDeps(): Promise<void> {
  for (const [name, url] of Object.entries(EXTERNAL_DEPS)) {
    const dest = join(SHARED_DIR, `${name}.md`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = await res.text();
      // Strip frontmatter from fetched skills — we only want the body content
      const stripped = content.replace(/^---\n[\s\S]*?\n---\n*/, "").trim();
      const header = `<!-- Fetched from ${url} -->\n<!-- Do not edit — regenerate with: bun run gen:skill-docs -->\n\n`;
      writeFileSync(dest, header + stripped);
      console.log(`Fetched: shared/${name}.md (from ${basename(dirname(url))})`);
    } catch (err) {
      if (existsSync(dest)) {
        console.warn(`Warning: Failed to fetch ${name} from GitHub, using cached copy. (${err})`);
      } else {
        console.error(`Error: Failed to fetch ${name} from GitHub and no cached copy exists.`);
        console.error(`  URL: ${url}`);
        console.error(`  ${err}`);
        process.exit(1);
      }
    }
  }
}

await syncExternalDeps();

// Discover all SKILL.md.tmpl files (one level deep)
const templates: string[] = [];
for (const entry of readdirSync(ROOT)) {
  const tmpl = join(ROOT, entry, "SKILL.md.tmpl");
  if (existsSync(tmpl)) templates.push(tmpl);
}

if (templates.length === 0) {
  console.error("No SKILL.md.tmpl files found.");
  process.exit(1);
}

// Resolve {{PLACEHOLDER}} → shared/placeholder.md contents (cached)
const cache = new Map<string, string>();
function resolve(name: string, tmplPath: string): string {
  const key = name.toLowerCase();
  if (cache.has(key)) return cache.get(key)!;
  const file = join(SHARED_DIR, `${key}.md`);
  if (!existsSync(file)) {
    console.error(`Error: {{${name}}} in ${relative(ROOT, tmplPath)} references shared/${key}.md which does not exist.`);
    process.exit(1);
  }
  const content = readFileSync(file, "utf-8").trim();
  cache.set(key, content);
  return content;
}

const COMMENT = "\n<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->\n<!-- Regenerate: bun run gen:skill-docs -->\n";

let exitCode = 0;

for (const tmplPath of templates) {
  const skillDir = dirname(tmplPath);
  const skillName = basename(skillDir);
  const outputPath = join(skillDir, "SKILL.md");

  let content = readFileSync(tmplPath, "utf-8");

  // Replace all {{PLACEHOLDER}} markers
  content = content.replace(/\{\{(\w+)\}\}/g, (match, name) => resolve(name, tmplPath));

  // Check for unresolved placeholders
  const remaining = content.match(/\{\{(\w+)\}\}/g);
  if (remaining) {
    console.error(`Error: Unresolved placeholders in ${skillName}: ${remaining.join(", ")}`);
    process.exit(1);
  }

  // Insert comment AFTER frontmatter so Claude Code reads the description correctly
  const final = content.replace(/^(---\n[\s\S]*?\n---)\n/, `$1${COMMENT}\n`);

  if (DRY_RUN) {
    if (!existsSync(outputPath)) {
      console.error(`MISSING: ${skillName}/SKILL.md does not exist (needs generation)`);
      exitCode = 1;
    } else {
      const existing = readFileSync(outputPath, "utf-8");
      if (existing !== final) {
        console.error(`STALE: ${skillName}/SKILL.md differs from template (needs regeneration)`);
        exitCode = 1;
      } else {
        console.log(`OK: ${skillName}/SKILL.md is up to date`);
      }
    }
  } else {
    writeFileSync(outputPath, final);
    console.log(`Generated: ${skillName}/SKILL.md`);
  }
}

process.exit(exitCode);
