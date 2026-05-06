#!/usr/bin/env node
// Design-Engineer Pipeline Completion Hook (Stop event)
//
// Scans the session transcript JSONL for required Agent dispatches when the
// dev-feature-implementation marker is set. Returns decision: "block" if
// any required agent is missing — forcing the model to dispatch the missing
// agent before the session can finish.
//
// Required dispatches (gated on context):
//   - test-writer: ≥1 (always required during dev pipeline)
//   - frontend-implementer + backend-implementer: ≥1 per plan phase
//   - psych-scanner: ≥1 if any UI files (.tsx/.jsx/.html/.svelte/.vue/.css)
//     were Edit/Write/MultiEdit'd this session
//   - design-system-auditor: exactly 1 (post-phase final audit)
//
// Probe verification (v6.6.0 plan):
//   - Probe 1 verified: tool_use entries appear in transcript JSONL with
//     name: "Agent" and input.subagent_type as a string. Confirmed by
//     reading the live session's transcript.
//
// Fail-open: any error results in not-blocking, matching de-design-
// grounding-hook.js. Better to under-enforce than to lock the user out.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_PATH = path.join(os.homedir(), '.claude', 'cache', 'de-pipeline-completion.log');
const ACTIVE_WORKFLOW_PATH = '.design-engineer-plugin/.active-workflow';
const TARGET_WORKFLOW = 'dev:feature-implementation';
const PLANS_DIR = '.design-engineer-plugin/plans';

const UI_EXTENSIONS = new Set([
  '.tsx', '.jsx', '.html', '.svelte', '.vue',
  '.css', '.scss', '.sass', '.less'
]);

function appendLog(level, message) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, '[' + ts + '] ' + level + ' | ' + message + '\n');
  } catch (_) {}
}

function readActiveWorkflow(cwd) {
  try {
    const p = path.join(cwd, ACTIVE_WORKFLOW_PATH);
    if (!fs.existsSync(p)) return null;
    const content = fs.readFileSync(p, 'utf8').split('\n')[0].trim();
    return content || null;
  } catch (_) {
    return null;
  }
}

/**
 * Find the most recent (mtime-newest) active plan file in
 * .design-engineer-plugin/plans/. Excludes the archive/ subdirectory.
 * Returns the absolute path or null if none found.
 */
function findActivePlanFile(cwd) {
  try {
    const plansAbs = path.join(cwd, PLANS_DIR);
    if (!fs.existsSync(plansAbs)) return null;
    const entries = fs.readdirSync(plansAbs);
    let best = null;
    let bestMtime = 0;
    for (const e of entries) {
      if (!e.endsWith('.md') || e.startsWith('.')) continue;
      const full = path.join(plansAbs, e);
      let stat;
      try { stat = fs.statSync(full); } catch (_) { continue; }
      if (!stat.isFile()) continue;
      if (stat.mtimeMs > bestMtime) {
        best = full;
        bestMtime = stat.mtimeMs;
      }
    }
    return best;
  } catch (_) {
    return null;
  }
}

/**
 * Count `## Phase` headings in the active plan file. Returns 0 if no plan
 * found or no phases defined (which means the dev pipeline is in setup
 * mode or otherwise non-feature work — no implementer-per-phase
 * enforcement applies).
 */
