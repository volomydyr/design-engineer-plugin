#!/usr/bin/env node
// Design-Engineer Deliverable Path Hook (PreToolUse)
//
// Denies Write/Edit/MultiEdit to non-canonical paths under
//   .design-engineer-plugin/design/<subdir>/
//   .design-engineer-plugin/prototype/
//   .design-engineer-plugin/plans/
//
// Why: the model has been observed to improvise non-canonical folders (e.g.,
// design/strategy/) and non-canonical filenames (e.g., business-case.md instead
// of business-plan.md). Skill instructions alone do not prevent this. This hook
// catches the drift at write time and surfaces a structured deny message so the
// model self-corrects on the same turn.
//
// Pass-through (does NOT interfere) for:
//   - Any path outside .design-engineer-plugin/{design,prototype,plans}/
//   - Any path under .design-engineer-plugin/temporary/   (escape hatch)
//   - Any path under .design-engineer-plugin/memory/      (lazy-managed by skills)
//   - Plugin config files (.design-engineer-plugin/config.yaml, dependencies.yaml, .active-workflow)
//   - Product code anywhere outside .design-engineer-plugin/
//
// Fail-open: any error → allow the command (don't break the user's session
// because of a hook bug).

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_PATH = path.join(os.homedir(), '.claude', 'cache', 'de-deliverable-path.log');

// Only active in projects that have run /design-engineer:launch.
if (!fs.existsSync(path.join(process.cwd(), '.design-engineer-plugin/config.yaml'))) {
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────
// Allow-list: per-subdir Set of canonical filenames.
// Source of truth is skills/meta-setup/assets/dependencies-default.yaml.
// Update this hook AND the dependency graph together when adding a deliverable.
// ─────────────────────────────────────────────────────────────────

const FOUNDATION = new Set([
  'problem-statement.md',
  'target-audience.md',
  'assumptions.md',
  'storybrand.md',
  'business-plan.md',
]);

const RESEARCH = new Set([
  'competitor-analysis.md',
  'user-interviews.md',
  'research-findings.md',
  'interview-findings.md',
]);

const PLANNING = new Set([
  'mvp-requirements.md',
  'information-architecture.md',
]);

const EXPLORATION = new Set([
  'bias-audit.md',
  'behavior-map.md',
  'customer-journey-map.md',
  'journey-map.md',
  'ethics-review.md',
  'references.md',
  'figma-strategy.md',
]);

const PSYCHOLOGY = new Set([
  'full-scan.md',
  'master-audit.md',
  'pricing-psychology.md',
  'visual-perception.md',
  'time-perception.md',
  'emotional-retention.md',
  'social-influence.md',
  'cognitive-load.md',
  'cognitive-biases.md',
  'decision-fundamentals.md',
  'decision-persuasion.md',
  'delight-design.md',
  'engagement-patterns.md',
  'habit-formation.md',
  'simplification.md',
  'motivation-audit.md',
]);

const REVIEWS = new Set([
  'aesthetic-review.md',
  'design-to-code-qa.md',
  'full-review.md',
  'product-assessment.md',
]);

const DEV = new Set([
  'claude-md-draft.md',
  'agent-setup.md',
  'mcp-setup.md',
  'mcp-notes.md',
  'github-workflow.md',
  'starter-prompts.md',
  'kickstart-prompts.md',
  'design-system.md',
  'status.md',
  'status-tracking.md',
  'lessons-learned.md',
  'project-status.md',
  'solved-problems.md',
  'learnings.md',
]);

const ALLOWED_FILENAMES_BY_SUBDIR = {
  foundation: FOUNDATION,
  research: RESEARCH,
  planning: PLANNING,
  exploration: EXPLORATION,
  psychology: PSYCHOLOGY,
  reviews: REVIEWS,
  dev: DEV,
};

const ALLOWED_DESIGN_SUBDIRS = new Set([
  'foundation', 'research', 'planning', 'exploration',
  'psychology', 'reviews', 'dev', 'features',
]);

// Patterns for nested subtree shapes only — flat-file allow-lists are handled
// above (exact match + flow-suffixed variant). DO NOT add patterns that match
// arbitrary filenames at the flat level; that defeats the canonical filename
// enforcement.
const ALLOWED_PATTERNS = [
  // features: any file under design/features/<feature-slug>/
  /^\.design-engineer-plugin\/design\/features\/[a-z0-9][a-z0-9-]*\/[a-zA-Z0-9._-]+\.(md|html|png|jpg|jpeg|svg|webp)$/,
  // story-panels: design/exploration/story-panels/<panel-name>/<file>
  /^\.design-engineer-plugin\/design\/exploration\/story-panels\/[a-z0-9][a-z0-9-]*\/[a-zA-Z0-9._-]+\.(md|png|jpg|jpeg|svg)$/,
  // references captures: design/exploration/references/captures/<slug>/<file>
  /^\.design-engineer-plugin\/design\/exploration\/references\/captures\/[a-z0-9][a-z0-9-]*\/[a-zA-Z0-9._-]+\.(md|png|jpg|jpeg|svg|webp)$/,
  // images: design/exploration/images/{stock,prompts,generated}/<file> or manifest.md
  /^\.design-engineer-plugin\/design\/exploration\/images\/(manifest\.md$|(stock|prompts|generated)\/[a-zA-Z0-9._-]+\.(md|png|jpg|jpeg|svg|webp)$)/,
  // reviews subfolders: <YYYY-MM-DD>-audit/ or <YYYY-MM-DD>-page-by-page/<page-or-screenshot>
  /^\.design-engineer-plugin\/design\/reviews\/\d{4}-\d{2}-\d{2}-(audit|page-by-page)\/[a-zA-Z0-9._-]+(\/[a-zA-Z0-9._-]+)?\.(md|png|jpg|jpeg|svg|webp)$/,
];

// Prototype filenames
const PROTOTYPE_FILES = new Set([
  'storyboard.html',
  'prototype.html',
  'landing-page.html',
  'prototype-notes.md',
]);
const PROTOTYPE_PATTERN = /^\.design-engineer-plugin\/prototype\/[a-z0-9][a-z0-9-]*\.(html|md)$/;

// Plans: <YYYY-MM-DD>-<slug>.md or archive/<YYYY-MM-DD>-<slug>.md
const PLANS_PATTERN = /^\.design-engineer-plugin\/plans\/(archive\/)?\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9-]*\.md$/;

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function appendLog(level, message) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, `[${ts}] ${level} | ${message}\n`);
  } catch (_) {}
}

