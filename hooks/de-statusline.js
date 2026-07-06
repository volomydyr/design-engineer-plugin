#!/usr/bin/env node
// Design-Engineer Status Line
// Shows: model (context) + dir | context bar | 5h/7d usage
// All data from stdin JSON – no external cache or monitor needed.
// Note: pipeline-state segment removed in v2.5.0 – it depended on a
// status: complete write to dependencies.yaml that no part of the plugin
// ever performed, so the segment had been dead since launch.

const path = require('path');

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
    const ctxSeg = buildContextSegment(data.context_window);
    if (ctxSeg) segments.push(ctxSeg);

    // Segment 3: Usage limits (from stdin rate_limits)
    const usageSeg = buildUsageSegment(data.rate_limits);
    if (usageSeg) segments.push(usageSeg);

    // Join with dim vertical bar
    process.stdout.write(segments.join(' \x1b[2m\u2502\x1b[0m '));
  } catch (e) {
    // Silent fail – never break statusline
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
function buildContextSegment(ctx) {
  if (!ctx) return null;

  // Show the raw used_percentage Claude Code reports, falling back to
  // 100 - remaining_percentage. No auto-compact rescale: it diverged badly
  // from Claude Code's native indicator (see anthropics/claude-code #8792, #5601).
  let used = ctx.used_percentage;
  if (used == null) {
    if (ctx.remaining_percentage == null) return null;
    used = 100 - ctx.remaining_percentage;
  }
  used = Math.max(0, Math.min(100, Math.round(used)));

  // Build progress bar (5 segments – compact)
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
