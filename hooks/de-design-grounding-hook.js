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

// Only active in projects that have run /design-engineer:start
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
  '/plans/', '/docs/', '/node_modules/', '/.git/',
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

// Possible references.md locations (the project may have either layout)
const REFERENCES_MD_CANDIDATES = [
  'design/craft/references/references.md',
  'design/craft/references.md',
  'design/references/references.md',
  'design/references.md'
];

// prototype.html lives at project root in prototype/. The init script
// (init-project-structure.sh) creates it there as a sibling of design/.
const PROTOTYPE_HTML_CANDIDATES = [
  'prototype/prototype.html'
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
      const filePath = (data.tool_input && data.tool_input.file_path) || '';
      const transcriptPath = data.transcript_path || '';

      if (!filePath) return process.exit(0);

      // Only enforce for UI files
      if (!isUiFile(filePath)) return process.exit(0);

      // Skip plugin internals and exempt paths
      if (isExemptPath(filePath)) return process.exit(0);

      // Only enforce during active implementation (plan exists in plans/)
      if (!hasActivePlan()) {
        appendLog('SKIP', 'No active plan – allowing: ' + filePath);
        return process.exit(0);
      }

      const pluginRoot = buildPluginRoot();
      const reads = getReadBasenames(transcriptPath);

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
          'NEVER "clean and modern"). Save this to design/craft/references/references.md ' +
          'or run the ui-references-moodboard skill first.'
        );
        return process.exit(0);
      }

      // Check 3: required design-knowledge files must be Read this session
      const missing = REQUIRED_READ_BASENAMES.filter(b => !reads.has(b));
      if (missing.length > 0) {
        const fullPaths = missing.map(b => {
          if (b === 'anti-patterns.md') return path.join(pluginRoot, 'skills/ui-aesthetic-review/references/anti-patterns.md');
          if (b === 'anti-slop-writing.md') return path.join(pluginRoot, 'skills/shared-references/anti-slop-writing.md');
          if (b === 'design-intent-guide.md') return path.join(pluginRoot, 'skills/ui-references-moodboard/references/design-intent-guide.md');
          return b;
        });
        appendLog('DENIED', 'Missing Reads: ' + missing.join(',') + ' for: ' + filePath);
        deny(
          'Required design knowledge not yet Read this session: ' + missing.join(', ') + '. ' +
          'Read these files BEFORE any UI Write – they contain the operating procedure for crafted output ' +
          '(WHY Checkpoint, AI Slop Test, named tests, anti-pattern catalog). ' +
          'Also output the Design Grounding Pre-Flight block (Intent / Domain Exploration / WHY / anti-pattern self-check / Signature Test) ' +
          'before generating any code. Files to Read:\n' +
          fullPaths.map(p => '  - ' + p).join('\n')
        );
        return process.exit(0);
      }

      // All checks passed
      appendLog('ALLOW', filePath);
      process.exit(0);
    } catch (err) {
      appendLog('ERROR', 'Failed: ' + (err.message || err));
      process.exit(0);  // fail-open
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
