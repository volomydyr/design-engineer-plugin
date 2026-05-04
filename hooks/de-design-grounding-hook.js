#!/usr/bin/env node
// Design-Engineer Design-Grounding Hook (PreToolUse)
// Hard-blocks UI Writes/Edits during plan execution unless required design
// knowledge has been Read this session and references.md exists in the project.
// If prototype.html exists, it must also have been Read (no creative deviation).
// Fail-open: any error results in allowing the command.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_PATH = path.join(os.homedir(), '.claude', 'cache', 'de-design-grounding.log');

// Only active in projects that have run /product:launch
if (!fs.existsSync(path.join(process.cwd(), '.design-engineer-plugin', 'config.yaml'))) {
  process.exit(0);
}

// File extensions that count as UI/visual code (gate triggers)
const UI_EXTENSIONS = new Set([
  '.tsx', '.jsx', '.html', '.svelte', '.vue', '.astro',
  '.css', '.scss', '.sass', '.less'
]);

// Paths always exempt (plugin internals, tests, plans, dependencies)
const EXEMPT_PATHS = [
  '/tests/', '/test/', '/spec/', '/__tests__/',
  '/.design-engineer-plugin/plans/', '/docs/', '/node_modules/', '/.git/',
  '/agents/', '/skills/', '/hooks/', '/commands/',
  '/.claude/', '/.design-system/',
  '/prototype/'  // editing the prototype itself is allowed
];

// Required design knowledge files (basename match in transcript Reads).
// Use file basenames so we are robust to absolute vs relative path forms.
const REQUIRED_READ_BASENAMES = [
  'anti-patterns.md',          // ui-aesthetic-review/references/anti-patterns.md
  'anti-slop-writing.md',      // shared-references/anti-slop-writing.md
  'design-intent-guide.md'     // ui-references-moodboard/references/design-intent-guide.md
];

// Possible references.md locations (canonical post-v5.5.0 path under the
// .design-engineer-plugin/ umbrella; we keep two candidates because
// ui-references-moodboard sometimes writes under references/captures/ and
// sometimes flat).
const REFERENCES_MD_CANDIDATES = [
  '.design-engineer-plugin/design/exploration/references/references.md',
  '.design-engineer-plugin/design/exploration/references.md'
];

// Design-system reference file locations. Both are written by the
// `ui-design-system` skill (Step 5: .design-engineer-plugin/design/dev/design-system.md;
// Step 6: .design-system/system.md). When either exists, the project
// has its own documented design system and that file becomes a
// required Read alongside the three plugin-internal docs. Stack-
// agnostic by design — the plugin does not commit to tailwind,
// SwiftUI tokens, or any framework-specific source. Whatever the
// user put in their design-system.md is the source of truth.
const DESIGN_SYSTEM_CANDIDATES = [
  '.design-system/system.md',
  '.design-engineer-plugin/design/dev/design-system.md'
];

// prototype.html lives at project root in prototype/. The init script
// (init-project-structure.sh) creates it there as a sibling of design/.
const PROTOTYPE_HTML_CANDIDATES = [
  '.design-engineer-plugin/prototype/prototype.html'
];