// Normalize file_path to be relative to cwd when possible, with forward slashes.
// Uses realpath on both cwd and the file's parent dir to handle filesystem
// symlinks (e.g., macOS /tmp -> /private/tmp). The file itself may not exist
// yet (Write creates it), so we realpath the deepest existing ancestor.
function normalizePath(filePath) {
  let p = filePath.replace(/\\/g, '/');
  let cwd = process.cwd().replace(/\\/g, '/');

  try {
    cwd = fs.realpathSync(cwd).replace(/\\/g, '/');
  } catch (_) {}

  if (path.isAbsolute(p)) {
    let dir = path.dirname(p);
    const basename = path.basename(p);
    // Walk up to the deepest existing ancestor and realpath it.
    while (dir.length > 1 && !fs.existsSync(dir)) {
      dir = path.dirname(dir);
    }
    try {
      const real = fs.realpathSync(dir).replace(/\\/g, '/');
      // Re-attach the not-yet-existing tail.
      const original = path.dirname(p).replace(/\\/g, '/');
      const tail = original.length > dir.length ? original.slice(dir.length) : '';
      p = real + tail + '/' + basename;
    } catch (_) {}
  }

  if (p.startsWith(cwd + '/')) p = p.slice(cwd.length + 1);
  if (p.startsWith('./')) p = p.slice(2);
  return p;
}

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
}

// ─────────────────────────────────────────────────────────────────
// Validation per category
// ─────────────────────────────────────────────────────────────────

