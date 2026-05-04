#!/usr/bin/env node
// Design-Engineer Requirement Fidelity Hook (PostToolUse)
// Injects a fidelity reminder into Claude's context after source code writes
// during active implementation (when a plan exists in .design-engineer-plugin/plans/).
// Also checks phase ordering – warns if writing files from a later phase
// before earlier phases are complete.
// Skips: plan files (prompt hook handles), tests, config, docs, plugin files.
// Fail-open: any error results in allowing the output.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_PATH = path.join(os.homedir(), '.claude', 'cache', 'de-fidelity.log');

// Only active in projects that have run /design-engineer:launch
if (!fs.existsSync(path.join(process.cwd(), '.design-engineer-plugin/config.yaml'))) {
  process.exit(0);
}

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
  '/.design-engineer-plugin/plans/',
  '/.design-engineer-plugin/prototype/',
  '/.design-engineer-plugin/temporary/',
  '/.design-engineer-plugin/design/',
  '/docs/', '/node_modules/', '/.git/',
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
    const plansDir = path.join(process.cwd(), '.design-engineer-plugin', 'plans');
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

function checkScopeDrift(filePath, phases) {
  // Flatten all phases' file lists and check if this file is in any of them
  const allPlanFiles = [];
  for (const files of Object.values(phases)) {
    allPlanFiles.push(...files);
  }

  // If no files listed in any phase, skip the check (plan may not list specific files)
  if (allPlanFiles.length === 0) return null;

  const normalized = filePath.replace(/\\/g, '/');

  for (const planFile of allPlanFiles) {
    if (normalized.endsWith(planFile) || normalized.includes(planFile)) {
      return null; // file is in scope
    }
  }

  return { file: filePath }; // drift detected – file not in any phase
}

function isSourceCode(filePath) {
  return SOURCE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function isExemptPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return EXEMPT_PATHS.some(dir => normalized.includes(dir));
}

// Component directory patterns – paths that typically contain UI components
const COMPONENT_DIRS = [
  '/components/', '/views/', '/screens/', '/widgets/',
  '/ui/', '/pages/', '/layouts/', '/features/'
];

// Frontend extensions that are likely component files
const FRONTEND_EXTENSIONS = new Set([
  '.tsx', '.jsx', '.vue', '.svelte'
]);

