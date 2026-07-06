#!/usr/bin/env node
// Design-Engineer Playwright-Path Hook (PreToolUse on browser_take_screenshot,
// matched for both the bundled server, mcp__plugin_design-engineer_playwright__*,
// and a user-installed standalone mcp__playwright__* server).
// Stops Playwright screenshots from polluting the project root by enforcing
// that every `filename` argument lives under one of the canonical prefixes
// from CLAUDE.md's Playwright filesystem hygiene table: the plugin's umbrella
// directory .design-engineer-plugin/, or tests/ for test fixtures and visual
// regression baselines.
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

// Allowed prefixes: every Playwright capture must live under the plugin's
// umbrella directory, or under tests/ for committed test fixtures and visual
// regression baselines (per CLAUDE.md's canonical table).
const ALLOWED_PREFIXES = ['.design-engineer-plugin/', 'tests/'];

// Only active in projects that have run /design-engineer:launch
if (!fs.existsSync(path.join(process.cwd(), '.design-engineer-plugin', 'config.yaml'))) {
  process.exit(0);
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
    'Use a `filename` that starts with ' + ALLOWED_PREFIXES.join(' or ') + ' (for example ' +
    '.design-engineer-plugin/temporary/playwright/<descriptive-name>.png for throwaway captures, ' +
    '.design-engineer-plugin/design/reviews/<slug>/screenshot.png for audit captures, ' +
    'or tests/<test-name>/<snapshot>.png for test fixtures and visual regression baselines). ' +
    'Ensure the parent directory exists first via `mkdir -p`, then re-run the screenshot call with the corrected `filename`.'
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
        deny(buildHelpMessage(''));
        return process.exit(0);
      }

      // Normalize: strip leading "./", convert backslashes to forward slashes.
      const cleaned = filename.replace(/^\.\//, '').replace(/\\/g, '/');

      // Reject absolute paths and parent-directory traversal, then enforce the
      // allowed prefixes.
      const offPath =
        path.isAbsolute(cleaned) ||
        cleaned.split('/').includes('..') ||
        !ALLOWED_PREFIXES.some(p => cleaned.startsWith(p));

      if (offPath) {
        deny(buildHelpMessage(filename));
        return process.exit(0);
      }

      process.exit(0);
    } catch (err) {
      // Fail-open on any parse/IO error
      process.exit(0);
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
