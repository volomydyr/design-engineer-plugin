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
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"PROCESS RECALL CHECK: before responding, ask yourself – is there a process I should be following right now? Sources: CLAUDE.md rules, the active skill/command/agent, what the user established earlier in this conversation.\n\nIf a process IS active: at the top of your response, briefly list ALL steps of the process (numbered, one short line each – not just the count), then mark which step you are currently on (e.g., \"← current\"), then proceed with that step. Listing every step keeps the full sequence in your context so you do not forget what comes next or skip ahead. Re-list it on every response while the process is active – do not assume you remembered it from a previous turn.\n\nIf NO process is active: respond normally. Do NOT mention process at all – do not say \"no process applies\", do not narrate the check."}}
HOOK_EOF
