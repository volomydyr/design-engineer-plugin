# v2.6.3 — Process-recall metacognitive nudge

## Context

Across this session and prior ones, Claude has repeatedly drifted from agreed processes (the 7-step beta-feedback workflow, the prototype-as-baseline rule, etc.). Each time the user manually re-anchors with "you forgot the process" — that nudge is the only thing that gets behavior back on track. We want to automate that nudge.

The processes themselves are already documented in CLAUDE.md, skills, agents, commands, and user agreements made earlier in conversation. The model has them — it just doesn't *recall* them at the moment of responding. So the fix is metacognitive, not text-bound: prompt Claude to ask itself "is there a process I should be following?" before every response, and if yes, briefly state it in the response so it stays anchored.

The user's refinement: when no process is active (e.g., a user is just starting out and chatting casually), Claude must NOT pollute every response with "no active process here." Silence in that case. The nudge text itself encodes the conditional.

## Architectural decisions

- **UserPromptSubmit hook** chosen over CLAUDE.md rule or PreToolUse. UserPromptSubmit re-fires every turn so the nudge survives compaction and long sessions; CLAUDE.md fades behind newer context. PreToolUse fires too late (after Claude has already begun reasoning).
- **Generic, never tied to a specific process**. The hook injects ~3–4 lines of text that prompt self-recall from whatever Claude has already loaded. No process catalog, no mapping logic. Future processes added to the plugin (or stated by users) automatically benefit.
- **Conditional verbalization** is encoded in the nudge text itself. Hook stays tiny (no logic to detect "is a process active?"). Claude does that judgment per turn.
- **Tiny bash script** mirrors `de-start-state.sh` plumbing exactly. Same hook event, same JSON output shape (`hookSpecificOutput.additionalContext`). One new file, one hooks.json entry.

## Phase 1: Build the hook + ship v2.6.3

**Objective**: Add the metacognitive process-recall nudge as a UserPromptSubmit hook so Claude self-anchors to active processes before every response.

**Depends on**: none

**Files**:
- Create: `hooks/de-process-recall-hook.sh` — emits JSON with the nudge text as `additionalContext`. Make it executable.
- Modify: `hooks/hooks.json` — register the hook under the existing `UserPromptSubmit` array (sibling to `de-start-state.sh`). Both fire on every prompt; outputs are merged.
- Modify: `.claude-plugin/plugin.json` — bump `2.6.2` → `2.6.3`.
- Modify: `.claude-plugin/marketplace.json` — bump `2.6.2` → `2.6.3`.
- Modify: `CHANGELOG.md` — add `[2.6.3] – 2026-04-26` entry under "Added".
- Modify: `README.md` — bump banner `v2.6.2` → `v2.6.3`.

**Reuse**:
- `hooks/de-start-state.sh` as the template for bash/JSON structure (same `hookSpecificOutput.additionalContext` shape). Use as-is for reference.
- Existing `UserPromptSubmit` array in `hooks/hooks.json` — append new entry, do not duplicate the array.
- Existing `${CLAUDE_PLUGIN_ROOT}` substitution and `bash` command type, same as `de-start-state.sh`.

**Nudge text** (the `additionalContext` payload):

```
PROCESS RECALL CHECK: before responding, ask yourself — is there a process I should be following right now? Sources: CLAUDE.md rules, the active skill/command/agent, what the user established earlier in this conversation.

If a process IS active: briefly state at the top of your response which process you are following and what step you are on, then proceed with that step. This externalizes recall so you stay anchored across long sessions and compactions.

If NO process is active: respond normally. Do NOT mention process at all — do not say "no process applies", do not narrate the check.
```

**Checklist**:
- [ ] Write `hooks/de-process-recall-hook.sh` (~10 lines bash, emits the JSON payload above)
- [ ] `chmod +x hooks/de-process-recall-hook.sh`
- [ ] Add hooks.json entry under `UserPromptSubmit` (separate hook block, same array)
- [ ] Bump `.claude-plugin/plugin.json` version 2.6.2 → 2.6.3
- [ ] Bump `.claude-plugin/marketplace.json` version 2.6.2 → 2.6.3
- [ ] Add CHANGELOG `[2.6.3] – 2026-04-26` entry under `### Added` describing the nudge hook
- [ ] Bump README banner v2.6.2 → v2.6.3
- [ ] Validate: `python3 -m json.tool .claude-plugin/plugin.json`, `marketplace.json`, `hooks/hooks.json`
- [ ] Smoke-test: `bash hooks/de-process-recall-hook.sh < /dev/null | python3 -m json.tool` produces valid JSON

**QA** (what to verify):
1. Run the smoke-test above — it must print valid JSON with `hookSpecificOutput.additionalContext` containing the three-paragraph nudge text.
2. `cat hooks/hooks.json | python3 -m json.tool` succeeds (no syntax error from the new entry).
3. Open `hooks/hooks.json` and confirm both `de-start-state.sh` AND `de-process-recall-hook.sh` are listed under `UserPromptSubmit` — both should fire on every prompt, sibling entries.
4. Open a new Claude Code session in this repo, send a casual message — verify Claude does NOT announce "no process applies" (silent path).
5. In the same session, invoke a plugin command (e.g., `/de:review`) — verify Claude states which step of the command's process it's on at the top of subsequent responses (active path).
6. CHANGELOG, plugin.json, marketplace.json, README all read 2.6.3.

## Risk assessment

- **Risk**: Nudge fires on every prompt and clutters Claude's context. Mitigation: payload is ~3 short paragraphs (~80 words). Negligible context cost compared to its anchoring value.
- **Risk**: Claude over-announces and clutters every response with "I'm following process X" even when the request is trivial within the process. Mitigation: nudge phrasing says "briefly state… and what step you are on" — emphasis on briefly. If real-world usage shows over-announcing, tighten the wording in a follow-up patch.
- **Risk**: Two `UserPromptSubmit` hooks firing in parallel could conflict if outputs aren't merged. Mitigation: Anthropic docs confirm `additionalContext` from multiple hooks is concatenated. The existing TDD/grounding hooks already prove the multi-hook pattern works.
- **Risk**: Claude treats the nudge as ignorable advisory and drift returns. Mitigation: if so, escalate to Option C from the design discussion (PreToolUse deny on Edit/Write when process steps weren't acknowledged). Patch first, see if the nudge alone is enough.

## Verification (end-to-end)

After v2.6.3 lands and is pushed:
1. JSON manifests valid, all four manifest/banner reads `2.6.3`.
2. `hooks/de-process-recall-hook.sh` exists, executable, emits valid JSON when piped through `python3 -m json.tool`.
3. `hooks/hooks.json` parses cleanly and lists the new hook under `UserPromptSubmit`.
4. Manual smoke test in a fresh session of the plugin: casual message → silent on process; plugin command active → Claude announces step at top of response.

## Questions for user

None — option A (UserPromptSubmit metacognitive nudge) approved, with the no-process-silent refinement folded into the nudge text. Ready to implement on approval.
