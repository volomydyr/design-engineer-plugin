#!/usr/bin/env node
// Design-Engineer Drift Audit Hook (PostToolUse on Agent)
//
// Fires after every frontend-implementer / backend-implementer Agent dispatch
// during dev:feature-implementation. Forces the main model to produce an
// EXPLICIT, visible per-element drift audit before continuing — every
// user-facing string in the implementer's output must be traced to either
// decisions.md, mvp-requirements.md, information-architecture.md, or
// references.md, OR admitted as drift requiring removal.
//
// The problem this solves (v6.7.0): even with v6.6.0's pre-plan dialogue
// gate, the model still invents features mid-implementation that nobody
// asked for — heart icons, "TRUSTED SELLER" badges, shipping/returns copy
// from a marketplace pattern, newsletter opt-ins, etc. The existing
// de-fidelity-hook.js injects a generic "review what you wrote" reminder,
// which the model self-passes silently. This hook makes the audit visible:
// the user sees every element being traced or admitted as drift.
//
// Architecture:
//   - PostToolUse, matcher: Agent
//   - Gate: only fires when active-workflow marker = dev:feature-implementation
//     AND tool_input.subagent_type is frontend-implementer or backend-implementer
//   - Reads upstream deliverables from disk to surface their named features
//     by reference (so the audit prompt mentions specific F-list entries
//     and decision categories the model should match against)
//   - Emits additionalContext requiring an explicit "Drift audit" block
//     in the next chat turn before any further work
//
// Fail-open on errors.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_PATH = path.join(os.homedir(), '.claude', 'cache', 'de-drift-audit.log');
const ACTIVE_WORKFLOW_PATH = '.design-engineer-plugin/.active-workflow';
const TARGET_WORKFLOW = 'dev:feature-implementation';

const TARGET_AGENTS = new Set(['frontend-implementer', 'backend-implementer']);

const SOURCE_FILES = [
  '.design-engineer-plugin/development/decisions.md',
  '.design-engineer-plugin/design/planning/mvp-requirements.md',
  '.design-engineer-plugin/design/planning/information-architecture.md',
  '.design-engineer-plugin/design/exploration/references.md',
  '.design-engineer-plugin/design/foundation/storybrand.md'
];

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
    return fs.readFileSync(p, 'utf8').split('\n')[0].trim() || null;
  } catch (_) {
    return null;
  }
}

/**
 * Return the list of source-of-truth files that exist on disk for this
 * project. The audit prompt names these by path so the model knows
 * exactly which files to cross-check against.
 */
function findExistingSources(cwd) {
  const found = [];
  for (const rel of SOURCE_FILES) {
    if (fs.existsSync(path.join(cwd, rel))) found.push(rel);
  }
  return found;
}

function buildAuditContext(sources, agentType) {
  const sourceList = sources.length === 0
    ? '(none on disk yet — surface this gap to the user before continuing)'
    : sources.map(s => '  • ' + s).join('\n');

  return `\n\n[Drift audit REQUIRED before continuing]\n\nThe ${agentType} agent just returned. Before any further work — before /simplify, before psych-scanner, before presenting the phase to the user — you MUST output a structured "Drift audit" block in chat.\n\nThe purpose: every dev session in this plugin so far has produced UI elements that NEITHER the upstream MVP spec NOR the user's pre-plan decisions called for (heart icons, "TRUSTED SELLER" badges, shipping/returns copy mimicking marketplace patterns, newsletter opt-ins, decorative dot-separators, "Details" popovers, etc.). The model invents these because matching a visual reference is easier than building strictly to spec. The drift audit is the structural fix: list every user-facing element you just produced, trace it to a specific source line, and admit anything you can't trace.\n\nSource-of-truth files for this project (cross-check the implementer's output against THESE):\n${sourceList}\n\nRequired output format (chat-only, before any other action):\n\n  ## Drift audit — <feature name>\n  \n  ### Traced elements (everything that maps to a source)\n  - <element> — from <source file>: "<exact quote or feature ID>"\n  - <element> — from <source file>: "<exact quote or feature ID>"\n  - …\n  \n  ### Drift candidates (elements with no upstream basis)\n  - <element> — invented; not in any source. Recommended action: remove / ask user / move to follow-up.\n  - …\n  \n  ### Recommendation\n  - <one of: "no drift detected, proceed" / "N drift items found, removing them now" / "N drift items found, asking the user before proceeding">\n\nWhat counts as a "user-facing element": every <button>, <a>, <img>, headline, label, placeholder, CTA copy string, badge, icon, chip, modal title, error message, empty state, tooltip, footer text, and similar. Group by component if there are many.\n\nWhat counts as "traced": the element matches a feature ID, a quoted phrase, a decision-document choice, or a screen item from the IA. "It's reasonable for an e-commerce page" is NOT a trace — that's marketplace-pattern mimicry.\n\nWhat counts as "drift": ANY element that isn't named in any of the source files above. The bar is strict on scope, flexible on execution: implementation details (variable names, component file paths, technical patterns) are NOT drift; user-facing scope (features, copy, UI affordances) IS.\n\nIf drift is found, default action is: REMOVE before proceeding. Use AskUserQuestion ONLY if the drift item is borderline (could be argued for) — otherwise just remove silently and report.\n\nThis audit is mandatory and visible. The user wants to see it on every implementer dispatch — without it, drift compounds across phases and "match the visual reference" becomes the default that overrides the spec.`;
}

function emitContext(text) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: text
    }
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
      const toolName = data.tool_name || '';
      const toolInput = data.tool_input || {};
      const cwd = data.cwd || process.cwd();

      // Only fires on Agent tool dispatches
      if (toolName !== 'Agent') {
        return process.exit(0);
      }

      const subAgent = (toolInput.subagent_type || '').toString().toLowerCase();
      if (!TARGET_AGENTS.has(subAgent)) {
        appendLog('SKIP', `subagent_type=${subAgent} (not target)`);
        return process.exit(0);
      }

      // Gate on active workflow
      const workflow = readActiveWorkflow(cwd);
      if (workflow !== TARGET_WORKFLOW) {
        appendLog('SKIP', `workflow=${workflow || 'none'} (not dev pipeline)`);
        return process.exit(0);
      }

      const sources = findExistingSources(cwd);
      const audit = buildAuditContext(sources, subAgent);

      appendLog('FIRED', `agent=${subAgent} sources=${sources.length} cwd=${cwd}`);
      emitContext(audit);
      process.exit(0);
    } catch (err) {
      appendLog('ERROR', 'Failed: ' + (err.message || err));
      process.exit(0);  // fail-open
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
