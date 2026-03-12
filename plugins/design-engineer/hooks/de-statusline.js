#!/usr/bin/env node
// Design-Engineer Status Line
// Shows: model + dir | 5h/7d usage limits | context bar | pipeline state
//
// Two modes:
//   Default (stdin): parse session JSON, display statusline, write bridge file
//   --fetch:         fetch Anthropic API usage data, write cache, exit

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');

const homeDir = os.homedir();
const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(homeDir, '.claude');
const CACHE_PATH = path.join(claudeDir, 'cache', 'de-usage.json');
const CACHE_MAX_AGE = 60; // seconds
const AUTO_COMPACT_BUFFER_PCT = 16.5;

// Phase names (short, for statusline display)
const PHASE_NAMES = {
  '1': 'Discovery',
  '2': 'Strategy',
  '3': 'Planning',
  '4': 'Design',
  '5': 'Development'
};

// ─── Fetch mode ───────────────────────────────────────────────────────────────
if (process.argv[2] === '--fetch') {
  fetchUsage();
} else {
  runStatusLine();
}

// ─── Main statusline ─────────────────────────────────────────────────────────
function runStatusLine() {
  let input = '';
  const stdinTimeout = setTimeout(() => process.exit(0), 3000);
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
    clearTimeout(stdinTimeout);
    try {
      const data = JSON.parse(input);
      const segments = [];

      // Segment 1: Model + Directory
      const model = shortenModel(data.model?.display_name || 'Claude');
      const dir = path.basename(data.workspace?.current_dir || process.cwd());
      segments.push(`\x1b[2m${model} \u2022 ${dir}\x1b[0m`);

      // Segment 2: Usage limits (from cache)
      const usageSeg = buildUsageSegment();
      if (usageSeg) segments.push(usageSeg);

      // Segment 3: Context bar
      const session = data.session_id || '';
      const remaining = data.context_window?.remaining_percentage;
      const ctxSeg = buildContextSegment(remaining, session);
      if (ctxSeg) segments.push(ctxSeg);

      // Segment 4: Pipeline state (conditional)
      const pipelineSeg = buildPipelineSegment(data.workspace?.current_dir);
      if (pipelineSeg) segments.push(pipelineSeg);

      // Join with dim vertical bar
      process.stdout.write(segments.join(' \x1b[2m\u2502\x1b[0m '));
    } catch (e) {
      // Silent fail -- never break statusline
    }
  });
}

// ─── Model name shortening ──────────────────────────────────────────────────
function shortenModel(displayName) {
  if (!displayName) return 'Claude';

  // Strip "Claude " prefix
  let name = displayName.replace(/^Claude\s+/i, '');

  // Match family + optional version: "Opus 4", "3.5 Sonnet", "Sonnet 4", "Haiku 4.5"
  // Pattern 1: version-first like "3.5 Sonnet"
  const versionFirst = name.match(/^(\d+\.?\d*)\s+(Opus|Sonnet|Haiku)/i);
  if (versionFirst) {
    const ver = versionFirst[1];
    const family = versionFirst[2];
    // Show version for older models (< 4)
    return parseFloat(ver) < 4 ? `${family} ${ver}` : family;
  }

  // Pattern 2: family-first like "Opus 4", "Sonnet 4.6", "Haiku"
  const familyFirst = name.match(/^(Opus|Sonnet|Haiku)(?:\s+(\d+\.?\d*))?/i);
  if (familyFirst) {
    const family = familyFirst[1];
    const ver = familyFirst[2];
    // Show version only if it has a minor component (e.g., "4.5" but not "4")
    if (ver && ver.includes('.')) return `${family} ${ver}`;
    return family;
  }

  // Unknown format -- return as-is (trimmed)
  return name || displayName;
}

// ─── Usage limits segment ───────────────────────────────────────────────────
function buildUsageSegment() {
  try {
    if (!fs.existsSync(CACHE_PATH)) return null;

    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));

    // Trigger background refresh if stale
    const age = Math.floor(Date.now() / 1000) - (cache.fetched_at || 0);
    if (age > CACHE_MAX_AGE) {
      triggerBackgroundFetch();
    }

    const fiveH = cache.five_hour || {};
    const sevenD = cache.seven_day || {};

    const fivePct = Math.round(fiveH.utilization || 0);
    const sevenPct = Math.round(sevenD.utilization || 0);
    const fiveReset = formatReset(fiveH.resets_at);

    const fiveStr = colorPct(fivePct, `5h: ${fivePct}%`) + (fiveReset ? ` (${fiveReset})` : '');
    const sevenStr = colorPct(sevenPct, `7d: ${sevenPct}%`);

    return `${fiveStr} \u2022 ${sevenStr}`;
  } catch (e) {
    return null;
  }
}

function colorPct(pct, text) {
  if (pct < 50) return `\x1b[32m${text}\x1b[0m`;       // green
  if (pct < 75) return `\x1b[33m${text}\x1b[0m`;       // yellow
  if (pct < 90) return `\x1b[38;5;208m${text}\x1b[0m`; // orange
  return `\x1b[31m${text}\x1b[0m`;                      // red
}

function formatReset(isoString) {
  if (!isoString) return '';
  try {
    const resetMs = new Date(isoString).getTime();
    if (isNaN(resetMs)) return '';
    const diff = Math.floor((resetMs - Date.now()) / 1000);
    if (diff <= 0) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return m > 0 ? `${h}h${m}m` : `${h}h`;
  } catch (e) {
    return '';
  }
}