// Regex patterns that match a single CSS / style / Tailwind property
// swap. Used to detect "trivial" swaps that should bypass the full
// Pre-Flight ritual. Order doesn't matter; any match qualifies.
const SINGLE_PROPERTY_PATTERNS = [
  // CSS property: value;
  /\b(color|background(-color)?|fill|stroke|border-color|border|padding|margin|gap|width|height|font-size|line-height|font-weight|border-radius|opacity|box-shadow|outline)\s*:\s*[^;]+;?/i,
  // React inline style { key: 'value' }
  /(backgroundColor|color|fill|stroke|padding|margin|gap|width|height|fontSize|fontWeight|borderRadius|opacity|boxShadow)\s*:\s*['"`][^'"`]*['"`]/,
  // Tailwind utility class swap (single class)
  /\b(bg|text|fill|stroke|border|p|m|gap|w|h|font|rounded|opacity|shadow)-[a-z0-9-]+\b/
];

function appendLog(level, message) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, '[' + ts + '] ' + level + ' | ' + message + '\n');
  } catch (_) {}
}

function isUiFile(filePath) {
  return UI_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function isExemptPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return EXEMPT_PATHS.some(dir => normalized.includes(dir));
}

function hasActivePlan() {
  try {
    const plansDir = path.join(process.cwd(), 'plans');
    if (!fs.existsSync(plansDir)) return false;
    return fs.readdirSync(plansDir).some(f => f.endsWith('.md') && !f.startsWith('.'));
  } catch (_) {
    return false;
  }
}

function findReferencesMd() {
  for (const rel of REFERENCES_MD_CANDIDATES) {
    if (fs.existsSync(path.join(process.cwd(), rel))) return rel;
  }
  return null;
}

function findPrototypeHtml() {
  for (const rel of PROTOTYPE_HTML_CANDIDATES) {
    if (fs.existsSync(path.join(process.cwd(), rel))) return rel;
  }
  return null;
}

function findDesignSystemFile() {
  for (const rel of DESIGN_SYSTEM_CANDIDATES) {
    if (fs.existsSync(path.join(process.cwd(), rel))) return rel;
  }
  return null;
}

/**
 * Compute the line-count of a change from tool_input. Conservative — for
 * Edit / MultiEdit, returns the larger of old vs new line counts so a tiny
 * deletion doesn't classify as trivial just because new_string is empty.
 */
function computeChangeSize(toolName, toolInput) {
  if (!toolInput) return 0;
  const lc = s => (s ? String(s).split('\n').length : 0);
  if (toolName === 'Write') {
    return lc(toolInput.content);
  }
  if (toolName === 'Edit') {
    return Math.max(lc(toolInput.old_string), lc(toolInput.new_string));
  }
  if (toolName === 'MultiEdit') {
    let total = 0;
    for (const e of (toolInput.edits || [])) {
      total += Math.max(lc(e.old_string), lc(e.new_string));
    }
    return total;
  }
  return 0;
}

/**
 * True iff the change is small AND looks like a single CSS / style / Tailwind
 * property swap. Used to identify "trivial" UI tweaks (color change, spacing
 * tweak, border-radius adjust) that should skip the full 5-field Pre-Flight
 * and the 3-agent /simplify fan-out. Write is never trivial — creating a new
 * file always warrants full grounding.
 */
function isSinglePropertySwap(toolName, toolInput) {
  if (toolName !== 'Edit' && toolName !== 'MultiEdit') return false;
  const matchesAnyPattern = s => SINGLE_PROPERTY_PATTERNS.some(re => re.test(s));
  if (toolName === 'Edit') {
    const oldStr = toolInput.old_string || '';
    const newStr = toolInput.new_string || '';
    if (oldStr.split('\n').length > 3 || newStr.split('\n').length > 3) return false;
    return matchesAnyPattern(oldStr) && matchesAnyPattern(newStr);
  }
  // MultiEdit
  const edits = toolInput.edits || [];
  if (edits.length === 0 || edits.length > 3) return false;
  return edits.every(e => {
    const oldStr = e.old_string || '';
    const newStr = e.new_string || '';
    if (oldStr.split('\n').length > 3 || newStr.split('\n').length > 3) return false;
    return matchesAnyPattern(oldStr) && matchesAnyPattern(newStr);
  });
}

/**
 * Classify the change into trivial / medium / large. The model uses this
 * (via the deny message text) to scale the Pre-Flight depth and the
 * /simplify call.
 */
function classifyTier(toolName, toolInput) {
  const size = computeChangeSize(toolName, toolInput);
  if (size <= 5 && isSinglePropertySwap(toolName, toolInput)) return 'trivial';
  if (size <= 50) return 'medium';
  return 'large';
}

const TIER_INSTRUCTIONS = (
  '\n\nPre-Flight + /simplify scaling (output the right depth for THIS edit and ALL subsequent edits this session):\n' +
  '  - Trivial (≤5 lines, single CSS/style/Tailwind property or token swap): output one line — `WHY: <reason>`. ' +
  'No Domain Exploration, no Signature Test, no 5-field block. Inline self-review only — do NOT call /simplify with agent fan-out.\n' +
  '  - Medium (≤50 lines): output compact Pre-Flight (Intent + WHY + anti-pattern self-check). Skip Domain Exploration + Signature Test. Run /simplify once.\n' +
  '  - Large (>50 lines OR new file): full Pre-Flight (Intent / Domain Exploration / WHY / anti-pattern self-check / Signature Test). Run /simplify with full review.\n'
);

/**
 * Scan transcript JSONL for Read tool calls. Returns a Set of basenames
 * that were Read in this session.
 */
function getReadBasenames(transcriptPath) {
  const reads = new Set();
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return reads;
  try {
    const raw = fs.readFileSync(transcriptPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const entry = JSON.parse(trimmed);
        // The transcript format wraps tool calls; we look for tool_use/tool_result
        // patterns. Cast a wide net by stringifying and matching file_path tokens.
        const flat = JSON.stringify(entry);
        // Look for any "file_path":"...filename" pattern (Read tool input)
        const matches = flat.match(/"file_path":"[^"]+"/g);
        if (matches) {
          for (const m of matches) {
            const fp = m.match(/"file_path":"([^"]+)"/);
            if (fp && fp[1]) {
              reads.add(path.basename(fp[1]));
              reads.add(fp[1].replace(/\\/g, '/'));  // also keep full path form
            }
          }
        }
      } catch (_) {
        // Skip malformed lines
      }
    }
  } catch (_) {
    // Fail-open: if we can't read transcript, skip enforcement
  }
  return reads;
}

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason
    }
  }));
}

function buildPluginRoot() {
  // Prefer the env var injected by the start-state hook
  if (process.env.DESIGN_ENGINEER_PLUGIN_ROOT) {
    return process.env.DESIGN_ENGINEER_PLUGIN_ROOT;
  }
  // Fallback: this file lives at <plugin-root>/hooks/de-design-grounding-hook.js
  return path.dirname(__dirname);
}

function main() {
  let input = '';
  const timeout = setTimeout(() => process.exit(0), 3000);

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
    clearTimeout(timeout);
    try {
      const data = JSON.parse(input || '{}');
      const toolName = data.tool_name || '';
      const toolInput = data.tool_input || {};
      const filePath = toolInput.file_path || '';
      const transcriptPath = data.transcript_path || '';

      if (!filePath) return process.exit(0);

      // Only enforce for UI files
      if (!isUiFile(filePath)) return process.exit(0);

      // Skip plugin internals and exempt paths
      if (isExemptPath(filePath)) return process.exit(0);

      // Only enforce during active implementation (plan exists in .design-engineer-plugin/plans/)
      if (!hasActivePlan()) {
        appendLog('SKIP', 'No active plan – allowing: ' + filePath);
        return process.exit(0);
      }

      const pluginRoot = buildPluginRoot();
      const reads = getReadBasenames(transcriptPath);
      const tier = classifyTier(toolName, toolInput);

      // Check 1: prototype.html must be Read if it exists
      const prototypeRel = findPrototypeHtml();
      if (prototypeRel) {
        const proto = path.basename(prototypeRel);
        if (!reads.has(proto) && !reads.has(prototypeRel)) {
          appendLog('DENIED', 'Prototype not Read: ' + filePath);
          deny(
            'Prototype exists at ' + prototypeRel + ' but you have not Read it this session. ' +
            'Read it first – your implementation must match its layout, spacing, typography, and color choices. ' +
            'No creative deviation. Run: Read ' + path.join(process.cwd(), prototypeRel)
          );
          return process.exit(0);
        }
      }

      // Check 2: references.md must exist on disk
      const referencesRel = findReferencesMd();
      if (!referencesRel) {
        appendLog('DENIED', 'No references.md: ' + filePath);
        deny(
          'No references.md found in any of: ' + REFERENCES_MD_CANDIDATES.join(', ') + '. ' +
          'Before writing UI, establish design intent: who is this user (a specific person, not "users"), ' +
          'what verb must they perform (the actual action), how should it feel ' +
          '(warm like a notebook / cold like a terminal / dense like a trading floor / calm like a reading app – ' +
          'NEVER "clean and modern"). Save this to .design-engineer-plugin/design/exploration/references/references.md ' +
          'or run the ui-references-moodboard skill first.'
        );
        return process.exit(0);
      }

      // Check 3: required design-knowledge files must be Read this session.
      // Trivial swaps (single CSS/style property or token rename) skip this
      // check — the operating-procedure docs are heavy ritual that pays off
      // on creative work, not on a one-line color tweak. Trivial edits still
      // require the prototype + references.md gates above (those are about
      // whether the user is in a UI-implementation context at all, not about
      // depth of the change).
      if (tier !== 'trivial') {
        const missing = REQUIRED_READ_BASENAMES.filter(b => !reads.has(b));
        if (missing.length > 0) {
          const fullPaths = missing.map(b => {
            if (b === 'anti-patterns.md') return path.join(pluginRoot, 'skills/ui-aesthetic-review/references/anti-patterns.md');
            if (b === 'anti-slop-writing.md') return path.join(pluginRoot, 'skills/shared-references/anti-slop-writing.md');
            if (b === 'design-intent-guide.md') return path.join(pluginRoot, 'skills/ui-references-moodboard/references/design-intent-guide.md');
            return b;
          });
          appendLog('DENIED', 'Missing Reads (tier=' + tier + '): ' + missing.join(',') + ' for: ' + filePath);
          deny(
            'Required design knowledge not yet Read this session: ' + missing.join(', ') + '. ' +
            'Read these files BEFORE any UI Write – they contain the operating procedure for crafted output ' +
            '(WHY Checkpoint, AI Slop Test, named tests, anti-pattern catalog). ' +
            'Files to Read:\n' +
            fullPaths.map(p => '  - ' + p).join('\n') +
            TIER_INSTRUCTIONS
          );
          return process.exit(0);
        }
      }

      // Check 4: project's own design-system reference must be Read if it
      // exists. Both candidate paths are documented outputs of the
      // ui-design-system skill (Step 5 / Step 6). When neither exists, the
      // project hasn't run that skill yet and this check is a no-op. Stack-
      // agnostic: whether the file describes Tailwind tokens, SwiftUI
      // semantic colors, Jetpack Compose theme, or something else, the
      // user wrote it and the model must Read it.
      const designSystemRel = findDesignSystemFile();
      if (designSystemRel) {
        const dsBase = path.basename(designSystemRel);
        if (!reads.has(dsBase) && !reads.has(designSystemRel)) {
          appendLog('DENIED', 'Design system not Read: ' + designSystemRel + ' (tier=' + tier + ') for: ' + filePath);
          const trivialNote = tier === 'trivial'
            ? 'For this trivial swap, you only need to Read this one file plus output a 1-line WHY in chat — no full Pre-Flight required.'
            : '';
          deny(
            'Project design-system reference not Read this session: ' + designSystemRel + '. ' +
            'Read it before writing UI — it documents the project\'s tokens, components, and design decisions. ' +
            'Run: Read ' + path.join(process.cwd(), designSystemRel) +
            (trivialNote ? '\n\n' + trivialNote : '') +
            (tier !== 'trivial' ? TIER_INSTRUCTIONS : '')
          );
          return process.exit(0);
        }
      }

      // All checks passed
      appendLog('ALLOW', 'tier=' + tier + ' file=' + filePath);
      process.exit(0);
    } catch (err) {
      appendLog('ERROR', 'Failed: ' + (err.message || err));
      process.exit(0);  // fail-open
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
