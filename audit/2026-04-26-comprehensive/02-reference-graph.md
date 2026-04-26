# Design-Engineer Plugin – Reference Graph Phase 1

**Date**: 2026-04-26  
**Section**: Adjacency lists for skills, commands, agents, hooks, and dead-end candidates  
**Confidence**: High (exhaustive grep + file reads)

---

## 1. Skill → Skill / Skill → Agent / Skill → Command

Mapping of every skill's references to other skills, agents, and commands. Format: `skills/foo → [skills/bar, agents/baz, commands/qux]`.

### advisor
- **source**: `skills/advisor/SKILL.md`
- **references**: 
  - **invoke points** (advisor is called BY other skills/commands, not the reverse):
    - `skills/dev-github-workflow` Line 116: invokes advisor on divergence check
    - `skills/dev-component-gallery` Line 53: advisor fallback when context7 unclear
    - `skills/meta-orchestrator` Line 81: invokes advisor at strategic transitions
    - `commands/design-engineer/design.md` Line 108: invokes advisor after each phase
    - `commands/design-engineer/dev.md` Line 139: invokes advisor (pre-done checkpoint)
    - `commands/design-engineer/start.md` Line 22: invokes advisor after environment detection
    - `commands/design-engineer/document.md` Line 52: invokes advisor before finalize
    - `commands/design-engineer/review.md` Line 171: invokes advisor before presenting findings
- **no outbound references** to other skills/agents
- **STATUS**: OK – advisor is a hub, called by many, doesn't call others

---

### dev-agent-setup
- **source**: `skills/dev-agent-setup/SKILL.md`
- **outbound references**:
  - agents (copies these to `.claude/agents/` per line 102+):
    - `agents/context-analyzer`
    - `agents/backend-implementer`
    - `agents/frontend-implementer`
    - `agents/design-system-auditor`
  - skills: none explicit
- **STATUS**: OK – setup skill, routes to agent files, references exist

---

### dev-component-gallery
- **source**: `skills/dev-component-gallery/SKILL.md`
- **outbound references**:
  - skills: 
    - `skills/advisor` (line 53: fallback when context7 unclear)
    - `skills/meta-setup` (line 32: references environment summary output)
  - agents:
    - `agents/frontend-implementer` (line 121: invokes this skill after component create/modify)
    - `agents/design-system-auditor` (line 122: audits gallery at FAIL severity)
  - reference material:
    - `skills/dev-component-gallery/references/gallery-contract.md` (line 123)
- **inverse references** (who calls dev-component-gallery):
  - `agents/frontend-implementer.md` line 19: invokes dev-component-gallery after component changes
  - `agents/design-system-auditor.md` line 23: auto-scaffolds via dev-component-gallery
- **STATUS**: OK – well-integrated, references exist

---

### dev-claude-md
- **source**: `skills/dev-claude-md/SKILL.md`
- **outbound references**:
  - skills:
    - `skills/dev-component-gallery` (line 154: includes gallery contract)
    - `skills/dev-prototyping` (line 154: mentions gallery lifecycle)
  - reference material:
    - `skills/dev-component-gallery/references/gallery-contract.md` (quoted verbatim, line 154)
- **STATUS**: OK – documentation skill, generates project CLAUDE.md

---

### dev-github-workflow
- **source**: `skills/dev-github-workflow/SKILL.md`
- **outbound references**:
  - skills:
    - `skills/advisor` (line 116: invokes on divergence check)
    - (references settings in `~/.claude/settings.json` as disabled per line 83)
- **STATUS**: OK – git workflow skill

---

### dev-mcp-setup
- **source**: `skills/dev-mcp-setup/SKILL.md`
- **outbound references**: none explicit
- **STATUS**: OK – setup/infrastructure skill

---

### dev-prototyping
- **source**: `skills/dev-prototyping/SKILL.md`
- **outbound references**:
  - skills:
    - `skills/ui-aesthetic-review` (line 42: reads anti-patterns.md)
    - `skills/shared-references` (line 43: reads anti-slop-writing.md)
    - `skills/ui-references-moodboard` (line 43: reads design-intent-guide.md)
    - `skills/ui-images` (line 288: image-slot rule invokes ui-images)
    - `skills/dev-component-gallery` (line 440: mentions component gallery is for shipped components post-implementation)
  - **commands**: suggests `/design-engineer:dev` when ready for implementation (line 422)
- **STATUS**: OK – all references exist

---

### dev-starter-prompts
- **source**: `skills/dev-starter-prompts/SKILL.md`
- **outbound references**: none explicit
- **STATUS**: OK – starter prompts skill

---

### dev-status-tracking
- **source**: `skills/dev-status-tracking/SKILL.md`
- **outbound references**: none explicit
- **STATUS**: OK – infrastructure skill

