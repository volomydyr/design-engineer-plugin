#!/usr/bin/env node
// Design-Engineer Status Line
// Shows: model (context) + dir | context bar | 5h/7d usage | pipeline state
// All data from stdin JSON — no external cache or monitor needed.

const fs = require('fs');
const path = require('path');
const os = require('os');

const AUTO_COMPACT_BUFFER_PCT = 16.5;

// Phase names (short, for statusline display)
const PHASE_NAMES = {
  '1': 'Discovery',
  '2': 'Strategy',
  '3': 'Planning',
  '4': 'Design',
  '5': 'Development'
};

// ─── Main statusline ────────────────────────────────────────────────────────
let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const segments = [];

    // Segment 1: Model (with context window) + Directory
    const model = formatModel(data.model?.display_name || 'Claude');
    const dir = path.basename(data.workspace?.current_dir || process.cwd());
    segments.push(`\x1b[2m${model}  ${dir}\x1b[0m`);

    // Segment 2: Context bar
    const remaining = data.context_window?.remaining_percentage;
    const ctxSeg = buildContextSegment(remaining);
    if (ctxSeg) segments.push(ctxSeg);

    // Segment 3: Usage limits (from stdin rate_limits)
    const usageSeg = buildUsageSegment(data.rate_limits);
    if (usageSeg) segments.push(usageSeg);

    // Segment 4: Pipeline state (conditional)
    const pipelineSeg = buildPipelineSegment(data.workspace?.current_dir);
    if (pipelineSeg) segments.push(pipelineSeg);

    // Join with dim vertical bar
    process.stdout.write(segments.join(' \x1b[2m\u2502\x1b[0m '));
  } catch (e) {
    // Silent fail — never break statusline
  }
});

// ─── Model name formatting ──────────────────────────────────────────────────
function formatModel(displayName) {
  if (!displayName) return 'Claude';

  // Extract context window size before stripping
  const ctxMatch = displayName.match(/\((\d+[KMB]?)(?:\s*context)?\)/i);
  const ctxSuffix = ctxMatch ? ` (${ctxMatch[1]})` : '';

  // Strip "Claude " prefix and context window info
  let name = displayName.replace(/^Claude\s+/i, '').replace(/\s*\(\d+[KMB]?\s*(?:context)?\)\s*/gi, '');

  // Pattern 1: version-first like "3.5 Sonnet"
  const versionFirst = name.match(/^(\d+\.?\d*)\s+(Opus|Sonnet|Haiku)/i);
  if (versionFirst) {
    const ver = versionFirst[1];
    const family = versionFirst[2];
    const short = parseFloat(ver) < 4 ? `${family} ${ver}` : family;
    return short + ctxSuffix;
  }

  // Pattern 2: family-first like "Opus 4", "Sonnet 4.6", "Haiku"
  const familyFirst = name.match(/^(Opus|Sonnet|Haiku)(?:\s+(\d+\.?\d*))?/i);
  if (familyFirst) {
    const family = familyFirst[1];
    const ver = familyFirst[2];
    const short = (ver && ver.includes('.')) ? `${family} ${ver}` : family;
    return short + ctxSuffix;
  }

  return (name || displayName) + ctxSuffix;
}

// ─── Usage limits segment (reads from stdin rate_limits) ────────────────────
function buildUsageSegment(rateLimits) {
  if (!rateLimits) return null;

  const fiveH = rateLimits.five_hour;
  const sevenD = rateLimits.seven_day;

  if (!fiveH && !sevenD) return null;

  const parts = [];

  if (fiveH) {
    const pct = Math.round(fiveH.used_percentage || fiveH.utilization || 0);
    const filled = Math.round(pct / 20);
    const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(5 - filled);
    parts.push(colorPct(pct, `5h ${bar} ${pct}%`));
  }

  if (sevenD) {
    const pct = Math.round(sevenD.used_percentage || sevenD.utilization || 0);
    const filled = Math.round(pct / 20);
    const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(5 - filled);
    parts.push(colorPct(pct, `7d ${bar} ${pct}%`));
  }

  return parts.join('  ');
}

function colorPct(pct, text) {
  if (pct < 50) return `\x1b[32m${text}\x1b[0m`;       // green
  if (pct < 75) return `\x1b[33m${text}\x1b[0m`;       // yellow
  if (pct < 90) return `\x1b[38;5;208m${text}\x1b[0m`; // orange
  return `\x1b[31m${text}\x1b[0m`;                      // red
}

// ─── Context bar segment ────────────────────────────────────────────────────
function buildContextSegment(remaining) {
  if (remaining == null) return null;

  // Normalize for autocompact buffer
  const usableRemaining = Math.max(0,
    ((remaining - AUTO_COMPACT_BUFFER_PCT) / (100 - AUTO_COMPACT_BUFFER_PCT)) * 100
  );
  const used = Math.max(0, Math.min(100, Math.round(100 - usableRemaining)));

  // Build progress bar (5 segments — compact)
  const filled = Math.round(used / 20);
  const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(5 - filled);

  // Color based on thresholds
  const label = 'context';
  if (used < 50) return `\x1b[32m${label} ${bar} ${used}%\x1b[0m`;
  if (used < 65) return `\x1b[33m${label} ${bar} ${used}%\x1b[0m`;
  if (used < 80) return `\x1b[38;5;208m${label} ${bar} ${used}%\x1b[0m`;
  if (used < 95) return `\x1b[31m${label} ${bar} ${used}% [!]\x1b[0m`;
  return `\x1b[31m${label} ${bar} ${used}% [!!]\x1b[0m`;
}

