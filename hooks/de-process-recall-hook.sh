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
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"PROCESS RECALL CHECK: before responding, ask yourself – is there a process I should be following right now? Sources: CLAUDE.md rules, the active skill/command/agent, what the user established earlier in this conversation.\n\nIf a process IS active: at the very top of your response, list EVERY numbered step verbatim, one per line, with a `← current` marker on the active step. No summarizing. No \"currently between step 1 and step 3\" shorthand. No \"7-step workflow\" without listing the steps. No skipping the list because you have followed this process before in the same session – list it every single time, on every response, while the process is active.\n\nFormat (use exactly this shape):\n\nPROCESS RECALL CHECK — <process name>:\n1. <step 1 short title>\n2. <step 2 short title>\n3. <step 3 short title> ← current\n4. <step 4 short title>\n... (every step, no omissions)\n\nThen proceed with the current step.\n\nIf NO process is active: respond normally. Do NOT mention process at all – do not say \"no process applies\", do not narrate the check."}}
HOOK_EOF