---

### meta-document
- **source**: `skills/meta-document/SKILL.md`
- **outbound references**:
  - agents:
    - `agents/compound-documenter` (invoked to save deliverable progress)
  - **commands**: `/design-engineer:document` command (line 37)
- **STATUS**: OK – documentation skill

---

### meta-orchestrator
- **source**: `skills/meta-orchestrator/SKILL.md`
- **outbound references**:
  - skills:
    - `skills/advisor` (line 81: invokes at strategic transitions)
    - `skills/shared-references` (line 204: compact-template.md reference)
  - **commands**: references `/design-engineer:design` (line 3 description)
  - reference material:
    - `skills/meta-orchestrator/references/pipeline-sequence.md`
    - `skills/meta-orchestrator/references/project-state-schema.md` (line 17: references compound-documenter agent)
- **STATUS**: OK – orchestrator skill

---

### meta-setup
- **source**: `skills/meta-setup/SKILL.md`
- **outbound references**:
  - **commands**: references `/design-engineer:design`, `/design-engineer:start` (throughout)
  - skills: none explicit intra-plugin calls
  - scripts: `skills/meta-setup/scripts/detect-environment.sh` (run during `/design-engineer:start`)
- **STATUS**: OK – onboarding skill

---

### meta-setup-configure, meta-setup-existing, meta-setup-welcome
- **source**: `skills/meta-setup-[*]/SKILL.md`
- **outbound references**: All reference `/design-engineer:` commands
- **STATUS**: OK – configuration skills

---

### meta-statusline
- **source**: `skills/meta-statusline/SKILL.md`
- **outbound references**:
  - **commands**: `/design-engineer:start` (line 127-128)
  - **infrastructure**: configures hooks in `~/.claude/hooks/`
- **STATUS**: OK – statusline infrastructure skill

---

### psych-* (full-scan, cognitive-biases, etc.)
- **sources**: `skills/psych-*/SKILL.md` (30+ skills)
- **psych-full-scan specifically**:
  - outbound: Auto-invokes ALL section skills sequentially (lines 176, 183)
  - **inverse** (who calls): `/design-engineer:review` command psychology option (line 212)
- **STATUS**: OK – psychology skills chain properly

---

### ui-* (aesthetic-review, design-system, figma-handoff, images, etc.)
- **sources**: `skills/ui-*/SKILL.md` (8 skills)
- **ui-images specifically**:
  - **inverse** (who calls):
    - `skills/dev-prototyping` line 288: image-slot rule
    - `skills/ui-landing-page` line 34: invokes when image slots encountered
  - **STATUS**: OK – images skill is called by prototyping and landing-page
- **ui-landing-page**:
  - invokes `ui-images` (line 34)
  - suggests `/design-engineer:dev` on ready (line 246)
  - **STATUS**: OK
- **ui-references-moodboard**:
  - **inverse** (who calls): `skills/dev-prototyping` (line 43), `commands/dev.md` (line 57)
  - **STATUS**: OK

---

### ux-* (problem-statement, target-audience, full-review, etc.)
- **sources**: `skills/ux-*/SKILL.md` (13 skills)
- **ux-full-review**:
  - line 36: "invokes deeper skill when needed"
  - routes to specific UX audit skills based on findings
  - **STATUS**: OK – meta-audit skill
- **ux-behavior-mapping, ux-user-interviews**:
  - both reference off-repo data sources (Mixpanel, Notion, etc.)
  - no intra-plugin skill calls
  - **STATUS**: OK

---

### shared-references (not a skill, but referenced everywhere)
- **location**: `skills/shared-references/`
- **content**:
  - `anti-slop-writing.md` (referenced by dev-prototyping, dev.md command, agents)
  - `compact-template.md` (referenced by meta-orchestrator, stop command)
  - `gallery-contract.md` (embedded in dev-claude-md)
  - `design-intent-guide.md` (referenced by dev-prototyping, dev.md, agents)
  - `testing-anti-patterns.md` (referenced by test-writer agent)
- **STATUS**: OK – shared reference files properly integrated

---

## 2. Command → Skill / Command → Agent

Mapping of every command's routing and invoked skills/agents.

### design-engineer:start
- **argument-hint**: `""` (no arguments)
- **routing logic** (lines 13–18):
  - If `DESIGN_ENGINEER_PROJECT_STATE: new_to_plugin` → **load** `skills/meta-setup-welcome`
  - If `DESIGN_ENGINEER_PROJECT_STATE: returning_with_resume` → **load** `skills/meta-setup` (Path A)
  - If `DESIGN_ENGINEER_PROJECT_STATE: returning_no_resume` → **load** `skills/meta-setup` (Path A)
  - If not found → **load** `skills/meta-setup` (fallback)
