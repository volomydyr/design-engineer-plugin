---
name: design-engineer:cost-mode
description: Switch the plugin between Light mode (no Opus, lower effort, lower token cost) and Full mode (current ship state, higher quality).
argument-hint: "<light|full>"
---

# Design Engineer – Cost mode

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command body references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line.

## Context

<context> #$ARGUMENTS </context>

## Step 1: Parse the argument

Read `$ARGUMENTS`. It must be exactly `light` or `full`. If anything else (empty, `lite`, `medium`, etc.), end the preceding chat message with the canonical 3-horizontal-rule spacer (per CLAUDE.md rule #6) and call `AskUserQuestion`:

```
question: "Which mode do you want to switch to?"
header: "Plugin mode"
options:
  - label: "Light"
    description: "Faster, lower token cost. All AI components run on Sonnet at medium effort. No Opus anywhere. Recommended if you have a usage limit or run long sessions."
  - label: "Full"
    description: "Higher quality. Opus for judgement-heavy work; Sonnet elsewhere. Higher token cost per session. Recommended if usage isn't a constraint."
multiSelect: false
```

Use the user's answer (`light` or `full`) as the target mode.

## Step 2: Update the project config

Run via Bash:

```bash
mkdir -p .design-engineer-plugin
CONFIG=".design-engineer-plugin/config.yaml"
if [ -f "$CONFIG" ]; then
  if grep -qE '^cost_mode:' "$CONFIG"; then
    # Replace existing line
    sed -i.tmp -E "s/^cost_mode:.*/cost_mode: <MODE>/" "$CONFIG"
    rm "$CONFIG.tmp"
  else
    # Append
    printf '\ncost_mode: <MODE>\n' >> "$CONFIG"
  fi
else
  printf 'cost_mode: <MODE>\n' > "$CONFIG"
fi
```

Replace `<MODE>` with the target mode from Step 1.

## Step 3: Apply the rewrite

Run the apply script via Bash, passing `${CLAUDE_PLUGIN_ROOT}` resolved from the context line at the top of this file:

```bash
CLAUDE_PLUGIN_ROOT="${DESIGN_ENGINEER_PLUGIN_ROOT}" bash "${DESIGN_ENGINEER_PLUGIN_ROOT}/scripts/apply-cost-mode.sh"
```

The script reads `cost_mode` from the project config (just updated) and rewrites every agent + skill frontmatter in the plugin cache per `assets/cost-modes.json`.

## Step 4: Confirm in chat

Output one chat message confirming the switch:

> Switched to <MODE> mode. <one-sentence description>:
> - **Light**: All plugin AI components now run on Sonnet at medium effort. No Opus. Expect ~40% lower token cost per session vs Full mode.
> - **Full**: Plugin restored to its ship-state defaults — Opus for judgement-heavy components (advisor, design-system-auditor, psych-scanner, the Phase-4 audit skills, etc.), Sonnet elsewhere. Higher quality, higher cost.

If the user is mid-session and a sub-agent is currently running, mention that the change applies to the next dispatch — the in-flight agent is not affected.

## Notes

- Mode persists in `.design-engineer-plugin/config.yaml` as `cost_mode: <light|full>`. Survives plugin updates.
- Plugin updates re-extract pristine cache files (always in Full mode). On the next `/design-engineer:launch` or `/design-engineer:cost-mode <mode>`, the apply script silently re-applies the user's chosen mode.
- The mode is project-scoped — different projects can have different cost modes.
- This command does NOT change the user's `/model` setting in Claude Code. That's a separate native lever — `/model sonnet` controls the SESSION model (which only affects skills using `model: inherit` and the main loop, not sub-agent dispatches).