function triggerBackgroundFetch() {
  try {
    const { spawn } = require('child_process');
    const child = spawn('node', [__filename, '--fetch'], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
  } catch (e) {
    // Silent fail
  }
}

// ─── Context bar segment ────────────────────────────────────────────────────
function buildContextSegment(remaining, session) {
  if (remaining == null) return null;

  // Normalize for autocompact buffer
  const usableRemaining = Math.max(0,
    ((remaining - AUTO_COMPACT_BUFFER_PCT) / (100 - AUTO_COMPACT_BUFFER_PCT)) * 100
  );
  const used = Math.max(0, Math.min(100, Math.round(100 - usableRemaining)));

  // Write bridge file for context monitor compatibility
  if (session) {
    try {
      const bridgePath = path.join(os.tmpdir(), `claude-ctx-${session}.json`);
      fs.writeFileSync(bridgePath, JSON.stringify({
        session_id: session,
        remaining_percentage: remaining,
        used_pct: used,
        timestamp: Math.floor(Date.now() / 1000)
      }));
    } catch (e) {
      // Silent fail -- bridge is best-effort
    }
  }

  // Build progress bar (10 segments)
  const filled = Math.floor(used / 10);
  const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(10 - filled);

  // Color based on thresholds -- no emojis
  if (used < 50) return `\x1b[32m${bar} ${used}%\x1b[0m`;
  if (used < 65) return `\x1b[33m${bar} ${used}%\x1b[0m`;
  if (used < 80) return `\x1b[38;5;208m${bar} ${used}%\x1b[0m`;
  if (used < 95) return `\x1b[31m[!] ${bar} ${used}%\x1b[0m`;
  return `\x1b[31m[!!] ${bar} ${used}%\x1b[0m`;
}

// ─── Pipeline state segment ─────────────────────────────────────────────────
function buildPipelineSegment(dir) {
  if (!dir) return null;
  try {
    // Find .dependencies.yaml
    const depsPath = findDepsPath(dir);
    if (!depsPath) return null;

    const text = fs.readFileSync(depsPath, 'utf8');
    const deliverables = parseDependenciesYaml(text);
    if (!deliverables || Object.keys(deliverables).length === 0) return null;

    // Group by phase and count
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

    // Only show when pipeline is active (something in_progress)
    if (!hasInProgress) return null;

    // Current phase = first phase with in_progress items
    const sortedPhases = Object.keys(phases).sort();
    let currentPhase = null;
    for (const p of sortedPhases) {
      if (phases[p].inProgress > 0) {
        currentPhase = p;
        break;
      }
    }
    if (!currentPhase) return null;

    const phaseName = PHASE_NAMES[currentPhase] || `Phase ${currentPhase}`;
    const completed = phases[currentPhase].complete;
    const total = phases[currentPhase].total;

    return `Phase ${currentPhase}: ${phaseName} \u2022 ${completed}/${total}`;
  } catch (e) {
    return null;
  }
}

// ─── Find .dependencies.yaml ────────────────────────────────────────────────
function findDepsPath(startDir) {
  let d = startDir;
  for (let i = 0; i < 4; i++) {
    const candidate = path.join(d, 'docs', 'design', '.dependencies.yaml');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(d);
    if (parent === d) break;
    d = parent;
  }
  return null;
}

// ─── Minimal YAML parser (ported from session_dep_summary.py) ───────────────
function parseDependenciesYaml(text) {
  const deliverables = {};
  let current = null;
  let currentListKey = null;

  for (const line of text.split('\n')) {
    const stripped = line.trim();
    if (!stripped || stripped.startsWith('#')) continue;

    const indent = line.length - line.trimStart().length;

    // Top-level deliverable key (indent 2)
    if (indent === 2 && stripped.endsWith(':') && !stripped.startsWith('-')) {
      current = stripped.slice(0, -1);
      deliverables[current] = { informs: [], depends_on: [], status: 'not_started', phase: null };
      currentListKey = null;
      continue;
    }

    if (!current) continue;

    // Property (indent 4)
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

    // List item (indent 6)
    if (indent === 6 && stripped.startsWith('- ')) {
      const val = stripped.slice(2).trim().replace(/^['"]|['"]$/g, '');
      if (currentListKey && deliverables[current]?.[currentListKey]) {
        deliverables[current][currentListKey].push(val);
      }
    }
  }

  return deliverables;
}

// ─── Fetch mode: get usage from Anthropic API ───────────────────────────────
function fetchUsage() {
  try {
    // Get OAuth token from macOS Keychain
    const { execFileSync } = require('child_process');
    let tokenJson;
    try {
      tokenJson = execFileSync('security', [
        'find-generic-password', '-s', 'Claude Code-credentials', '-w'
      ], { encoding: 'utf8', timeout: 5000 });
    } catch (e) {
      // Not on macOS or no credentials -- exit silently
      process.exit(0);
    }

    let accessToken;
    try {
      const creds = JSON.parse(tokenJson.trim());
      accessToken = creds?.claudeAiOauth?.accessToken;
    } catch (e) {
      process.exit(0);
    }
    if (!accessToken) process.exit(0);

    // Ensure cache directory exists
    const cacheDir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Fetch usage data
    const options = {
      hostname: 'api.anthropic.com',
      path: '/api/oauth/usage',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'anthropic-beta': 'oauth-2025-04-20'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.error) {
            process.exit(0);
          }
          // Write cache
          const cache = {
            five_hour: data.five_hour || {},
            seven_day: data.seven_day || {},
            fetched_at: Math.floor(Date.now() / 1000)
          };
          fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
        } catch (e) {
          // Silent fail
        }
        process.exit(0);
      });
    });

    req.on('error', () => process.exit(0));
    req.on('timeout', () => { req.destroy(); process.exit(0); });
    req.end();
  } catch (e) {
    process.exit(0);
  }
}