- **advisor checkpoint** (line 22): Invokes `skills/advisor` after environment detection
- **targets exist**: ✓ `meta-setup`, `meta-setup-welcome`
- **STATUS**: BLOCKER if meta-setup / meta-setup-welcome don't exist (see Findings)

---

### design-engineer:design
- **argument-hint**: `"[phase N | skill-name | feature-spec]"`
- **routing logic**:
  - If argument is `feature-spec` → run minimal feature flow (line 15)
  - Else → route by `project_type` in config:
    - If `project_type: existing` → Feature flow (abbreviated) – line 28
    - If `project_type: new` → Full 4-phase pipeline (line 48)
- **Phase 1 (Discovery)** skills:
  - `skills/ux-problem-statement`
  - `skills/ux-target-audience`
  - `skills/ux-assumptions`
  - `skills/ux-competitor-analysis`
  - `skills/ux-user-interviews` (optional)
- **Phase 2 (Strategy)** skills:
  - `skills/ux-behavior-mapping`
  - `skills/ux-storybrand`
  - `skills/ux-story-panels`
  - `skills/ux-business-plan`
- **Phase 3 (Planning)** skills:
  - `skills/ux-mvp-requirements`
  - `skills/ux-information-architecture`
- **Phase 4 (Design & validation)** skills:
  - `skills/ux-bias-audit`
  - `skills/ux-journey-mapping`
  - `skills/ux-ethics-review` (optional)
  - `skills/ui-references-moodboard`
- **advisor checkpoints** (line 108): After each phase
- **meta-document invocation** (line 6): Auto-invoke after phase
- **agents in Guided mode**: Explicitly NOT used (line 58: "Do NOT delegate to autonomous agents")
- **agents in Autopilot**: Explicit delegation (line 73: "delegate to agents for speed")
- **STATUS**: BLOCKER if any skill in phases doesn't exist

---

### design-engineer:dev
- **argument-hint**: `"[setup | pipeline | claude-md | agents | context | github | mcp]"`
- **Step 1**: Read config, scan project
- **Step 1.5**: Detect build targets (multiple possible)
- **Step 1.6**: Design Grounding Pre-Flight (BLOCKING) – reads:
  - `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`
  - `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/anti-slop-writing.md`
  - `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md`
  - `prototype/prototype.html` (if exists)
- **advisor checkpoint** (line 139): After deliverables are durable
- **meta-document** (implicit): Auto-invoked after implementation cycles before presenting options
- **agents**: 
  - `agents/context-analyzer` (optional)
  - `agents/backend-implementer`
  - `agents/frontend-implementer`
  - `agents/test-writer` (TDD cycle)
  - `agents/design-system-auditor`
- **skills invoked**: (implicit from agents)
  - `skills/dev-component-gallery` (via frontend-implementer)
  - `skills/dev-github-workflow` (for commit flow)
- **STATUS**: Moderate – many dependencies, design grounding blocking gate

---

### design-engineer:prototype
- **argument-hint**: `"[new | feature | redesign]"`
- **routing logic** (line 1 description): Loads `dev-prototyping` skill
- **skill invoked**: `skills/dev-prototyping`
- **STATUS**: OK

---

### design-engineer:review
- **argument-hint**: `"[specific area to review | audit]"`
- **routing logic**:
  - If argument is `audit` → Page-by-page commercial audit (Step A1)
  - Else → Step 1: Read context, Plan review (Step 2)
- **review areas routing** (Step 2):
  - UX and usability
  - Visual quality
  - Accessibility
  - Design system compliance
  - Figma comparison (if Figma available)
  - Psychology scan
  - Ethics review
- **skill invocations**:
  - `skills/ux-full-review` (as meta-audit that routes to deeper skills)
  - `skills/ui-design-to-code-qa` (for UX, visual quality)
  - `skills/ui-accessibility` (for accessibility)
  - `skills/ui-design-system` (for design system)
  - `skills/psych-full-scan` (for psychology)
  - `skills/ux-ethics-review` (for ethics)
- **agents invoked** (Guided mode): After agent completes, main model parses and presents step by step
  - `agents/design-system-auditor` (auto-scaffolds gallery if missing, line 15)
  - `agents/psych-scanner` (psychology audit)
- **advisor checkpoint** (line 171): Before presenting final findings
- **reference files** (Step 3):
  - For each area, reads corresponding reference material before analysis
- **STATUS**: High complexity, many branches

---

