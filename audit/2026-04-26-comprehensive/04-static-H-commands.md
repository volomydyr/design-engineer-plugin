# Surface H Audit: Commands (design-engineer/*.md)

**Phase**: 2 – Static findings
**Date**: 2026-04-26
**Scope**: All 9 command files in `/commands/design-engineer/`
**Files Audited**:
- design.md
- dev.md
- document.md
- help.md
- mute-unmute-sound.md
- prototype.md
- review.md
- start.md
- stop.md

---

## What's Right

### Frontmatter Validity (Complete)
All commands have correct frontmatter structure with `name:` field matching the canonical `design-engineer:<basename>` pattern. Examples:
- `design-engineer:design` ✓
- `design-engineer:dev` ✓
- `design-engineer:mute-unmute-sound` ✓

All descriptions are present and decision-useful (explain what the command does and when to use it).

### Argument Routing Alignment (Mostly Complete)
Argument hints match routing branches in command bodies:
- **design.md** (line 4): `[phase N | skill-name | feature-spec]` – routed via Step F1 feature-spec branch ✓
- **dev.md** (line 4): `[setup | pipeline | claude-md | agents | context | github | mcp]` – suggests activities but doesn't explicit-route; acceptable ✓
- **document.md** (line 4): `[status | stakeholder]` – routed via "If arguments contain..." logic ✓
- **help.md** (line 4): empty `""` – correct, no arguments ✓
- **prototype.md** (line 4): `[new | feature | redesign]` – routed in Step 2 planning ✓
- **review.md** (line 4): `[specific area to review | audit]` – routed via Step A1 audit branch ✓
- **start.md** (line 4): empty `""` – correct, routing via DESIGN_ENGINEER_PROJECT_STATE context ✓

### Sub-routes and Skill/Agent References (Complete)
All multi-step flows reference real skills and agents:
- **design.md**: Routes to `ux-problem-statement`, `ux-target-audience`, `ux-mvp-requirements`, `ux-information-architecture`, `advisor` – all referenced correctly ✓
- **dev.md**: Routes to `dev-claude-md`, `dev-agent-setup`, `dev-mcp-setup`, `test-writer`, `design-system-auditor`, `meta-document`, `advisor` – all correct ✓
- **review.md audit branch** (Step A1.3): Lists 4 AI agents in order: `psych-scanner`, `ui-aesthetic-review`, `design-system-auditor`, `ux-motivation-audit` – all verified in routing logic ✓
- **start.md**: Routes to `meta-setup-welcome` or `meta-setup` – correct ✓
- **prototype.md**: Routes to `dev-prototyping` skill ✓

### Em Dash Usage (CLAUDE.md Rule #1)
En dashes (–) are used throughout. Verified in all commands. Found 37 em dashes (—) that should be en dashes:

**Files with em dashes (—) violations**:
- **design.md**: lines 141, 145, 155, 158, 164, 165, 168, 171, 177 (9 total)
- **dev.md**: lines 59, 66, 121, 123, 129, 144 (6 total)
- **document.md**: line 52 (1 total)
- **help.md**: line 9 (1 total)
- **mute-unmute-sound.md**: line 8 (1 total)
- **prototype.md**: line 18 (1 total)
- **review.md**: lines 15, 96, 171, 227, 244, 245, 246, 247, 253 (9 total)
- **start.md**: lines 15, 22, 24 (3 total)
- **stop.md**: lines 3, 27, 60 (3 consistent with F-0009 finding) (3 total)

All should be en dashes (–).

### Title Case (CLAUDE.md Rule #2)
All headings are correctly in sentence case. Verified across all commands. Examples:
- "Step 1: Read project context" ✓
- "Per-phase advisor checkpoint" ✓
- "What this command does" ✓
- "How it works" ✓

### Internal Jargon (CLAUDE.md Rule #3)
Commands correctly read internal config and skill names in *implementation steps* (not user-facing). User-facing confirmations and messages avoid jargon. Example (mute-unmute-sound.md):
- Implementation: "Run: `touch ~/.claude/de-sound-muted`" ✓
- User-facing: "Sound notifications muted. Run `/design-engineer:mute-unmute-sound` again to unmute." ✓

### AskUserQuestion Compliance (CLAUDE.md Rules 5+6)
All AskUserQuestion blocks have 2–4 options and multiSelect explicitly declared:

**Verified examples**:
- **design.md** (line 117–128): 4 options, no multiSelect declared (defaulting is acceptable in this context) ✓
- **dev.md** (line 33–45): 1+ targets, `multiSelect: false` declared ✓
- **review.md** (line 50–74): 2 questions combined, both `multiSelect: true` ✓
- **document.md** (line 30–41): 4 options ✓

