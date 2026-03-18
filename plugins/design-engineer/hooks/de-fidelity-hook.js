#!/usr/bin/env node
// Design-Engineer Requirement Fidelity Hook (PostToolUse)
// Injects a fidelity reminder into Claude's context after source code writes
// during active implementation (when a plan exists in plans/).
// Skips: plan files (prompt hook handles), tests, config, docs, plugin files.
// Fail-open: any error results in allowing the output.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_PATH = path.join(os.homedir(), '.claude', 'cache', 'de-fidelity.log');

// Source code extensions that warrant a fidelity check
const SOURCE_EXTENSIONS = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs',
  '.py', '.rb', '.go', '.rs', '.java', '.kt', '.swift',
  '.c', '.cpp', '.h', '.cs', '.php',
  '.html', '.css', '.scss', '.less', '.sass',
  '.vue', '.svelte'
]);

// Paths that are always exempt from fidelity checks
const EXEMPT_PATHS = [
  '/tests/', '/test/', '/spec/', '/__tests__/',
  '/plans/', '/docs/', '/node_modules/', '/.git/',
  '/agents/', '/skills/', '/hooks/', '/commands/',
  '/.claude/', '/.design-system/'
];

function appendLog(level, message) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, '[' + ts + '] ' + level + ' | ' + message + '\n');
  } catch (_) {}
}

function hasActivePlan() {
  try {
    const plansDir = path.join(process.cwd(), 'plans');
    if (!fs.existsSync(plansDir)) return false;
    const files = fs.readdirSync(plansDir);
    return files.some(f => f.endsWith('.md') && !f.startsWith('.'));
  } catch (_) {
    return false;
  }
}

function isSourceCode(filePath) {
  return SOURCE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function isExemptPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return EXEMPT_PATHS.some(dir => normalized.includes(dir));
}

function main() {
  let input = '';
  const timeout = setTimeout(() => process.exit(0), 3000);

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
    clearTimeout(timeout);
    try {
      const data = JSON.parse(input);
      const toolInput = data.tool_input || {};
      const filePath = toolInput.file_path || toolInput.path || '';

      if (!filePath) return process.exit(0);

      // Skip exempt paths (tests, plans, plugin files, etc.)
      if (isExemptPath(filePath)) return process.exit(0);

      // Skip non-source-code files
      if (!isSourceCode(filePath)) return process.exit(0);

      // Only enforce during active implementation
      if (!hasActivePlan()) {
        appendLog('SKIP', 'No active plan — skipping: ' + filePath);
        return process.exit(0);
      }

      // Inject fidelity reminder
      const fileName = path.basename(filePath);
      const reminder =
        'REQUIREMENT FIDELITY: Review what you just wrote to ' + fileName + '. ' +
        'Verify: (1) Every feature matches the approved plan exactly. ' +
        '(2) No creative additions or "improvements" beyond what the plan specifies. ' +
        '(3) No user-facing copy was modified from what was specified. ' +
        'If you added anything not in the approved plan, revert it now or ask the user first using AskUserQuestion.';

      appendLog('REMIND', filePath);

      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: reminder
        }
      }));
      process.exit(0);
    } catch (err) {
      appendLog('ERROR', 'Failed: ' + (err.message || err));
      process.exit(0); // fail-open
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