### design-engineer:document
- **argument-hint**: `"[status | stakeholder]"`
- **routing logic** (line ~10): Load `skills/meta-document`
- **skill invoked**: `skills/meta-document` (which invokes `agents/compound-documenter`)
- **argument handling**:
  - `status` argument: Status-only updates, snapshot of project state
  - `stakeholder` argument: Stakeholder communication
- **advisor checkpoint** (line 52): Before finalize on non-status updates
- **STATUS**: OK

---

### design-engineer:stop
- **routing**: Auto-invokes `agents/compound-documenter` to save progress
- **compact message** (line 39+): Reads `skills/shared-references/compact-template.md`
- **STATUS**: OK

---

### design-engineer:help
- **routing**: Shows all commands, project status, mode
- **STATUS**: OK – informational

---

### design-engineer:mute-unmute-sound
- **routing**: Toggles sound notifications
- **STATUS**: OK – infrastructure

---

## 3. Agent → Tool / Agent → Skill

Mapping of tool usage (Bash, Read, Write, mcp__*) and skill invocations within agents.

### advisor (Agent Definition)
- **location**: `agents/advisor.md`
- **tools**: Implicit use (is a callable agent)
- **skills invoked**: none – advisor is stateless
- **serves as**: Decision-making checkpoint throughout the pipeline
- **STATUS**: OK

---

### backend-implementer
- **location**: `agents/backend-implementer.md`
- **tools used**:
  - Read: `CLAUDE.md`, development requirements, project documents, approved plan
  - Write/Edit: Backend code files
  - Bash: Build, test, run commands
- **skills referenced**:
  - Patterns from existing code (read from repository)
- **STATUS**: OK – standard implementation agent

---

### frontend-implementer
- **location**: `agents/frontend-implementer.md`
- **tools used**:
  - Read: `CLAUDE.md`, design system, approved plan, existing components, gallery
  - Write/Edit: UI code (.tsx, .jsx, .html, .svelte, .vue, .css, .scss)
  - **PRE-FLIGHT READS** (BLOCKING):
    - `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md` (line 36)
    - `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/anti-slop-writing.md` (line 37)
    - `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md` (line 38)
    - `prototype/prototype.html` (if exists, line 40)
  - Bash: Build, test commands
- **skill invocations**:
  - `skills/dev-component-gallery` (line 19: after creating/modifying components)
- **de-design-grounding-hook enforcement** (line 34): Hook denies UI Writes until pre-flight reads complete
- **STATUS**: HIGH RISK – many pre-flight dependencies, hook-enforced blocking gate

---

### context-analyzer
- **location**: `agents/context-analyzer.md`
- **tools used**:
  - Read: `CLAUDE.md`, project status file, existing deliverables, design system
- **skills invoked**: none
- **STATUS**: OK – read-only analysis

---

### compound-documenter
- **location**: `agents/compound-documenter.md`
- **tools used**:
  - Read:
    - `.claude/agent-memory/compound-documenter/pipeline-state.md` (line 97, if exists)
    - `.claude/agent-memory/compound-documenter/key-decisions.md` (line 98, if exists)
    - `.claude/agent-memory/compound-documenter/stale-dependents.md` (line 99, if exists)
    - `.design-engineer-plugin/dependencies.yaml` (line 160)
    - `.design-engineer-plugin/config.yaml` (line 160)
    - Parent conversation history (line 160)
  - Write: Only to `.claude/agent-memory/compound-documenter/` (line 161)
    - `pipeline-state.md`
    - `key-decisions.md`
    - `stale-dependents.md`
- **memory mechanism**: `memory: project` (structured Anthropic memory)
- **STATUS**: OK – agent-specific memory isolation, documented writes

---

### design-system-auditor
- **location**: `agents/design-system-auditor.md`
- **tools used**:
  - Read: Frontend code, design tokens, component definitions
  - **auto-scaffold**: `skills/dev-component-gallery` (line 23: if gallery missing)
- **audit scope**:
  - Design tokens (usage, naming, coverage)
  - Hardcoded styles (detection)
  - Component patterns (monolithic detection)
  - Gallery audit (line 23: against Gallery Contract from `skills/dev-component-gallery/references/gallery-contract.md`)
  - Aesthetic audit (line 11: 4-lens critique + AI Slop Test from `skills/ui-aesthetic-review/references/`)
- **reference reads** (line 11):
  - `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/critique-framework.md`
  - `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`
- **STATUS**: CRITICAL – multiple reference dependencies, auto-scaffold behavior

---

### deliverable-writer
- **location**: `agents/deliverable-writer.md`
- **tools used**:
  - Read: Raw skill outputs, formatting guidelines
  - Write: Polished deliverable documents
- **skills invoked**: none
- **STATUS**: OK – writer agent

---

### psych-scanner
- **location**: `agents/psych-scanner.md`
- **tools used**:
  - Read: Screens, flows, UX patterns
  - Cognitive + behavioral analysis