function countPlanPhases(planPath) {
  if (!planPath) return 0;
  try {
    const raw = fs.readFileSync(planPath, 'utf8');
    let count = 0;
    for (const line of raw.split('\n')) {
      if (/^##\s+Phase\s+\d/i.test(line)) count++;
    }
    return count;
  } catch (_) {
    return 0;
  }
}

/**
 * Scan the transcript JSONL for tool_use entries. Returns an object with:
 *   agentCounts: { <subagent_type>: count }
 *   uiEditCount: number of Edit/Write/MultiEdit calls targeting UI extensions
 */
function scanTranscript(transcriptPath) {
  const result = { agentCounts: {}, uiEditCount: 0 };
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return result;

  try {
    const raw = fs.readFileSync(transcriptPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      let entry;
      try { entry = JSON.parse(trimmed); } catch (_) { continue; }

      walk(entry, result);
    }
  } catch (_) {
    // Fail-open: skip scan
  }
  return result;
}

function walk(obj, result, depth) {
  depth = depth || 0;
  if (depth > 12) return;
  if (Array.isArray(obj)) {
    for (const v of obj) walk(v, result, depth + 1);
    return;
  }
  if (obj && typeof obj === 'object') {
    if (obj.type === 'tool_use') {
      const name = obj.name;
      const input = obj.input || {};
      if (name === 'Agent') {
        const sub = (input.subagent_type || '').toString().toLowerCase();
        if (sub) {
          result.agentCounts[sub] = (result.agentCounts[sub] || 0) + 1;
        }
      } else if (name === 'Edit' || name === 'Write' || name === 'MultiEdit') {
        const fp = (input.file_path || '').toString();
        const ext = path.extname(fp).toLowerCase();
        if (UI_EXTENSIONS.has(ext)) {
          result.uiEditCount++;
        }
      }
    }
    for (const v of Object.values(obj)) {
      walk(v, result, depth + 1);
    }
  }
}

/**
 * Determine which required dispatches are missing given the session state.
 * Returns an array of human-readable strings naming the deficits.
 */
function findMissingDispatches(scan, phaseCount) {
  const missing = [];
  const a = scan.agentCounts;
  const got = (name) => a[name] || 0;

  // test-writer always required
  if (got('test-writer') < 1) {
    missing.push('test-writer (0/1) — Task(test-writer, plan_path=<path>) writes the failing Playwright tests for the Red phase before any production code is written.');
  }

  // implementers — at least one per phase. Phases come from the active plan.
  if (phaseCount > 0) {
    const implCount = got('frontend-implementer') + got('backend-implementer');
    if (implCount < phaseCount) {
      missing.push(`frontend-implementer + backend-implementer combined (${implCount}/${phaseCount} phases) — each plan phase needs at least one implementer dispatch. Use Task(frontend-implementer, ...) for UI work or Task(backend-implementer, ...) for backend work.`);
    }
  }

  // psych-scanner required if any UI file was edited
  if (scan.uiEditCount > 0 && got('psych-scanner') < 1) {
    missing.push(`psych-scanner (0/1) — ${scan.uiEditCount} UI file edit(s) detected this session. Task(psych-scanner, target=<changed files or pages>) reports prioritized findings across 100+ cognitive principles before the phase is declared done.`);
  }

  // design-system-auditor required exactly once after all phases
  if (phaseCount > 0 && got('design-system-auditor') < 1) {
    missing.push('design-system-auditor (0/1) — Task(design-system-auditor, scope=<changed paths>) audits design system compliance + 4-lens aesthetic critique + AI Slop Test before the implementation is presented to the user. Required after the final phase.');
  }

  return missing;
}

function emitBlock(reason) {
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: reason
  }));
}

function main() {
  let input = '';
  const timeout = setTimeout(() => process.exit(0), 4000);

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
    clearTimeout(timeout);
    try {
      const data = JSON.parse(input || '{}');
      const cwd = data.cwd || process.cwd();
      const transcriptPath = data.transcript_path || '';
      const stopHookActive = data.stop_hook_active === true;

      // If stop_hook_active is true, the model is already mid-stop-hook
      // continuation. Don't loop — let it finish.
      if (stopHookActive) {
        appendLog('SKIP', 'stop_hook_active=true (avoid loop)');
        return process.exit(0);
      }

      // Gate: only fires during dev:feature-implementation
      const workflow = readActiveWorkflow(cwd);
      if (workflow !== TARGET_WORKFLOW) {
        appendLog('SKIP', 'workflow=' + (workflow || 'none') + ' (not dev pipeline)');
        return process.exit(0);
      }

      const planPath = findActivePlanFile(cwd);
      const phaseCount = countPlanPhases(planPath);
      const scan = scanTranscript(transcriptPath);

      // Log every Agent dispatch we saw — visible drift if the schema
      // changes in a future Anthropic release
      const agentSummary = Object.keys(scan.agentCounts).length === 0
        ? 'none'
        : Object.entries(scan.agentCounts).map(([k, v]) => `${k}=${v}`).join(', ');
      appendLog('SCAN', `phases=${phaseCount} agents=[${agentSummary}] uiEdits=${scan.uiEditCount}`);

      const missing = findMissingDispatches(scan, phaseCount);
      if (missing.length === 0) {
        appendLog('ALLOW', 'all required dispatches present');
        return process.exit(0);
      }

      const reason =
        'Required agents have not run this session during /design-engineer:development. ' +
        'Agents are not optional — each one encodes specialised behavior the main model cannot reliably duplicate ' +
        '(test-writer: TDD anti-pattern catalog; frontend/backend-implementer: Gallery Contract + design-token compliance + Figma fidelity; ' +
        'psych-scanner: 100+ cognitive principles; design-system-auditor: FAIL-severity gallery audit + 4-lens critique + AI Slop Test).\n\n' +
        'Missing dispatches:\n' +
        missing.map(m => '  • ' + m).join('\n') +
        '\n\nDispatch each missing agent now via the Task tool. After they return, you may finish the session.';

      appendLog('BLOCKED', `missing=${missing.length}`);
      emitBlock(reason);
      process.exit(0);
    } catch (err) {
      appendLog('ERROR', 'Failed: ' + (err.message || err));
      process.exit(0);  // fail-open
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
