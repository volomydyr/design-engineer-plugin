#!/usr/bin/env node
// Design-Engineer Safety Hook (PreToolUse)
// Context-aware protection against destructive Bash commands.
// Blocks: rm -rf, git push --force, DROP TABLE, git add .env, etc.
// Allows: patterns in data context (grep "rm -rf", echo, cat, etc.)
// Fail-open: any error results in allowing the command.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const homeDir = os.homedir();
const LOG_PATH = path.join(homeDir, '.claude', 'cache', 'de-safety.log');

// Only active in projects that have run /de:start
if (!fs.existsSync(path.join(process.cwd(), '.design-engineer-plugin/config.yaml'))) {
  process.exit(0);
}

// ─── Destructive patterns ────────────────────────────────────────────────────

const PATTERNS = [
  // Filesystem
  {
    category: 'filesystem',
    test: cmd => /\brm\s/.test(cmd) && hasFlags(cmd, 'rm', 'r') && hasFlags(cmd, 'rm', 'f'),
    reason: 'rm -rf permanently deletes files without confirmation',
    suggestion: 'Use rm -ri for interactive confirmation, or ls the path first to verify contents'
  },
  {
    category: 'filesystem',
    test: cmd => /\bchmod\s+(-R\s+)?777\b/.test(cmd),
    reason: 'chmod 777 makes files world-readable/writable/executable',
    suggestion: 'Use specific permissions: 755 for directories, 644 for files'
  },

  // Git
  {
    category: 'git',
    test: cmd => /\bgit\s+push\b/.test(cmd) && (/--force\b/.test(cmd) || /\s-f\b/.test(cmd)) && !(/--force-with-lease\b/.test(cmd)),
    reason: 'git push --force overwrites remote history and can destroy teammates\' work',
    suggestion: 'Use git push --force-with-lease (safer, aborts if remote has new commits)'
  },
  {
    category: 'git',
    test: cmd => /\bgit\s+push\s+\S+\s+\+/.test(cmd),
    reason: 'Plus-prefix push (+branch) is a force push that overwrites remote history',
    suggestion: 'Use git push --force-with-lease instead'
  },
  {
    category: 'git',
    test: cmd => /\bgit\s+reset\s+--hard\b/.test(cmd),
    reason: 'git reset --hard discards all uncommitted changes permanently',
    suggestion: 'Use git stash first to save changes, or git reset --soft to keep changes staged'
  },
  {
    category: 'git',
    test: cmd => /\bgit\s+clean\b/.test(cmd) && hasFlags(cmd, 'git clean', 'f'),
    reason: 'git clean -f permanently deletes untracked files',
    suggestion: 'Use git clean -n (dry run) first to see what would be deleted'
  },
  {
    category: 'git',
    test: cmd => /\bgit\s+checkout\s+--\s+\./.test(cmd) || /\bgit\s+checkout\s+\.\s*$/.test(cmd),
    reason: 'git checkout -- . discards all unstaged changes in the working directory',
    suggestion: 'Use git stash to save changes first'
  },
  {
    category: 'git',
    test: cmd => /\bgit\s+branch\s+-D\b/.test(cmd),
    reason: 'git branch -D force-deletes a branch even if it has unmerged changes',
    suggestion: 'Use git branch -d (lowercase) which only deletes fully merged branches'
  },
  {
    category: 'git',
    test: cmd => /\bgit\s+stash\s+(drop|clear)\b/.test(cmd),
    reason: 'git stash drop/clear permanently removes stashed changes',
    suggestion: 'Verify stash contents with git stash show first'
  },

  // Database
  {
    category: 'database',
    test: cmd => /\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/i.test(cmd),
    reason: 'DROP TABLE/DATABASE/SCHEMA permanently destroys database objects',
    suggestion: 'Use a migration or wrap in a transaction with a rollback plan'
  },
  {
    category: 'database',
    test: cmd => /\bTRUNCATE\b/i.test(cmd),
    reason: 'TRUNCATE removes all rows and cannot be rolled back in most databases',
    suggestion: 'Use DELETE with a WHERE clause for selective deletion'
  },
  {
    category: 'database',
    test: cmd => {
      const match = cmd.match(/\bDELETE\s+FROM\s+\S+/i);
      if (!match) return false;
      const afterDelete = cmd.slice(match.index + match[0].length);
      return !/\bWHERE\b/i.test(afterDelete);
    },
    reason: 'DELETE FROM without WHERE deletes all rows in the table',
    suggestion: 'Add a WHERE clause to target specific rows'
  },

  // Environment / Secrets
  {
    category: 'secrets',
    test: cmd => /\bgit\s+add\b/.test(cmd) && /\.env\b/.test(cmd),
    reason: 'Staging .env files risks committing secrets to version control',
    suggestion: 'Add .env* to .gitignore, use .env.example for templates'
  }
];

// ─── Context detection ───────────────────────────────────────────────────────

// Commands that use destructive patterns as data, not execution
const DATA_CONTEXT_PREFIXES = [
  /^grep\s/i,    /^egrep\s/i,   /^fgrep\s/i,   /^rg\s/,
  /^echo\s/,     /^printf\s/,
  /^cat\s/,      /^head\s/,     /^tail\s/,     /^less\s/,    /^more\s/,
  /^sed\s/,      /^awk\s/,
  /^git\s+log\b/,  /^git\s+show\b/,  /^git\s+diff\b/,  /^git\s+grep\b/,
  /^find\s.*-name\s/,
  /^man\s/,      /^help\s/,     /^which\s/,    /^type\s/,
  /^wc\s/,       /^sort\s/,     /^uniq\s/,     /^cut\s/,     /^tr\s/
];