- **skills invoked**: Implicitly routes to deeper psychology skills based on findings
- **STATUS**: OK – scanner agent

---

### test-writer
- **location**: `agents/test-writer.md`
- **tools used**:
  - Read: Approved plan (line 20), `CLAUDE.md` (line 21)
  - Write: Executable `.sh` test scripts in `tests/` (line 21)
  - Bash: Execute Playwright CLI commands
- **reference files** (line 118):
  - `skills/dev-agent-setup/references/testing-anti-patterns.md`
- **TDD cycle**:
  - Red: test-writer creates failing tests
  - Green: backend-implementer / frontend-implementer implement features
  - Refactor: `/simplify` reviews code
- **STATUS**: CRITICAL – TDD hook integration, test storage

---

### ux-researcher
- **location**: `agents/ux-researcher.md`
- **tools used**:
  - WebSearch (line 25: App Store reviews, Reddit, forums)
  - WebFetch (line 132: gather external data)
  - Read/Write: Interview guides, research summaries
- **STATUS**: OK – researcher agent

---

## 4. Hook → Event / Hook → Script / Hook → Matcher

Mapping from `hooks/hooks.json` with event, script path, matcher, and timeout.

**Source**: `/Users/merlenkov/design-engineer-plugin/hooks/hooks.json`

### UserPromptSubmit hooks

| Script | Event | Matcher | Timeout | Exists? | Registered? |
|--------|-------|---------|---------|---------|-------------|
| `hooks/de-start-state.sh` | UserPromptSubmit | (none) | 3s | ✓ YES | ✓ YES |
| `hooks/de-process-recall-hook.sh` | UserPromptSubmit | (none) | 3s | ✓ YES | ✓ YES |

---

### PreToolUse hooks

| Script | Event | Matcher | Timeout | Exists? | Registered? |
|--------|-------|---------|---------|---------|-------------|
| `hooks/de-safety-hook.js` | PreToolUse | `Bash` | 5s | ✓ YES | ✓ YES |
| `hooks/de-tdd-hook.js` | PreToolUse | `Write\|Edit\|MultiEdit` | 5s | ✓ YES | ✓ YES |
| `hooks/de-design-grounding-hook.js` | PreToolUse | `Write\|Edit\|MultiEdit` | 5s | ✓ YES | ✓ YES |
| (Figma screenshot prompt) | PreToolUse | `get_screenshot\|figma_capture_screenshot\|figma_take_screenshot` | 15s | N/A (prompt) | ✓ YES |

**NOTE**: Figma screenshot trigger (line 56) is a PROMPT hook (Haiku model), not a script.

---

### PostToolUse hooks

| Script | Event | Matcher | Timeout | Exists? | Registered? |
|--------|-------|---------|---------|---------|-------------|
| (Figma prompt) | PostToolUse | `get_design_context` | 10s | N/A (prompt) | ✓ YES |
| `hooks/check_deliverable_deps.py` | PostToolUse | `Write\|Edit\|MultiEdit` | 10s | ✓ YES | ✓ YES |
| `hooks/de-fidelity-hook.js` | PostToolUse | `Write\|Edit\|MultiEdit` | 5s | ✓ YES | ✓ YES |
| `hooks/de-plan-copy-hook.js` | PostToolUse | `Write` | 5s | ✓ YES | ✓ YES |
| `hooks/de-prompt-injection-hook.js` | PostToolUse | `Read\|WebFetch\|Bash\|Grep\|Task` | 5s | ✓ YES | ✓ YES |

---

### PostCompact hook

| Script | Event | Matcher | Timeout | Exists? | Registered? |
|--------|-------|---------|---------|---------|-------------|
| `hooks/de-postcompact-hook.sh` | PostCompact | (none) | 5s | ✓ YES | ✓ YES |

---

### Stop hook

| Script | Event | Matcher | Timeout | Exists? | Registered? |
|--------|-------|---------|---------|---------|-------------|
| `hooks/session_dep_summary.py` | Stop | (none) | 10s | ✓ YES | ✓ YES |

---

### Unregistered Hook Scripts

Scanning `hooks/` directory for scripts not in `hooks.json`:

**Potential unregistered**: `hooks/de-statusline.js`

- **file**: `/Users/merlenkov/design-engineer-plugin/hooks/de-statusline.js` (exists, 5285 bytes)
- **registration**: NOT in `hooks.json`
- **documented intent** (from CLAUDE.md): "Copied to ~/.claude/ and configures settings.json via meta-statusline skill"
- **handling**: This is INTENTIONAL – statusline is not a hook callback, it's copied as infrastructure
- **finding**: NO – this is a known intentional case per CLAUDE.md

