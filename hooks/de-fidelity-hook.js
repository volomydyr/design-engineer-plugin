#!/usr/bin/env node
// Design-Engineer Requirement Fidelity Hook (PostToolUse)
// Injects a fidelity reminder into Claude's context after source code writes
// during active implementation (when a plan exists in plans/).
// Also checks phase ordering – warns if writing files from a later phase
// before earlier phases are complete.
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

function getActivePlanPath() {
  try {
    const plansDir = path.join(process.cwd(), 'plans');
    if (!fs.existsSync(plansDir)) return null;
    const files = fs.readdirSync(plansDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('.'))
      .sort()
      .reverse(); // most recent first
    return files.length > 0 ? path.join(plansDir, files[0]) : null;
  } catch (_) {
    return null;
  }
}

function parsePlanPhases(planPath) {
  // Parse ## Phase N: headers and extract file paths from Create:/Modify: lines
  // Returns: { phaseNumber: [filePaths] }
  try {
    const content = fs.readFileSync(planPath, 'utf8');
    const phases = {};
    let currentPhase = null;

    for (const line of content.split('\n')) {
      // Match ## Phase N: or ## Phase N –
      const phaseMatch = line.match(/^##\s+Phase\s+(\d+)/i);
      if (phaseMatch) {
        currentPhase = parseInt(phaseMatch[1], 10);
        phases[currentPhase] = [];
        continue;
      }

      // Extract file paths from Create/Modify lines within a phase
      if (currentPhase !== null) {
        // Stop collecting files when we hit a new ## section that isn't a phase
        if (/^##\s+/.test(line) && !line.match(/^##\s+Phase/i)) {
          currentPhase = null;
          continue;
        }

        const fileMatch = line.match(/^-\s+(?:Create|Modify):\s*(.+)/i);
        if (fileMatch) {
          // Handle comma-separated or single file paths
          const paths = fileMatch[1].split(',').map(p => p.trim().replace(/`/g, ''));
          for (const p of paths) {
            if (p && p !== '[file paths]') {
              phases[currentPhase].push(p);
            }
          }
        }
      }
    }

    return phases;
  } catch (_) {
    return null;
  }
}

function checkPhaseOrder(filePath, phases) {
  // Find which phase this file belongs to
  const normalized = filePath.replace(/\\/g, '/');
  let filePhase = null;

  for (const [phase, files] of Object.entries(phases)) {
    for (const planFile of files) {
      // Match by filename or path suffix
      if (normalized.endsWith(planFile) || normalized.includes(planFile)) {
        filePhase = parseInt(phase, 10);
        break;
      }
    }
    if (filePhase !== null) break;
  }

  if (filePhase === null) return null; // file not in any phase – no warning

  // Check if earlier phases have files that haven't been touched
  const phaseNumbers = Object.keys(phases).map(Number).sort((a, b) => a - b);

  for (const earlier of phaseNumbers) {
    if (earlier >= filePhase) break;
    if (phases[earlier].length === 0) continue;

    // Check if any file from the earlier phase exists (was already created/modified)
    const earlierFilesExist = phases[earlier].some(f => {
      try {
        const fullPath = path.join(process.cwd(), f);
        return fs.existsSync(fullPath);
      } catch (_) {
        return false;
      }
    });

    // If none of the earlier phase's files exist yet, this might be out of order
    if (!earlierFilesExist) {
      return { currentPhase: filePhase, missingPhase: earlier };
    }
  }

  return null;
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
      const planPath = getActivePlanPath();
      if (!planPath) {
        appendLog('SKIP', 'No active plan – skipping: ' + filePath);
        return process.exit(0);
      }

      const fileName = path.basename(filePath);
      let reminder =
        'REQUIREMENT FIDELITY: Review what you just wrote to ' + fileName + '. ' +
        'Verify: (1) Every feature matches the approved plan exactly. ' +
        '(2) No creative additions or "improvements" beyond what the plan specifies. ' +
        '(3) No user-facing copy was modified from what was specified. ' +
        'If you added anything not in the approved plan, revert it now or ask the user first using AskUserQuestion.';

      // Phase ordering check (fail-open – parsing errors just skip this check)
      const phases = parsePlanPhases(planPath);
      if (phases) {
        const orderIssue = checkPhaseOrder(filePath, phases);
        if (orderIssue) {
          reminder =
            'PHASE ORDER WARNING: You are writing to ' + fileName +
            ' (Phase ' + orderIssue.currentPhase + '), but Phase ' +
            orderIssue.missingPhase + ' does not appear to be complete yet. ' +
            'Implement phases in order – complete Phase ' + orderIssue.missingPhase +
            ' first, present QA instructions, wait for user feedback, then proceed. ' +
            reminder;
          appendLog('PHASE_ORDER', 'Phase ' + orderIssue.currentPhase + ' file written before Phase ' + orderIssue.missingPhase + ': ' + filePath);
        }
      }

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