// Even inside data context, these indicate actual execution
const EXECUTION_PASSTHROUGH = [
  /\bbash\s+-c\b/,   /\bsh\s+-c\b/,     /\bzsh\s+-c\b/,
  /\beval\b/,
  /\bpython[23]?\s+-c\b/,  /\bruby\s+-e\b/,   /\bnode\s+-e\b/,  /\bperl\s+-e\b/,
  /\bxargs\s/
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Check if a command has a specific flag for a given command prefix.
 * Handles combined flags: rm -rf, rm -fr, rm -r -f, etc.
 */
function hasFlags(cmd, cmdPrefix, flag) {
  // Find the command and extract everything after it
  const prefixPattern = new RegExp('\\b' + cmdPrefix.replace(/\s+/g, '\\s+') + '\\s+');
  const match = cmd.match(prefixPattern);
  if (!match) return false;

  const afterCmd = cmd.slice(match.index + match[0].length);
  const tokens = afterCmd.split(/\s+/);

  for (const token of tokens) {
    if (!token.startsWith('-')) continue;
    if (token.startsWith('--')) {
      // Long flag: exact match
      if (token === '--' + flag) return true;
    } else {
      // Short flags: check if the flag character is in the combined string
      // e.g., -rf contains both r and f
      if (token.slice(1).includes(flag)) return true;
    }
  }
  return false;
}

/**
 * Split a command string into sub-commands by &&, ||, ;
 * Respects quoted strings.
 */
function splitSubCommands(cmd) {
  const parts = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let escape = false;

  for (let i = 0; i < cmd.length; i++) {
    const ch = cmd[i];

    if (escape) {
      current += ch;
      escape = false;
      continue;
    }

    if (ch === '\\') {
      current += ch;
      escape = true;
      continue;
    }

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      current += ch;
      continue;
    }

    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      current += ch;
      continue;
    }

    if (!inSingle && !inDouble) {
      if (ch === ';') {
        parts.push(current.trim());
        current = '';
        continue;
      }
      if (ch === '&' && cmd[i + 1] === '&') {
        parts.push(current.trim());
        current = '';
        i++; // skip second &
        continue;
      }
      if (ch === '|' && cmd[i + 1] === '|') {
        parts.push(current.trim());
        current = '';
        i++; // skip second |
        continue;
      }
    }

    current += ch;
  }

  if (current.trim()) parts.push(current.trim());
  return parts.filter(Boolean);
}

/**
 * Split a sub-command by pipes, return individual segments.
 */
function splitPipes(subcmd) {
  const parts = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let escape = false;

  for (let i = 0; i < subcmd.length; i++) {
    const ch = subcmd[i];

    if (escape) {
      current += ch;
      escape = false;
      continue;
    }

    if (ch === '\\') {
      current += ch;
      escape = true;
      continue;
    }

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      current += ch;
      continue;
    }

    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      current += ch;
      continue;
    }

    if (!inSingle && !inDouble && ch === '|' && subcmd[i + 1] !== '|') {
      parts.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  if (current.trim()) parts.push(current.trim());
  return parts.filter(Boolean);
}

/**
 * Check if a pipe segment is in data context (search/display command).
 */
function isDataContext(segment) {
  const trimmed = segment.trimStart();

  // Check for execution passthrough first — these override data context
  for (const pattern of EXECUTION_PASSTHROUGH) {
    if (pattern.test(trimmed)) return false;
  }

  // Check if the segment starts with a data-context command
  for (const pattern of DATA_CONTEXT_PREFIXES) {
    if (pattern.test(trimmed)) return true;
  }

  return false;
}

/**
 * Check a command segment against all destructive patterns.
 * Returns the first matching pattern or null.
 */
function checkPatterns(segment) {
  for (const p of PATTERNS) {
    if (p.test(segment)) return p;
  }
  return null;
}

/**
 * Output a deny decision to stdout and log it.
 */
function deny(reason, suggestion, category, command) {
  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: 'Blocked: ' + reason + '.\nSuggestion: ' + suggestion + '.'
    }
  };

  process.stdout.write(JSON.stringify(output));
  appendLog('DENIED', category, command, reason);
}

/**
 * Append a line to the debug log file.
 */
function appendLog(level, category, command, message) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString();
    const cmdShort = (command || '').slice(0, 200);
    const line = '[' + ts + '] ' + level + ' | category=' + (category || 'unknown') + ' | command="' + cmdShort.replace(/"/g, '\\"') + '" | ' + message + '\n';
    fs.appendFileSync(LOG_PATH, line);
  } catch (_) {
    // Never crash on log failure
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  let input = '';
  const stdinTimeout = setTimeout(() => process.exit(0), 3000);

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
    clearTimeout(stdinTimeout);
    try {
      const data = JSON.parse(input);
      const command = data.tool_input && data.tool_input.command;
      if (!command || typeof command !== 'string') return process.exit(0);

      // Split into sub-commands (&&, ||, ;) then pipe segments
      const subCommands = splitSubCommands(command);
      for (const sub of subCommands) {
        const pipeSegments = splitPipes(sub);
        for (const segment of pipeSegments) {
          if (isDataContext(segment)) continue;
          const match = checkPatterns(segment);
          if (match) {
            deny(match.reason, match.suggestion, match.category, command);
            return process.exit(0);
          }
        }
      }

      // No match — allow silently
      process.exit(0);
    } catch (err) {
      appendLog('ERROR', null, null, 'Failed to process: ' + (err.message || err));
      process.exit(0); // fail-open
    }
  });

  process.stdin.on('error', () => process.exit(0));
}

main();
