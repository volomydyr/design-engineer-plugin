# 00 — Frozen baseline (Phase 0)

Snapshot taken 2026-04-26 at audit kickoff. All later phases compare against these facts.

## Counts (authoritative)

| Surface | Count | Command |
|---|---|---|
| Skill folders | **57** | `ls -d skills/*/ \| wc -l` |
| Folders with `SKILL.md` | **56** | `find skills -maxdepth 2 -name SKILL.md \| wc -l` |
| Folders WITHOUT `SKILL.md` | **1** | `skills/shared-references/` (reference-only, no entrypoint) |
| Agents | **10** | `ls agents/*.md \| wc -l` |
| Commands | **9** | `ls commands/design-engineer/*.md \| wc -l` |
| Hook files | **14** | 4 .sh, 6 .js, 2 .py, 1 hooks.json, 1 (de-postcompact-hook.sh = .sh #5) |
| Scripts under `skills/*/scripts/` | **3** | detect-environment.sh, detect-state.sh, init-project-structure.sh |
| Reference docs (`skills/*/references/*`) | **104** | `find skills -path "*/references/*" -type f \| wc -l` |
| Evals | **1 file** | `evals/evals.json` (dict, key: `evals` list) |

## Inventory — full lists

### Agents (10)
advisor, backend-implementer, compound-documenter, context-analyzer, deliverable-writer, design-system-auditor, frontend-implementer, psych-scanner, test-writer, ux-researcher.

### Commands (9)
design.md, dev.md, document.md, help.md, mute-unmute-sound.md, prototype.md, review.md, start.md, stop.md.

### Hooks (14 total in `hooks/`)
**Scripts**: check_deliverable_deps.py, de-design-grounding-hook.js, de-fidelity-hook.js, de-plan-copy-hook.js, de-play-sound.sh, de-postcompact-hook.sh, de-process-recall-hook.sh, de-prompt-injection-hook.js, de-safety-hook.js, de-start-state.sh, de-statusline.js, de-tdd-hook.js, session_dep_summary.py.
**Config**: hooks.json (registers 9 of the 13 scripts).

### Hooks NOT registered in `hooks/hooks.json`
- `de-play-sound.sh` — meta-setup writes it to `~/.claude/settings.json` instead (see F-0010).
- `de-statusline.js` — copied to `~/.claude/hooks/de-statusline.js` and registered in `~/.claude/settings.json` (`statusLine` key), not a hook event but the same install pattern.

### Skills (57 folders, 56 with SKILL.md)
**Reference-only (no SKILL.md)**: shared-references.

**Meta (6)**: meta-document, meta-orchestrator, meta-setup, meta-setup-configure, meta-setup-existing, meta-statusline.

**Dev (8)**: dev-agent-setup, dev-claude-md, dev-component-gallery, dev-github-workflow, dev-mcp-setup, dev-prototyping, dev-starter-prompts, dev-status-tracking.

**UX (13)**: ux-assumptions, ux-behavior-mapping, ux-bias-audit, ux-business-plan, ux-communicating-decisions, ux-competitor-analysis, ux-ethics-review, ux-full-review, ux-information-architecture, ux-journey-mapping, ux-motivation-audit, ux-mvp-requirements, ux-problem-statement, ux-story-panels, ux-storybrand, ux-target-audience, ux-user-interviews. *(Note: this is 17 names → recount needed in Phase 1.)*

**UI (8 or 9)**: ui-accessibility, ui-aesthetic-review, ui-design-system, ui-design-to-code-qa, ui-figma-guide, ui-figma-handoff, ui-images, ui-landing-page, ui-references-moodboard.

**Psych (12+)**: psych-cognitive-biases, psych-cognitive-load, psych-decision-fundamentals, psych-decision-persuasion, psych-delight-design, psych-emotional-retention, psych-engagement-patterns, psych-full-scan, psych-habit-formation, psych-pricing-psychology, psych-simplification, psych-social-influence, psych-time-perception, psych-visual-perception.

**Other (2)**: advisor, shared-references.

> Phase 1's `key-matrix-builder` will produce the canonical authoritative list and reconcile this preliminary tally.

## Versions (pinned)

| Where | Value |
|---|---|
| `.claude-plugin/plugin.json` `version` | `4.7.0` |
| `.claude-plugin/marketplace.json` `version` | `4.7.0` |
| `README.md` banner | `**v4.7.0** — see the [changelog](CHANGELOG.md) for what's new.` |
| `CHANGELOG.md` latest entry | `## [4.7.0] – 2026-04-26` |
| Last 7 CHANGELOG entries | 4.7.0, 4.6.0, 4.5.0, 4.4.0, 4.3.1, 4.3.0, 4.2.0 — all dated 2026-04-26 |

## MCP servers declared (`plugin.json` `mcpServers`)

- `context7` — HTTP, `https://mcp.context7.com/mcp`
- `figma` — HTTP, `https://mcp.figma.com/mcp`
- `playwright` — npx, `@playwright/mcp@latest`

**Tool naming patterns observed in skills/agents** (Phase 1 `mcp-tool-name-cataloguer` will produce the full inventory):
- `mcp__plugin_design-engineer_context7__resolve-library-id` and `__query-docs` (in `skills/dev-component-gallery/SKILL.md`)
- `mcp__plugin_figma_figma__*` (preferred per user feedback)
- `figma_*` (bare, in older skills like `ui-design-system`)
- `mcp__playwright__*`

## Plugin's `hooks/hooks.json` registrations

```
UserPromptSubmit: de-start-state.sh, de-process-recall-hook.sh
PreToolUse: de-safety-hook.js (Bash), de-tdd-hook.js (Write|Edit|MultiEdit), de-design-grounding-hook.js (Write|Edit|MultiEdit), figma-screenshot-prompt
PostToolUse: figma-design-context-prompt, check_deliverable_deps.py (Write|Edit|MultiEdit), de-fidelity-hook.js (Write|Edit|MultiEdit), de-plan-copy-hook.js (Write), de-prompt-injection-hook.js (Read|WebFetch|Bash|Grep|Task)
PostCompact: de-postcompact-hook.sh
Stop: session_dep_summary.py
```

**Missing**: no Stop registration for `de-play-sound.sh`, no Notification registration. The sound hook is wired through `skills/meta-setup/SKILL.md:311,323` writing to `~/.claude/settings.json` — which breaks `${CLAUDE_PLUGIN_ROOT}` resolution per Anthropic docs (see F-0010).

## Existing-project context (v4.7.0) — confirmed shape

`hooks/de-start-state.sh` PATH B Step 3 writes `.design-engineer-plugin/config.yaml` with `project.context.*` keys. The 7 canonical-deliverable ux-* skills + 2 enriching skills read these keys. Phase 1's `key-matrix-builder` will catalog every key and find drift between writers and readers.

## Repo-state observations (deferred to later phases)

- `documents/design/` legacy refs in `skills/meta-setup/scripts/detect-environment.sh:102,104,228` and `hooks/de-design-grounding-hook.js:57` (4 instances). All other code uses `design/`. Folder convention mid-migration.
- `commands/design-engineer/stop.md:3,22,60` contains em dashes (—). Plugin CLAUDE.md rule #1 forbids them.
- `agents/advisor.md` frontmatter has `model: claude-opus-4-7` and `effort: xhigh`, but **lacks `disable-model-invocation:`** (canonical docs default: `false` — meaning Claude can auto-invoke; likely not the intent for a manual-checkpoint agent. Verify in Phase 2.)
- `skills/dev-component-gallery/SKILL.md` frontmatter has `model: claude-opus-4-7`, `effort: high`, `license: MIT`, but **lacks `disable-model-invocation:`** (same concern).
- `agents/compound-documenter.md` HAS `model: sonnet` (Ultraplan-corrected; my earlier exploration was wrong).
- `evals/evals.json` is a JSON dict with `plugin_name` and `evals` keys (size: ~180KB). Phase 5 `eval-coverage-agent` will read it and check coverage.
- v4.7.0 plan `plans/2026-04-26-existing-project-support.md` exists; not yet copied to `plans/archive/`.

## Canonical-doc snapshots (in `canonical-docs/`)

- `hooks-doc.md` — full extraction of hook events, hooks.json shape, `${CLAUDE_PLUGIN_ROOT}` rules, exit codes, permissionDecision values.
- `agents-doc.md` — full subagent docs (frontmatter, model, tools, etc.). Persisted from WebFetch.
- `plugins-reference-doc.md` — full plugins reference (manifest schema, marketplace schema, MCP namespacing, etc.). Persisted from WebFetch.

**Skill canonical fields (extracted)**: `name` (lowercase letters/numbers/hyphens, max 64), `description` (recommended; combined with `when_to_use`, capped at 1,536 chars), `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation` (default `false`), `user-invocable` (default `true`), `allowed-tools`, `model`, `effort` (`low|medium|high|xhigh|max`), `context` (`fork`), `agent`, `hooks`, `paths`, `shell` (`bash|powershell`).

**NOT in canonical skill schema**: `license`, `tools`, `memory`. Plugin uses `license: MIT` extensively in skill frontmatter — Phase 3 will flag as non-standard but harmless (likely ignored).

**Hook events (canonical, complete)**: SessionStart, UserPromptSubmit, UserPromptExpansion, PreToolUse, PermissionRequest, PermissionDenied, PostToolUse, PostToolUseFailure, PostToolBatch, Notification, SubagentStart, SubagentStop, TaskCreated, TaskCompleted, Stop, StopFailure, TeammateIdle, InstructionsLoaded, ConfigChange, CwdChanged, FileChanged, WorktreeCreate, WorktreeRemove, PreCompact, PostCompact, Elicitation, ElicitationResult, SessionEnd. **Plugin uses 6 of 28 events**: UserPromptSubmit, PreToolUse, PostToolUse, PostCompact, Stop. (No SessionStart, no Notification, no SubagentStart/Stop — Phase 4 should consider whether Notification would be a better fit for sounds, since Stop already prints text and may not be the right trigger for a chime.)

**${CLAUDE_PLUGIN_ROOT} rule (canonical, verbatim)**: "the plugin's installation directory, for scripts bundled with a plugin." The hooks file MUST be at `hooks/hooks.json` within the plugin root for the variable to resolve. F-0010 is a direct violation.

## What this baseline does NOT yet establish

- Frontmatter validity for all 56 skills + 10 agents + 9 commands (Phase 2 surfaces).
- Reference graph (skill→skill, command→skill, agent→tool) (Phase 1).
- `project.context.*` key-usage matrix (Phase 1).
- Pattern drift across the 7 skip-check skills (Phase 2 Surface C).
- Eval coverage gaps (Phase 5).
- Git-forensics on commit hygiene (Phase 5).
- Behavioral correctness of any flow on fixture repos (Phase 4).

Baseline complete. Proceeding to Phase 1.
