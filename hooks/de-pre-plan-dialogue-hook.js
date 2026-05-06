#!/usr/bin/env node
// Design-Engineer Pre-Plan Dialogue Hook
//
// Two entry points distinguished by hook_event_name from stdin:
//   - UserPromptSubmit: when the dev-pipeline marker is set AND
//     .design-engineer-plugin/development/decisions.md is missing for this
//     session, inject the dialogue protocol prompt as additionalContext.
//   - PreToolUse (matcher: ExitPlanMode): under the same conditions, return
//     permissionDecision: "deny" so the model cannot exit plan mode without
//     the dialogue file existing first.
//
// The two-layer gate addresses the v6.6.0 problem: without a structured
// per-decision dialogue, the model jumps from "I read the deliverables" to
// "I'll implement [some feature]" with its own interpretation of how the
// MVP requirements should be executed, producing AI-slop UI. The dialogue
// is the design-discussion phase the dev pipeline lives or dies on.
//
// Probe verification (v6.6.0 plan):
//   - Probe 2 verified: PreToolUse permissionDecision: "deny" actually
//     blocks ExitPlanMode (not advisory).
//   - Probe 2 also verified: EnterPlanMode is NOT a callable tool — plan
//     mode is a permission-mode flag set by the harness, so we gate on
//     ExitPlanMode as the backstop and use UserPromptSubmit as the primary
//     nudge.
//
// Fail-open: any error results in allowing the action (matching existing
// hooks like de-design-grounding-hook.js).

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_PATH = path.join(os.homedir(), '.claude', 'cache', 'de-pre-plan-dialogue.log');
const ACTIVE_WORKFLOW_PATH = '.design-engineer-plugin/.active-workflow';
const TARGET_WORKFLOW = 'dev:feature-implementation';
const DECISIONS_PATH = '.design-engineer-plugin/development/decisions.md';

const DIALOGUE_PROMPT = `\n\n[Pre-plan MVP dialogue REQUIRED before plan mode]\n\nYou are running /design-engineer:development but the pre-plan MVP dialogue has not been completed yet. \`.design-engineer-plugin/development/decisions.md\` does not exist for this session.\n\nMVP requirements are intentionally HIGH-LEVEL. They name what the user can do, not how the screen executes it. Without a per-decision dialogue, you will pick implementation defaults and produce AI-slop UI that ignores the user's specific taste.\n\nBefore drafting any plan or calling ExitPlanMode, you MUST:\n\n1. Surface upstream context in chat — quote verbatim what the existing deliverables say about this feature (problem-statement.md, mvp-requirements.md, information-architecture.md, references.md, bias-audit.md). No paraphrasing. If a deliverable doesn't exist, STOP and ask the user via AskUserQuestion how to proceed.\n2. List 3–5 of the most consequential open implementation decisions for THIS feature. Pick from these categories: component reuse strategy / data flow & state management / error handling pattern / copy direction / accessibility surface area / performance budget / test strategy / deployment surface. Cap at 5 — over-elaboration is its own failure mode.\n3. For EACH decision, run an AskUserQuestion with 2–4 named options, each with a one-sentence trade-off. "Other (I'll describe in chat)" must always be the LAST option. No batching multiple decisions into one question.\n4. After all answers are in, write the user's picks to \`.design-engineer-plugin/development/decisions.md\` (create the directory if needed). Format: per-decision section with "chose X over Y because Z".\n5. ONLY THEN enter Plan Mode and draft the implementation plan with the user's picks baked in.\n\nThe ExitPlanMode tool is currently denied by the design-engineer-plugin pre-plan dialogue hook until \`.design-engineer-plugin/development/decisions.md\` exists. Drafting a plan without this file is wasted work.\n`;

const DENY_REASON = "Pre-plan MVP dialogue not yet completed. The model is running /design-engineer:development but `.design-engineer-plugin/development/decisions.md` does not exist for this session. MVP requirements are high-level — implementation choices need explicit user input before any plan is drafted. Run the pre-plan dialogue per commands/development.md Step 0.5: surface upstream deliverable context, list 3–5 implementation decisions, AskUserQuestion per decision (2–4 options + 'Other' last), persist picks to .design-engineer-plugin/development/decisions.md, THEN call ExitPlanMode.";

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
 * Find the first JSONL entry's timestamp in the transcript. Used to
 * differentiate "decisions.md from a previous dev session" (older than
 * session start) from "decisions.md written this session" (newer). The
 * former should be treated as missing — the user is starting a new dev
 * session and needs a fresh dialogue.
 */
function getSessionStartTimestamp(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;
  try {
    const raw = fs.readFileSync(transcriptPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const entry = JSON.parse(trimmed);
        const ts = entry.timestamp || entry.ts || entry.created_at;
        if (ts) {
          const ms = typeof ts === 'string' ? Date.parse(ts) : Number(ts);
          if (!isNaN(ms)) return ms;
        }
      } catch (_) {
        // Skip malformed lines
      }
    }
  } catch (_) {}
  return null;
}

/**
 * Returns true iff the gate condition holds:
 *   active-workflow marker == "dev:feature-implementation"
 *   AND decisions.md is missing (or older than session start).
 */
function shouldGate(cwd, transcriptPath) {
  const workflow = readActiveWorkflow(cwd);
  if (workflow !== TARGET_WORKFLOW) return false;

  const decisionsAbs = path.join(cwd, DECISIONS_PATH);
  if (!fs.existsSync(decisionsAbs)) return true;

  // File exists — check freshness against session start
  try {
    const sessionStart = getSessionStartTimestamp(transcriptPath);
    if (sessionStart === null) return false;  // can't determine, assume fresh enough
    const fileMtime = fs.statSync(decisionsAbs).mtimeMs;
    if (fileMtime < sessionStart) {
      // File is from a previous session — treat as missing
      return true;
    }
  } catch (_) {
    return false;
  }
  return false;
}

function emitContextInjection() {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: DIALOGUE_PROMPT
    }
  }));
}

function emitDeny() {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: DENY_REASON
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
      const data = JSON.parse(input || '{}');
      const eventName = data.hook_event_name || '';
      const toolName = data.tool_name || '';
      const cwd = data.cwd || process.cwd();
      const transcriptPath = data.transcript_path || '';

      if (!shouldGate(cwd, transcriptPath)) {
        appendLog('SKIP', 'event=' + eventName + ' tool=' + toolName + ' (gate inactive)');
        return process.exit(0);
      }

      if (eventName === 'UserPromptSubmit') {
        appendLog('FIRED-INJECT', 'event=' + eventName + ' cwd=' + cwd);
        emitContextInjection();
        return process.exit(0);
      }

      if (eventName === 'PreToolUse' && toolName === 'ExitPlanMode') {
        appendLog('FIRED-DENY', 'event=' + eventName + ' tool=' + toolName + ' cwd=' + cwd);
        emitDeny();
        return process.exit(0);
      }

      // Other event types or PreToolUse for other tools — pass through
      appendLog('PASSTHROUGH', 'event=' + eventName + ' tool=' + toolName);
      process.exit(0);
    } catch (err) {
      appendLog('ERROR', 'Failed: ' + (err.message || err));
      process.exit(0);  // fail-open
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