function isNewComponentFile(toolName, filePath) {
  // Only trigger on Write (new file creation), not Edit (modifying existing)
  if (toolName !== 'Write') return false;
  const ext = path.extname(filePath).toLowerCase();
  if (!FRONTEND_EXTENSIONS.has(ext)) return false;
  const normalized = filePath.replace(/\\/g, '/');
  return COMPONENT_DIRS.some(dir => normalized.includes(dir));
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

      // Plan file drift review – trigger background agent for independent review
      const fileName = path.basename(filePath);
      if (filePath.includes('/.design-engineer-plugin/plans/') && filePath.endsWith('.md')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const driftPatterns = [
            /I['\u2019]ve also added/i,
            /Additionally,?\s/i,
            /As a bonus/i,
            /I took the liberty/i,
            /I also included/i,
            /While I was at it/i,
            /I went ahead and/i
          ];
          const found = driftPatterns.filter(p => p.test(content));
          const keywordWarning = found.length > 0
            ? 'WARNING: Obvious drift language detected (' + found.length + ' patterns). '
            : '';

          const instruction = keywordWarning +
            'PLAN DRIFT REVIEW: A plan file was just written to ' + fileName + '. ' +
            'Spawn a background Agent to independently review this plan for requirement drift. ' +
            'The agent should read ' + filePath + ' and check: ' +
            '(1) Does it add features not explicitly requested? ' +
            '(2) Does it modify user-specified copy or naming? ' +
            '(3) Are there creative additions or unsolicited improvements? ' +
            'If drift is found, the agent should report what to remove.';

          process.stdout.write(JSON.stringify({
            hookSpecificOutput: {
              hookEventName: 'PostToolUse',
              additionalContext: instruction
            }
          }));
          appendLog('PLAN_REVIEW', filePath);
        } catch (_) {}
        return process.exit(0);
      }

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

      const toolName = data.tool_name || '';
      let reminder =
        'REQUIREMENT FIDELITY: Review what you just wrote to ' + fileName + '. ' +
        'Verify: (1) Every feature matches the approved plan exactly. ' +
        '(2) No creative additions or "improvements" beyond what the plan specifies. ' +
        '(3) No user-facing copy was modified from what was specified. ' +
        'If you added anything not in the approved plan, revert it now or ask the user first using AskUserQuestion.';

      // Component reuse check – warn when creating new component files
      if (isNewComponentFile(toolName, filePath)) {
        reminder =
          'COMPONENT REUSE: You are creating a new component file (' + fileName + '). ' +
          'Confirm: (1) No similar component exists in the project that could be extended with new variants or props. ' +
          '(2) The approved plan explicitly lists this as a new component, not an extension of an existing one. ' +
          'If a similar component exists, extend it instead of creating a duplicate. ' +
          reminder;
        appendLog('NEW_COMPONENT', filePath);
      }

      // Phase ordering + scope drift checks (fail-open – parsing errors just skip)
      const phases = parsePlanPhases(planPath);
      if (phases) {
        // Check scope drift – is this file listed in any phase?
        const drift = checkScopeDrift(filePath, phases);
        if (drift) {
          reminder =
            'SCOPE DRIFT: You are writing to ' + fileName +
            ' which is not listed in any phase of the approved plan. ' +
            'If this file is needed, update the plan first or ask the user. ' +
            'Do not add unplanned files. ' +
            reminder;
          appendLog('SCOPE_DRIFT', filePath);
        }

        // Check phase ordering – is this file from a later phase?
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

      // Content preservation check – warn on substantial content removal
      if (toolName === 'Edit' || toolName === 'MultiEdit') {
        const oldStr = toolInput.old_string || '';
        const newStr = toolInput.new_string || '';
        if (oldStr.length > 200 && newStr.length < oldStr.length * 0.7) {
          reminder =
            'CONTENT PRESERVATION: You replaced ' + oldStr.length +
            ' characters with ' + newStr.length + ' characters in ' + fileName +
            '. Verify that no important content was lost – check for removed ' +
            'explanations, configuration, reference material, or context that ' +
            'was there for a reason. ' + reminder;
          appendLog('CONTENT_LOSS', 'Substantial removal in ' + filePath + ': ' + oldStr.length + ' -> ' + newStr.length);
        }
      }

      // /simplify reminder – after every source code write
      reminder += ' MANDATORY NEXT ACTION: Run /simplify on the code you just wrote. Do not proceed to the next step, do not write more code, do not present results to the user until /simplify has reviewed this code. After running /simplify, state what it found and what was fixed.';

      // Git branch check – warn if on wrong branch for the active plan
      try {
        const { execFileSync } = require('child_process');
        const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
          encoding: 'utf8', timeout: 2000, cwd: process.cwd()
        }).trim();
        const planName = path.basename(planPath, '.md');
        // Extract slug: remove date prefix (YYYY-MM-DD-) if present
        const planSlug = planName.replace(/^\d{4}-\d{2}-\d{2}-/, '');
        if (branch === 'main' || branch === 'master') {
          reminder = 'GIT: You are on the ' + branch + ' branch but have an active plan. ' +
            'Create a feature branch: git checkout -b feat/' + planSlug + ' before making changes. ' + reminder;
          appendLog('GIT_MAIN', 'On ' + branch + ' with active plan: ' + planName);
        } else if (planSlug && !branch.includes(planSlug)) {
          reminder = 'GIT: Your branch \'' + branch + '\' does not match the active plan \'' + planName + '\'. ' +
            'Switch to the correct branch or create a new one: git checkout -b feat/' + planSlug + '. ' + reminder;
          appendLog('GIT_MISMATCH', 'Branch ' + branch + ' vs plan ' + planName);
        }
      } catch (_) {
        // fail-open: git not available or not a repo
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
