#!/usr/bin/env node
// Design-Engineer Plan Copy Hook (PostToolUse)
// Auto-copies plan files from ~/.claude/plans/ to the project's plans/ directory.
// This enables TDD hooks, fidelity hooks, /simplify reminders, and git branch checks
// which all gate on plans/ having active plan files.
// Fires on Write. Checks file_path. If in ~/.claude/plans/, copies to ./plans/.
// Fail-open: any error results in allowing the output.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Only active in projects that have run /de:start
if (!fs.existsSync(path.join(process.cwd(), '.design-engineer-plugin', 'config.yaml'))) {
  process.exit(0);
}

let input = '';
const timeout = setTimeout(() => process.exit(0), 3000);

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(timeout);
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input?.file_path || '';

    // Check if file was written to Claude's internal plans directory
    const claudePlansDir = path.join(os.homedir(), '.claude', 'plans');
    if (!filePath.startsWith(claudePlansDir)) {
      process.exit(0);
    }

    // Only copy .md files (plans, not other metadata)
    if (!filePath.endsWith('.md')) {
      process.exit(0);
    }

    // Copy to project's plans/ directory
    const fileName = path.basename(filePath);
    const projectPlansDir = path.join(process.cwd(), 'plans');

    if (!fs.existsSync(projectPlansDir)) {
      fs.mkdirSync(projectPlansDir, { recursive: true });
    }

    fs.copyFileSync(filePath, path.join(projectPlansDir, fileName));

    // Output reminder about feature branch and activated hooks
    const planSlug = fileName.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: 'PLAN COPIED: Your plan has been automatically copied to plans/' + fileName + '. ' +
          'TDD hooks, fidelity checks, and /simplify reminders are now active. ' +
          'If you are on main/master, create a feature branch now: git checkout -b feat/' + planSlug
      }
    }));
    process.exit(0);
  } catch (e) {
    process.exit(0); // fail-open
  }
});

process.stdin.on('error', () => process.exit(0));