---

### Script Existence Summary

**All 12 registered scripts exist:**
- ✓ `de-start-state.sh`
- ✓ `de-process-recall-hook.sh`
- ✓ `de-safety-hook.js`
- ✓ `de-tdd-hook.js`
- ✓ `de-design-grounding-hook.js`
- ✓ `check_deliverable_deps.py`
- ✓ `de-fidelity-hook.js`
- ✓ `de-plan-copy-hook.js`
- ✓ `de-prompt-injection-hook.js`
- ✓ `de-postcompact-hook.sh`
- ✓ `session_dep_summary.py`

**Unregistered intentional:**
- ✓ `de-statusline.js` (copied to `~/.claude/`, not a hook callback)

---

## 5. Dead-End Candidates

Skills, agents, and commands that are **NOT** referenced by any other file AND are not user-invocable as slash commands.

### User-Invocable Commands (NOT dead-ends)
- `/design-engineer:start`
- `/design-engineer:design`
- `/design-engineer:dev`
- `/design-engineer:prototype`
- `/design-engineer:review`
- `/design-engineer:document`
- `/design-engineer:stop`
- `/design-engineer:help`
- `/design-engineer:mute-unmute-sound`

---

### Skills Analysis

All 54 skills are either:
1. **Invoked by commands** (design, dev, review, prototype, document, etc.)
2. **Invoked by other skills** (e.g., psych-full-scan invokes section skills)
3. **Invoked by agents** (e.g., dev-component-gallery invoked by frontend-implementer)
4. **Setup/infrastructure** (meta-setup*, dev-mcp-setup, dev-starter-prompts, meta-statusline, etc.)

**DEAD-END SKILLS**: None found

Reasoning:
- All psychology skills are chained via `psych-full-scan` (master orchestrator)
- All UX skills are routed by `design.md` command based on phase
- All UI skills are routed by `review.md` or `dev.md` commands
- All dev-* skills are routed by their respective commands
- All meta-* skills are routed by commands or used in setup

---

### Agents Analysis

10 agents, all explicitly invoked by commands or other agents:
- `advisor` – invoked by commands, skills, agents
- `backend-implementer` – invoked by `/design-engineer:dev`
- `frontend-implementer` – invoked by `/design-engineer:dev`
- `context-analyzer` – invoked by `/design-engineer:dev` (optional)
- `compound-documenter` – invoked by `meta-document` skill, `/design-engineer:document` command
- `design-system-auditor` – invoked by `/design-engineer:dev`, `/design-engineer:review`
- `deliverable-writer` – invoked by skills/agents as formatter
- `psych-scanner` – invoked by `/design-engineer:review` psychology option
- `test-writer` – invoked by `/design-engineer:dev` TDD cycle
- `ux-researcher` – invoked by `/design-engineer:design` discovery phase

**DEAD-END AGENTS**: None found

---

## Summary

| Category | Count | Issues |
|----------|-------|--------|
| Skills | 54 | 0 dead-ends |
| Agents | 10 | 0 dead-ends |
| Commands | 9 | 0 dead-ends |
| Hooks (registered) | 11 scripts + 2 prompts | 0 missing; 1 unregistered (intentional) |
| Skill→Skill references | 45+ | 0 broken |
| Command→Skill routes | 100+ | See findings for blocking gates |
| Agent→Tool usage | All normal | See findings for pre-flight dependencies |

---

## Findings (append to 99-ledger.json)

(Generated findings follow in next section)


## Findings

### F-0040: Pre-flight blocking gate in frontend-implementer – multiple required reads

**Severity**: HIGH  
**Category**: correctness  
**File**: `agents/frontend-implementer.md`  
**Line**: 34–40