// ─── Pipeline state segment ─────────────────────────────────────────────────
function buildPipelineSegment(dir) {
  if (!dir) return null;
  try {
    const depsPath = findDepsPath(dir);
    if (!depsPath) return null;

    const text = fs.readFileSync(depsPath, 'utf8');
    const deliverables = parseDependenciesYaml(text);
    if (!deliverables || Object.keys(deliverables).length === 0) return null;

    const phases = {};
    let hasInProgress = false;
    for (const [key, val] of Object.entries(deliverables)) {
      const phase = val.phase;
      if (!phase) continue;
      if (!phases[phase]) phases[phase] = { total: 0, complete: 0, inProgress: 0 };
      phases[phase].total++;
      if (val.status === 'complete') phases[phase].complete++;
      if (val.status === 'in_progress') {
        phases[phase].inProgress++;
        hasInProgress = true;
      }
    }

    const sortedPhases = Object.keys(phases).sort();
    if (sortedPhases.length === 0) return null;

    // Find current phase: the most advanced phase that has any completed deliverables
    // but is not fully complete yet. If all phases are complete, show the last one.
    let currentPhase = null;
    for (const p of sortedPhases) {
      if (phases[p].inProgress > 0) {
        currentPhase = p;
        break;
      }
      if (phases[p].complete > 0 && phases[p].complete < phases[p].total) {
        currentPhase = p;
        break;
      }
    }
    // If no partially complete phase found, find the first phase with no completions
    // (the next phase to start) or show the last completed phase
    if (!currentPhase) {
      for (const p of sortedPhases) {
        if (phases[p].complete === 0) {
          currentPhase = p;
          break;
        }
      }
    }
    if (!currentPhase) {
      // All phases complete — show the last one
      currentPhase = sortedPhases[sortedPhases.length - 1];
    }

    const phaseName = PHASE_NAMES[currentPhase] || `Phase ${currentPhase}`;
    const completed = phases[currentPhase].complete;
    const total = phases[currentPhase].total;

    return `Phase ${currentPhase}: ${phaseName} \u2022 ${completed}/${total}`;
  } catch (e) {
    return null;
  }
}

// ─── Find dependencies.yaml ─────────────────────────────────────────────────
function findDepsPath(startDir) {
  let d = startDir;
  for (let i = 0; i < 4; i++) {
    // Check new path first, then legacy
    const newPath = path.join(d, '.design-engineer-plugin', 'dependencies.yaml');
    if (fs.existsSync(newPath)) return newPath;
    const legacyPath = path.join(d, 'documents', 'design', '.dependencies.yaml');
    if (fs.existsSync(legacyPath)) return legacyPath;
    const oldLegacyPath = path.join(d, 'docs', 'design', '.dependencies.yaml');
    if (fs.existsSync(oldLegacyPath)) return oldLegacyPath;
    const parent = path.dirname(d);
    if (parent === d) break;
    d = parent;
  }
  return null;
}

// ─── Minimal YAML parser ────────────────────────────────────────────────────
function parseDependenciesYaml(text) {
  const deliverables = {};
  let current = null;
  let currentListKey = null;

  for (const line of text.split('\n')) {
    const stripped = line.trim();
    if (!stripped || stripped.startsWith('#')) continue;

    const indent = line.length - line.trimStart().length;

    if (indent === 2 && stripped.endsWith(':') && !stripped.startsWith('-')) {
      current = stripped.slice(0, -1);
      deliverables[current] = { informs: [], depends_on: [], status: 'not_started', phase: null };
      currentListKey = null;
      continue;
    }

    if (!current) continue;

    if (indent === 4) {
      const m = stripped.match(/^([\w_-]+):\s*(.*)/);
      if (m) {
        const key = m[1];
        const val = m[2].trim();
        if (key === 'informs' || key === 'depends_on') {
          currentListKey = key;
          if (val && val !== '[]') {
            deliverables[current][key] = val.replace(/[\[\]]/g, '').split(',')
              .map(v => v.trim().replace(/^['"]|['"]$/g, ''));
          } else {
            deliverables[current][key] = [];
          }
        } else if (key === 'status') {
          currentListKey = null;
          deliverables[current].status = val || 'not_started';
        } else if (key === 'phase') {
          currentListKey = null;
          deliverables[current].phase = val || null;
        } else {
          currentListKey = null;
          deliverables[current][key] = val;
        }
      }
      continue;
    }

    if (indent === 6 && stripped.startsWith('- ')) {
      const val = stripped.slice(2).trim().replace(/^['"]|['"]$/g, '');
      if (currentListKey && deliverables[current]?.[currentListKey]) {
        deliverables[current][currentListKey].push(val);
      }
    }
  }

  return deliverables;
}
