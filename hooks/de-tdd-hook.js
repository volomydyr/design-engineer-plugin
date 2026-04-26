#!/usr/bin/env node
// Design-Engineer TDD Hook (PreToolUse)
// Enforces test-first development: blocks source code writes when no test
// scripts exist in tests/ during active implementation (plan exists in plans/).
// Fail-open: any error results in allowing the command.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_PATH = path.join(os.homedir(), '.claude', 'cache', 'de-tdd.log');

// Only active in projects that have run /design-engineer:start
if (!fs.existsSync(path.join(process.cwd(), '.design-engineer-plugin/config.yaml'))) {
  process.exit(0);
}

// Extensions that count as source code (require tests before writing)
const SOURCE_EXTENSIONS = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs',
  '.py', '.rb', '.go', '.rs', '.java', '.kt', '.swift',
  '.c', '.cpp', '.h', '.cs', '.php',
  '.html', '.css', '.scss', '.less', '.sass',
  '.vue', '.svelte'
]);

// Directories always exempt from TDD enforcement
const EXEMPT_DIRS = [
  '/tests/', '/test/', '/spec/', '/__tests__/',
  '/plans/', '/docs/', '/.design-system/',
  '/.claude/', '/node_modules/', '/.git/',
  '/agents/', '/skills/', '/hooks/', '/commands/'
];

function appendLog(level, message) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, `[${ts}] ${level} | ${message}\n`);
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

function hasTestScripts() {
  try {
    const testsDir = path.join(process.cwd(), 'tests');
    if (!fs.existsSync(testsDir)) return false;
    const files = fs.readdirSync(testsDir);
    return files.some(f => f.endsWith('.sh') || f.endsWith('.spec.js') || f.endsWith('.spec.ts') || f.endsWith('.test.js') || f.endsWith('.test.ts'));
  } catch (_) {
    return false;
  }
}

function isSourceCode(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return SOURCE_EXTENSIONS.has(ext);
}

function isExemptPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return EXEMPT_DIRS.some(dir => normalized.includes(dir));
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

      // Always allow test files
      if (isExemptPath(filePath)) return process.exit(0);

      // Only enforce for source code files
      if (!isSourceCode(filePath)) return process.exit(0);

      // Only enforce during active implementation (plan exists)
      if (!hasActivePlan()) {
        appendLog('SKIP', `No active plan — allowing: ${filePath}`);
        return process.exit(0);
      }

      // Check for test scripts
      if (hasTestScripts()) {
        appendLog('ALLOW', `Tests exist — allowing: ${filePath}`);
        return process.exit(0);
      }

      // Block: implementing without tests
      appendLog('DENIED', `No test scripts in tests/ — blocked: ${filePath}`);
      deny(
        'TDD violation: No test scripts found in tests/.\n' +
        'Write failing tests first using the test-writer agent before implementing code.\n' +
        'The test-writer agent creates executable Playwright CLI test scripts in tests/ that verify expected behavior.\n' +
        'Run it with: Task test-writer(plan)'
      );
      process.exit(0);
    } catch (err) {
      appendLog('ERROR', `Failed: ${err.message || err}`);
      process.exit(0); // fail-open
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
