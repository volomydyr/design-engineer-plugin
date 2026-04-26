#!/usr/bin/env bash
# Inject a generic metacognitive process-recall nudge on every user prompt.
# Prompts Claude to self-check whether a process is active (CLAUDE.md, the
# active skill/command/agent, or what the user established earlier) and to
# briefly state the active process at the top of its response if one applies.
# When no process is active, Claude must respond normally without mentioning
# anything about process. The nudge is fully generic – it never names a
# specific process, so future processes added to the plugin or stated by
# users automatically benefit.

cat <<'HOOK_EOF'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"PROCESS RECALL CHECK: before responding, ask yourself – is there a process I should be following right now? Sources: CLAUDE.md rules, the active skill/command/agent, what the user established earlier in this conversation.\n\nIf a process IS active: briefly state at the top of your response which process you are following and what step you are on, then proceed with that step. This externalizes recall so you stay anchored across long sessions and compactions.\n\nIf NO process is active: respond normally. Do NOT mention process at all – do not say \"no process applies\", do not narrate the check."}}
HOOK_EOF