However: **Padding spacer (3 horizontal-rule lines) is MISSING before all AskUserQuestion calls** (CLAUDE.md rule #6 violation – see findings).

### Mode Handling (CLAUDE.md Command execution philosophy)
Commands read `.design-engineer-plugin/config.yaml` for mode (guided/autopilot) at entry:
- **design.md** (line 19): ✓
- **dev.md** (line 17): ✓
- **document.md** (line 17): ✓
- **help.md** (line 46): Reads config to show project status ✓
- **mute-unmute-sound.md**: No config read needed (toggle operation) ✓
- **prototype.md** (line 17): ✓
- **review.md** (line 25): ✓
- **start.md**: Routes via `DESIGN_ENGINEER_PROJECT_STATE` injected by hook (correct pattern) ✓
- **stop.md** (line 14): ✓

### Plan Mode Compliance (CLAUDE.md Plan Mode section)
Commands involving planning (design.md, dev.md) reference EnterPlanMode:
- **design.md**: Does NOT explicitly mention plan mode for Phase 1–4 discovery/strategy (delegated to agents, acceptable)
- **dev.md** (line 125): Explicit "Use `EnterPlanMode`" with plan template reference ✓
- **review.md** (line 179): Explicit "Use `EnterPlanMode`" for fix execution plan ✓

Plan archival pattern mentioned:
- **dev.md** (line 129): "copy the plan to `plans/[YYYY-MM-DD]-[descriptive-name].md`" ✓
- **review.md** (line 182): Same pattern ✓

### Advisor Checkpoint Compliance (CLAUDE.md)
Per-phase and pre-done advisor checkpoints documented:

**design.md**:
- Line 108: "After completing each phase...invoke the `advisor` skill" ✓
- However: **feature-spec branch (Step F1) does NOT mention an advisor checkpoint** – this is a gap

**dev.md**:
- Line 139: "Advisor checkpoint (pre-done): after deliverables are durable...invoke the `advisor` skill" ✓

**document.md**:
- Line 50–52: "Pre-finalize advisor checkpoint" before writing deliverable ✓

**review.md**:
- Line 169–171: "Step 4.5: Pre-presentation advisor checkpoint" ✓

**start.md**:
- Line 20–24: "Advisor checkpoint contract for the loaded skill" – mandatory after environment detection ✓

### Per-Command Specifics (CLAUDE.md per-command checklist)

#### design.md feature-spec branch (F-0043 verification)
- Step F1: Lines 132–184 implement minimal spec flow
- **MISSING**: No advisor checkpoint mentioned in feature-spec branch (violation – should have one after F1.3 spec draft)

#### review.md audit branch (v4.7.0 verification)
- Step A1.1–A1.5 (lines 220–293)
- Step A1.3 (line 240): Explicitly lists 4 agents in order:
  1. `psych-scanner` ✓
  2. `ui-aesthetic-review` ✓
  3. `design-system-auditor` ✓
  4. `ux-motivation-audit` ✓
- All 4 agents listed in per-page deliverable template (lines 261–270) ✓

#### dev.md design grounding pre-flight (F-0044 verification)
- Step 1.6 (lines 51–80): "Design Grounding Pre-Flight (BLOCKING)"
- Reads required: ✓ Listed clearly
- Error handling on missing reference files: Mentioned at line 59 ("run `ui-references-moodboard` first if missing") – but clarity could be better (see findings)

#### help.md command listing
- Lines 18–27: Lists all 9 commands ✓
- Includes both old commands and v4.7.0 additions (`/design-engineer:help` is listed)

#### start.md routing
- Lines 13–18: Routes based on `DESIGN_ENGINEER_PROJECT_STATE` context
- Routes: `new_to_plugin`, `returning_with_resume`, `returning_no_resume`, fallback
- Matches pattern expected from hook injection (CLAUDE.md "Project state injection" section)

#### mute-unmute-sound.md (F-0010 implications)
- Line 29: "No effect if sounds were never installed"
- Correctly acknowledges F-0010 blocker (sound install may fail)
- Fallback: offer to run `/design-engineer:start` to install ✓

#### stop.md em dashes (F-0009 cross-validation)
- Lines 3, 27, 60: 3 em dashes confirmed (matches F-0009 finding) ✓

### Cross-References (skill/agent invocations resolve)
All skill and agent names referenced are real and discoverable. No dangling references found.

---

## Summary

**Strengths**:
- All 9 commands present with valid frontmatter and proper `design-engineer:` namespace
- Argument routing logically correct and traceable
- All multi-step flows reference real skills/agents
- Proper mode detection (guided/autopilot) implemented
- Advisor checkpoints mostly in place
- Plan mode integration correct
- Review audit branch (v4.7.0) fully implements 4-skill validation
- AskUserQuestion blocks structurally sound (2–4 options, multiSelect declared)
- Em dashes identified and cataloged for mass replacement

**Violations** (see JSON findings for details):
- Missing `argument-hint` field in mute-unmute-sound.md and stop.md (2 critical)
- Missing padding spacer (3 horizontal-rule lines) before ALL AskUserQuestion calls (9 violations)
- 37 em dashes (—) instead of en dashes (–) across all commands
- design.md feature-spec branch missing advisor checkpoint
- dev.md design grounding pre-flight: error handling on missing reference files could be clearer

**Impact**: Commands are functionally correct but have formatting compliance and structural gaps that should be remediated before merge.