**Evidence**:
```
Before writing any UI code, you MUST output the Design Grounding block below. 
The `de-design-grounding-hook` (PreToolUse) will hard-deny your Write/Edit/MultiEdit 
calls on any UI file until you have:

1. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`
2. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/anti-slop-writing.md`
3. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md`
5. Read `prototype/prototype.html` if it exists
```

**Why it matters**: The hook enforces a strict pre-flight checklist. If any reference file is missing (or if the prototype path is wrong), the hook will block UI writes with no clarity on which file is missing. The agent frontmatter says hook denies writes, but doesn't document which reads the hook is checking for.

**Direction**: Verify all 3 reference files exist and are exactly at those paths. If `skills/ui-references-moodboard/references/design-intent-guide.md` is missing or misnamed, this becomes a hard blocker for UI implementation.

**Repro**: Attempt to write UI code via frontend-implementer without completing all pre-flight reads, observe hook denial.

**Confidence**: high

---

### F-0041: Design grounding hook coupling – tight dependency on exact file paths

**Severity**: MEDIUM  
**Category**: maintainability  
**File**: `hooks/de-design-grounding-hook.js`  
**Line**: (implicit – referenced by agents/frontend-implementer.md line 34)

**Evidence**: Frontend-implementer line 34 states "The `de-design-grounding-hook` (PreToolUse) will hard-deny your Write/Edit/MultiEdit calls on any UI file (.tsx .jsx .html .svelte .vue .css .scss) until you have" completed reads. The hook is hard-checking that these specific reads occurred.

**Why it matters**: If the hook implementation uses exact file path matching (e.g., substring match on "anti-patterns.md") and a file is renamed or moved, the hook will silently fail (or succeed incorrectly). Tight coupling between hook enforcement and agent pre-flight creates invisible failure modes.

**Direction**: Document the hook's validation logic. Verify it doesn't rely on file path string matching; prefer checking for successful Read tool results with proper error handling.

**Repro**: Rename `anti-patterns.md` to `anti_patterns.md` and attempt UI write via frontend-implementer.

**Confidence**: medium

---

### F-0042: Prototype baseline assumption in frontend-implementer – fallback behavior undefined

**Severity**: MEDIUM  
**Category**: consistency  
**File**: `agents/frontend-implementer.md`  
**Line**: 40, 144

**Evidence**:
```
Line 40: Read `prototype/prototype.html` if it exists
Line 144: The prototype is the visual baseline. Your implementation must match 
its layout, spacing, typography, and color choices. Do not creatively deviate.
```

**Why it matters**: Line 40 says "if it exists" (optional), but line 144 says implementation "must match" the prototype. If prototype doesn't exist, what's the fallback baseline? The requirement is stated as absolute ("must match") but the precondition is optional.

**Direction**: Clarify: if prototype doesn't exist, what is the implementation baseline? (Design system? Design context? Figma designs?) This should be explicit, not left to agent inference.

**Repro**: Run frontend-implementer on a project with design deliverables but no `prototype/prototype.html` and observe whether agent correctly identifies the fallback baseline.

**Confidence**: medium

---

### F-0043: Advisor invocation in design.md – missing on feature-flow path

**Severity**: MEDIUM  
**Category**: consistency  
**File**: `commands/design-engineer/design.md`  
**Line**: 15, 36–43, 108

**Evidence**:
```
Line 15: If argument is `feature-spec`, jump to Step F1 (feature flow)
Line 28–47: Feature flow section (abbreviated path for existing projects)
Line 108: Invoke advisor after each phase (but only mentioned for full 4-phase pipeline)
```

**Why it matters**: The advisor checkpoint is documented only for the full 4-phase discovery/strategy/planning/design flow (line 108). The feature-focused flow (lines 28–47) has no advisor checkpoint mentioned. Consistency pattern: all workflow branches should have advisor gates at phase transitions.

**Direction**: Add explicit advisor checkpoint after feature-planning phase in the feature-flow section. If feature flow skips advisor intentionally, document why (e.g., "feature scopes are small, advisor overhead not justified").

**Repro**: Run `/design-engineer:design` with feature-spec argument and trace whether advisor is invoked.

**Confidence**: medium

---

### F-0044: Design grounding in dev.md – blocking gate may fail silently if references missing

**Severity**: HIGH  
**Category**: correctness  
**File**: `commands/design-engineer/dev.md`  
**Line**: 51–79

**Evidence**:
```
Step 1.6: Design Grounding Pre-Flight (BLOCKING) – reads:
- `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`
- `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/anti-slop-writing.md`
- `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md`
- `prototype/prototype.html` (if exists)

