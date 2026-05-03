#!/usr/bin/env node
// Design-Engineer Playwright-Path Hook (PreToolUse on mcp__playwright__browser_take_screenshot)
// Stops Playwright screenshots from polluting the project root by enforcing
// that every `filename` argument starts with one of the canonical paths
// the plugin documents (design/reviews/, design/craft/references/captures/,
// design/.scratch/playwright/, or tests/).
//
// Without this hook, Playwright MCP defaults to writing to process.cwd()
// when filename is omitted or relative without a directory prefix — so
// project roots accumulate stray screenshot.png / snapshot.png /
// page-1.png files across long sessions.
//
// Fail-open: any parse / IO error exits silently with code 0 so the hook
// can't accidentally block a working capture.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_PATH = path.join(os.homedir(), '.claude', 'cache', 'de-playwright-path.log');

// Only active in projects that have run /design-engineer:start
if (!fs.existsSync(path.join(process.cwd(), '.design-engineer-plugin', 'config.yaml'))) {
  process.exit(0);
}

// Canonical paths where Playwright artifacts may be written.
// - design/reviews/ — page-by-page audit captures (review.md Step A1)
// - design/craft/references/captures/ — moodboard reference captures
//   (ui-references-moodboard Step 5b)
// - design/.scratch/playwright/ — throwaway debug captures (visual
//   verification, exploratory analysis, comparisons, anything you'd
//   delete tomorrow without losing work)
// - tests/ — Playwright test snapshot fixtures and visual regression
//   baselines that live alongside the test scripts
const ALLOWED_PREFIXES = [
  'design/reviews/',
  'design/craft/references/captures/',
  'design/.scratch/playwright/',
  'tests/'
];

function appendLog(level, message) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, '[' + ts + '] ' + level + ' | ' + message + '\n');
  } catch (_) {}
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

function buildHelpMessage(filename) {
  const prefix = filename
    ? 'Playwright screenshot filename "' + filename + '" lands outside the canonical capture paths and would pollute the project. '
    : 'Playwright screenshot has no `filename` argument, so Playwright MCP would write it to the project root and pollute the working tree. ';
  return (
    prefix +
    'Use a `filename` that starts with one of:\n' +
    ALLOWED_PREFIXES.map(p => '  - ' + p).join('\n') +
    '\n\nGuidance:\n' +
    '  - Throwaway debug captures (visual verification, "let me check this URL", comparisons, exploratory analysis): ' +
    'design/.scratch/playwright/<YYYY-MM-DD-HHMMSS>/<descriptive-name>.png. The .scratch/ directory is git-ignored — clean up at any time without losing work.\n' +
    '  - Persistent audit captures (page-by-page review): design/reviews/<YYYY-MM-DD>-audit/<page-slug>/screenshot.png\n' +
    '  - Moodboard reference captures: design/craft/references/captures/<reference-slug>/<NN>-<section>.png\n' +
    '  - Playwright test fixtures and visual regression baselines: tests/<test-name>/<snapshot>.png\n' +
    '\nEnsure the parent directory exists first via `mkdir -p`. Re-run the screenshot call with the corrected `filename`.'
  );
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
      const toolInput = data.tool_input || {};
      const filename = typeof toolInput.filename === 'string' ? toolInput.filename : '';

      if (!filename) {
        appendLog('DENIED', 'no filename argument');
        deny(buildHelpMessage(''));
        return process.exit(0);
      }

      // Normalize: strip leading "./", convert backslashes to forward slashes,
      // and resolve any `..` segments so we can't be tricked by relative paths.
      const cleaned = filename.replace(/^\.\//, '').replace(/\\/g, '/');

      // Reject absolute paths (they'd ignore the canonical-paths contract entirely).
      if (path.isAbsolute(cleaned)) {
        appendLog('DENIED', 'absolute path: ' + filename);
        deny(buildHelpMessage(filename));
        return process.exit(0);
      }

      // Reject parent-directory traversal.
      if (cleaned.split('/').includes('..')) {
        appendLog('DENIED', 'parent traversal: ' + filename);
        deny(buildHelpMessage(filename));
        return process.exit(0);
      }

      const allowed = ALLOWED_PREFIXES.some(p => cleaned.startsWith(p));
      if (!allowed) {
        appendLog('DENIED', 'wrong prefix: ' + filename);
        deny(buildHelpMessage(filename));
        return process.exit(0);
      }

      appendLog('ALLOW', filename);
      process.exit(0);
    } catch (err) {
      // Fail-open on any parse/IO error
      appendLog('ERROR', 'Failed: ' + (err.message || err));
      process.exit(0);
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
