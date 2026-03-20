#!/usr/bin/env node
// Design-Engineer Status Line
// Shows: model + dir | 5h/7d usage limits | context bar | pipeline state
//
// Three modes:
//   Default (stdin): parse session JSON, display statusline (reads cache only, never credentials)
//   --watch:         run in a SEPARATE terminal — fetches usage data every 3 minutes, writes cache
//                    This is the ONLY mode that accesses credentials. Run by the USER, not by Claude.
//   --fetch:         single fetch (used internally by --watch)
//
// SECURITY: The default statusline mode (triggered by Claude) NEVER accesses credentials,
// Keychain, API keys, or any authentication data. It only reads a cache file containing
// usage percentages. The --watch/--fetch modes access credentials but are run by the user
// in their own terminal, outside of Claude.

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');

const homeDir = os.homedir();
const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(homeDir, '.claude');
const CACHE_PATH = path.join(claudeDir, 'cache', 'de-usage.json');
const WATCH_INTERVAL = 180; // seconds (3 minutes)
const AUTO_COMPACT_BUFFER_PCT = 16.5;

// Phase names (short, for statusline display)
const PHASE_NAMES = {
  '1': 'Discovery',
  '2': 'Strategy',
  '3': 'Planning',
  '4': 'Design',
  '5': 'Development'
};

// ─── Mode routing ────────────────────────────────────────────────────────────
if (process.argv[2] === '--watch') {
  runWatch();
} else if (process.argv[2] === '--fetch') {
  fetchUsage();
} else {
  runStatusLine();
}

// ─── Watch mode (user runs this in a separate terminal) ─────────────────────
function runWatch() {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════════════════╗');
  console.log('  ║  Design Engineer — Usage Monitor                        ║');
  console.log('  ╠══════════════════════════════════════════════════════════╣');
  console.log('  ║                                                         ║');
  console.log('  ║  This tool refreshes your Claude usage data every       ║');
  console.log('  ║  3 minutes so the status line shows how much of your    ║');
  console.log('  ║  5-hour and 7-day limits you have used.                 ║');
  console.log('  ║                                                         ║');
  console.log('  ║  Keep this window open while you work with Claude.      ║');
  console.log('  ║  Close it anytime — the status line will still work,    ║');
  console.log('  ║  it just won\'t show usage limits anymore.               ║');
  console.log('  ║                                                         ║');
  console.log('  ║  This tool accesses your Anthropic credentials to       ║');
  console.log('  ║  check usage. Claude itself never sees your credentials.║');
  console.log('  ║                                                         ║');
  console.log('  ╚══════════════════════════════════════════════════════════╝');
  console.log('');

  // Initial fetch
  console.log(`  [${timestamp()}] Fetching usage data...`);
  fetchUsageAndLog();

  // Schedule periodic refresh
  setInterval(() => {
    console.log(`  [${timestamp()}] Refreshing...`);
    fetchUsageAndLog();
  }, WATCH_INTERVAL * 1000);
}

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fetchUsageAndLog() {
  fetchUsageAsync((err, data) => {
    if (err) {
      console.log(`  [${timestamp()}] Could not fetch: ${err}`);
      console.log('');
      console.log('  If this keeps failing, your credentials may have expired.');
      console.log('  Try logging out and back in to Claude Code: claude logout && claude login');
      console.log('');
    } else {
      const fh = Math.round(data.five_hour?.utilization || 0);
      const sd = Math.round(data.seven_day?.utilization || 0);
      console.log(`  [${timestamp()}] 5-hour: ${fh}% used | 7-day: ${sd}% used`);
    }
  });
}

// ─── Main statusline (triggered by Claude — reads cache ONLY) ───────────────
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

      // Segment 2: Usage limits (from cache file only — no credential access)
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

  // Pattern 1: version-first like "3.5 Sonnet"
  const versionFirst = name.match(/^(\d+\.?\d*)\s+(Opus|Sonnet|Haiku)/i);
  if (versionFirst) {
    const ver = versionFirst[1];
    const family = versionFirst[2];
    return parseFloat(ver) < 4 ? `${family} ${ver}` : family;
  }

  // Pattern 2: family-first like "Opus 4", "Sonnet 4.6", "Haiku"
  const familyFirst = name.match(/^(Opus|Sonnet|Haiku)(?:\s+(\d+\.?\d*))?/i);
  if (familyFirst) {
    const family = familyFirst[1];
    const ver = familyFirst[2];
    if (ver && ver.includes('.')) return `${family} ${ver}`;
    return family;
  }

  return name || displayName;
}

// ─── Usage limits segment (reads cache file only) ───────────────────────────
function buildUsageSegment() {
  try {
    if (!fs.existsSync(CACHE_PATH)) return null;

    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));

    // Skip if cache is too old (>10 minutes = watch probably stopped)
    const age = Math.floor(Date.now() / 1000) - (cache.fetched_at || 0);
    if (age > 600) return null;

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

  // Color based on thresholds
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

    if (!hasInProgress) return null;

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

// ─── Fetch mode (accesses credentials — ONLY run by user, never by Claude) ──
function fetchUsage() {
  fetchUsageAsync((err) => {
    process.exit(err ? 1 : 0);
  });
}

function fetchUsageAsync(callback) {
  try {
    const { execFileSync } = require('child_process');

    // Try reading token from credentials file first (cross-platform)
    let accessToken = null;
    const credsPath = path.join(claudeDir, '.credentials.json');
    try {
      const credsJson = fs.readFileSync(credsPath, 'utf8');
      const creds = JSON.parse(credsJson);
      accessToken = creds?.claudeAiOauth?.accessToken;
    } catch (e) {
      // No credentials file
    }

    // Fallback to macOS Keychain
    if (!accessToken) {
      try {
        const tokenJson = execFileSync('security', [
          'find-generic-password', '-s', 'Claude Code-credentials', '-w'
        ], { encoding: 'utf8', timeout: 5000 });
        const creds = JSON.parse(tokenJson.trim());
        accessToken = creds?.claudeAiOauth?.accessToken;
      } catch (e) {
        // Not on macOS or no credentials
      }
    }

    if (!accessToken) {
      return callback('No credentials found. Make sure you are logged in to Claude Code.');
    }

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
            return callback(data.error.message || 'API error');
          }
          const cache = {
            five_hour: data.five_hour || {},
            seven_day: data.seven_day || {},
            fetched_at: Math.floor(Date.now() / 1000)
          };
          fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
          callback(null, cache);
        } catch (e) {
          callback('Could not parse API response');
        }
      });
    });

    req.on('error', (e) => callback(e.message));
    req.on('timeout', () => { req.destroy(); callback('Request timed out'); });
    req.end();
  } catch (e) {
    callback(e.message);
  }
}