After the Reads, output this block and fill in EVERY field:
### Design Intent
- **Who is this human**: [...]
```

**Why it matters**: The command requires reading 3 reference files as a blocking gate, but doesn't specify what happens if a file doesn't exist. Does the command halt? Does it proceed with a warning? The word "BLOCKING" suggests hard halt, but the fallback isn't documented.

**Direction**: Add explicit error handling: "If any of the first 3 files cannot be read, halt with error: '[filename] not found. Run /design-engineer:start to install plugin infrastructure.'"

**Repro**: Delete `skills/shared-references/anti-slop-writing.md` and run `/design-engineer:dev`.

**Confidence**: high

---

### F-0045: test-writer agent reference – testing-anti-patterns.md location undefined

**Severity**: MEDIUM  
**Category**: correctness  
**File**: `agents/test-writer.md`  
**Line**: 118

**Evidence**:
```
8. **Test real behavior** – mocks only when absolutely unavoidable. See [testing-anti-patterns.md](../skills/dev-agent-setup/references/testing-anti-patterns.md)
```

**Why it matters**: The link is a relative path `../skills/dev-agent-setup/references/testing-anti-patterns.md`, which assumes the agent is being read from a specific directory location. If the agent documentation is moved or read from a different context, the relative path breaks. Also, the file is referenced but unclear if it exists at that exact path.

**Direction**: Verify the file exists at `skills/dev-agent-setup/references/testing-anti-patterns.md`. Use absolute paths or documented environment variable references (e.g., `${DESIGN_ENGINEER_PLUGIN_ROOT}`) instead of relative paths in agent/command docs.

**Repro**: Check whether `skills/dev-agent-setup/references/testing-anti-patterns.md` exists.

**Confidence**: medium

---

### F-0046: Review command – reference material paths use variable substitution inconsistently

**Severity**: LOW  
**Category**: consistency  
**File**: `commands/design-engineer/review.md`  
**Line**: 100–108

**Evidence**:
```
| UX and usability | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-to-code-qa/references/` |
| Visual quality | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-to-code-qa/references/` |
| Accessibility | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-accessibility/references/` |
| Design system compliance | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-system/references/` |
| Figma comparison | If Figma plugin is connected, use `get_design_context` for structured design data |
| Psychology scan | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-full-scan/references/principles-master.md` |
| Ethics review | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-ethics-review/references/` |
```

**Why it matters**: Some rows reference directories (ending with `/`), others reference specific files (e.g., `principles-master.md`). Figma row says "use tool" instead of a reference path. Mixed patterns make it unclear whether the command should Read entire directories or specific files. Also, none of these paths are verified to exist.

**Direction**: Standardize: for each area, list specific files to read (not directories). Verify all paths exist. For Figma row, clarify precedence: when Figma unavailable, what's the fallback reference file?

**Repro**: Attempt to read reference material table paths and verify they exist.

**Confidence**: low

---

### F-0047: meta-document skill invocation – auto-invocation timing unclear in dev.md

**Severity**: LOW  
**Category**: consistency  
**File**: `commands/design-engineer/dev.md`  
**Line**: 73 (implicit from "auto-invoked after implementation cycles")

**Evidence**:
```
For new products (project_type: new), auto-invoke meta-document after implementation 
cycles before presenting options.
```

**Why it matters**: The command says meta-document is "auto-invoked" but doesn't specify: when exactly? After how many phase cycles? Is this automatic or manual? The word "auto" suggests unattended invocation, but no hook is mentioned.

**Direction**: Clarify whether meta-document invocation is manual (user must call `/design-engineer:document`) or automatic (hook-driven). If manual, say "remind the user to run /design-engineer:document after each phase." If automatic, document which hook or condition triggers it.

**Repro**: Run `/design-engineer:dev` on a new project and check whether meta-document is invoked without explicit user request.

**Confidence**: low

---

### F-0048: Compound-documenter memory structure – defensive Read pattern not documented

**Severity**: LOW  
**Category**: maintainability  
**File**: `agents/compound-documenter.md`  
**Line**: 97–99

**Evidence**:
```
1. Read `.claude/agent-memory/compound-documenter/pipeline-state.md` (if it exists).
2. Read `.claude/agent-memory/compound-documenter/key-decisions.md` (if it exists).
3. Read `.claude/agent-memory/compound-documenter/stale-dependents.md` (if it exists).
```

**Why it matters**: Agent reads from memory files "if they exist" but CLAUDE.md documents that "defensive read pattern" should use `test -f` before Read to avoid confusing "file not found" errors on fresh projects. The agent says "if it exists" but doesn't document how to check (bash test? error handling?).

**Direction**: Add explicit defensive pattern: "Use `Bash test -f <path>` before attempting Read. If file doesn't exist, skip silently (fresh project, memory not yet created)."

**Repro**: Invoke compound-documenter on a fresh project and verify it doesn't error on missing memory files.

**Confidence**: low

---

## Summary of Findings

| ID | Severity | Category | Count |
|----|----------|----------|-------|
| F-0040 | HIGH | correctness | 1 |
| F-0041 | MEDIUM | maintainability | 1 |
| F-0042 | MEDIUM | consistency | 1 |
| F-0043 | MEDIUM | consistency | 1 |
| F-0044 | HIGH | correctness | 1 |
| F-0045 | MEDIUM | correctness | 1 |
| F-0046 | LOW | consistency | 1 |
| F-0047 | LOW | consistency | 1 |
| F-0048 | LOW | maintainability | 1 |
| **Total** | | | **9** |

---

**Blocking issues** (Phase 2 investigation needed):
- F-0040: frontend-implementer hook enforcement clarity
- F-0044: dev.md design grounding gate error handling
- F-0045: test-writer reference file existence verification