function validateDesignPath(p) {
  // Expected: .design-engineer-plugin/design/<subdir>/<...>
  const parts = p.split('/');
  // parts: ['.design-engineer-plugin', 'design', '<subdir>', ...]
  if (parts.length < 4) {
    return {
      ok: false,
      reason:
        `Non-canonical path '${p}'. Expected '.design-engineer-plugin/design/<subdir>/<filename>' ` +
        `where <subdir> is one of: foundation, research, planning, exploration, psychology, reviews, dev, features. ` +
        `If this is a working draft, write to '.design-engineer-plugin/temporary/scratch/' instead.`,
    };
  }

  const subdir = parts[2];
  if (!ALLOWED_DESIGN_SUBDIRS.has(subdir)) {
    return {
      ok: false,
      reason:
        `Non-canonical subdir '${subdir}' under .design-engineer-plugin/design/. ` +
        `Allowed: foundation, research, planning, exploration, psychology, reviews, dev, features. ` +
        `If this is exploratory work, write to '.design-engineer-plugin/temporary/scratch/' instead. ` +
        `If this is a new deliverable category, ask the user before introducing a new subdir.`,
    };
  }

  // Try the per-subdir filename allow-list first (only for paths like design/<subdir>/<filename> with no further nesting).
  if (parts.length === 4) {
    const filename = parts[3];
    const allowed = ALLOWED_FILENAMES_BY_SUBDIR[subdir];

    if (allowed) {
      if (allowed.has(filename)) return { ok: true };

      // Allow flow-suffixed variants: <base>-<suffix>.md where <base>.md is canonical.
      // Example: bias-audit.md is canonical; bias-audit-checkout-flow.md is a flow-specific variant.
      if (filename.endsWith('.md')) {
        const stem = filename.slice(0, -3);
        for (const canonical of allowed) {
          if (!canonical.endsWith('.md')) continue;
          const canonicalStem = canonical.slice(0, -3);
          if (stem.startsWith(canonicalStem + '-')) {
            return { ok: true };
          }
        }
      }
    }

    // Fall through to ALLOWED_PATTERNS check below.
  }

  // Pattern-based allow-list (covers nested paths like features/<slug>/, reviews/<date>-audit/<page>, etc.)
  for (const pattern of ALLOWED_PATTERNS) {
    if (pattern.test(p)) return { ok: true };
  }

  // Build a hint listing canonical filenames for this subdir.
  const allowed = ALLOWED_FILENAMES_BY_SUBDIR[subdir];
  let hint = '';
  if (allowed && allowed.size > 0) {
    const sorted = [...allowed].sort().slice(0, 8).join(', ');
    hint =
      ` Canonical filenames in this subdir: ${sorted}` +
      (allowed.size > 8 ? '...' : '') + '.' +
      ` Flow-specific variants like '<base>-<feature>.md' are allowed when '<base>.md' is canonical.`;
  }

  return {
    ok: false,
    reason:
      `Non-canonical filename '${parts.slice(3).join('/')}' under .design-engineer-plugin/design/${subdir}/.${hint} ` +
      `If this is exploratory work, write to '.design-engineer-plugin/temporary/scratch/' instead. ` +
      `If you intended a documented deliverable, check the dependency graph at skills/meta-setup/assets/dependencies-default.yaml for the canonical name.`,
  };
}

function validatePrototypePath(p) {
  const parts = p.split('/');
  // Expected: .design-engineer-plugin/prototype/<filename>
  if (parts.length === 3) {
    const filename = parts[2];
    if (PROTOTYPE_FILES.has(filename)) return { ok: true };
    if (PROTOTYPE_PATTERN.test(p)) return { ok: true };
  }
  return {
    ok: false,
    reason:
      `Non-canonical prototype path '${p}'. ` +
      `Allowed filenames: storyboard.html, prototype.html, landing-page.html, prototype-notes.md, ` +
      `or any '<feature>-prototype.html' pattern (lowercase-hyphenated). ` +
      `For draft prototypes or experiments, use '.design-engineer-plugin/temporary/scratch/' instead.`,
  };
}

function validatePlansPath(p) {
  if (PLANS_PATTERN.test(p)) return { ok: true };
  return {
    ok: false,
    reason:
      `Non-canonical plan filename '${p}'. ` +
      `Plan files must match '<YYYY-MM-DD>-<slug>.md' (e.g., '2026-05-04-add-tidy-command.md') ` +
      `under .design-engineer-plugin/plans/ or .design-engineer-plugin/plans/archive/. ` +
      `<slug> must be lowercase letters, digits, and hyphens.`,
  };
}

// ─────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────

function main() {
  let input = '';
  const timeout = setTimeout(() => process.exit(0), 3000);

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
    clearTimeout(timeout);
    try {
      const data = JSON.parse(input);
      const filePath = data.tool_input && data.tool_input.file_path;

      if (!filePath || typeof filePath !== 'string') return process.exit(0);

      const p = normalizePath(filePath);

      // Pass-through: paths outside the three guarded buckets.
      const isDesignPath = p.startsWith('.design-engineer-plugin/design/');
      const isPrototypePath = p.startsWith('.design-engineer-plugin/prototype/');
      const isPlansPath = p.startsWith('.design-engineer-plugin/plans/');

      if (!isDesignPath && !isPrototypePath && !isPlansPath) {
        return process.exit(0);
      }

      // Pass-through escape hatches inside the umbrella.
      if (p.startsWith('.design-engineer-plugin/temporary/')) {
        return process.exit(0);
      }

      let result;
      if (isDesignPath) result = validateDesignPath(p);
      else if (isPrototypePath) result = validatePrototypePath(p);
      else if (isPlansPath) result = validatePlansPath(p);

      if (result.ok) {
        appendLog('ALLOW', p);
        return process.exit(0);
      }

      appendLog('DENY', `${p} | ${result.reason.slice(0, 120)}`);
      deny(result.reason);
      process.exit(0);
    } catch (err) {
      appendLog('ERROR', `Failed: ${err.message || err}`);
      process.exit(0); // fail-open
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
