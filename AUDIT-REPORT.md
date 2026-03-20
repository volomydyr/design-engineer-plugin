# Design-Engineer Plugin — Full Audit Report

**Plugin version:** 1.10.1 (commit af2ba05)
**Audit date:** 2026-03-18
**Scope:** Every file in the plugin + all desktop source materials
**Purpose:** Understand, verify correctness, identify simplification opportunities

---

## Table of Contents

1. [Plugin Inventory](#1-plugin-inventory)
2. [User Flow Map](#2-user-flow-map)
3. [Issues Found](#3-issues-found)
4. [Simplification Proposals](#4-simplification-proposals)
5. [Source Alignment Report](#5-source-alignment-report)

---

## 1. Plugin Inventory

| Category | Count | Details |
|----------|-------|---------|
| Commands | 9 | setup, design, research, psych, prototype, dev, review, compound, statusline |
| Agents | 9 | backend-implementer, compound-documenter, context-analyzer, deliverable-writer, design-system-auditor, frontend-implementer, psych-scanner, test-writer, ux-researcher |
| Skills | 50 | 7 dev, 4 meta, 14 psych, 7 ui, 18 ux |
| Reference files | 96 | Spread across all skill directories |
| Hooks | 8 | 2 PreToolUse, 4 PostToolUse (incl. Haiku prompt), 1 Stop, 1 StatusLine |
| Model split | 36 opus / 14 sonnet (skills) | 6 opus / 3 sonnet (agents) |

---

## 2. User Flow Map

### 2.1 Entry Points Overview

```
User installs plugin
    │
    ▼
/de:setup ──────────────── MANDATORY FIRST (creates design-engineer.local.md)
    │
    ├── /de:design ─────── Full pipeline (God/Guided mode, 4 phases)
    ├── /de:research ───── UX research only (subset of Phase 1-2)
    ├── /de:psych ──────── Psychology audit (13 sections)
    ├── /de:prototype ──── HTML prototype generation
    ├── /de:dev ────────── Development pipeline (agents + TDD)
    ├── /de:review ─────── Multi-layer design review
    ├── /de:compound ───── Document decisions/context
    └── /de:statusline ─── Install/manage status bar
```

### 2.2 /de:design — The Main Orchestrator

This is the primary command. It runs the full product design pipeline.

```
/de:design
    │
    ▼
Mode selection ──► AskUserQuestion: God mode / Guided mode / Direct access
    │
    ▼
Project status check ──► Continue / Start fresh / Jump to phase
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Phase 1: DISCOVERY                                              │
│                                                                 │
│   ux-big-idea ──► ux-problem-statement ──► ux-target-audience   │
│   ──► ux-assumptions ──► ux-competitor-analysis                 │
│   ──► ux-user-interviews                                        │
│                                                                 │
│   Agent: ux-researcher (for competitor analysis, interviews)    │
│   Agent: deliverable-writer (formats each output)               │
│   Agent: compound-documenter (records decisions)                │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Phase 2: STRATEGY                                               │
│                                                                 │
│   ux-storybrand ──► ux-business-plan                            │
│   ──► [parallel] ux-story-panels + ux-behavior-mapping           │
│   ──► ux-motivation-levels                                       │
│                                                                 │
│   Agent: deliverable-writer                                     │
│   Agent: compound-documenter                                    │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Phase 3: PLANNING                                               │
│                                                                 │
│   ux-mvp-requirements ──► ux-information-architecture           │
│                                                                 │
│   Agent: deliverable-writer                                     │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Phase 4: DESIGN & VALIDATION                                    │
│                                                                 │
│   [parallel] ux-bias-audit + ux-journey-mapping                  │
│   ──► ux-ethics-review (optional)                               │
│   ──► ui-design-references ──► dev-prototyping                  │
│   ──► ui-figma-workflow ──► ui-figma-handoff (optional)         │
│   ──► ux-product-assessment (optional)                          │
│                                                                 │
│   Agent: psych-scanner (during bias/journey work)               │
│   Agent: deliverable-writer                                     │
│   Agent: compound-documenter                                    │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼
CHECKPOINT ──► AskUserQuestion:
    1. Proceed to /de:dev
    2. Run /de:review
    3. Run /de:psych audit
    4. Document with /de:compound
```

### 2.3 /de:research — UX Research Subset

```
/de:research [argument]
    │
    ▼
Activity selection ──► AskUserQuestion (9 options):
    1. ux-big-idea
    2. ux-problem-statement
    3. ux-target-audience
    4. ux-assumptions
    5. ux-competitor-analysis
    6. ux-user-interviews
    7. ux-business-plan
    8. ux-storybrand
    9. Full pipeline (all above in sequence)
    │
    ▼
After each activity ──► "Want to run another?"
    │
    ▼
Agent: ux-researcher, deliverable-writer, compound-documenter
```

### 2.4 /de:psych — Psychology Audit

```
/de:psych [argument]
    │
    ▼
Approach selection ──► AskUserQuestion:
    1. Master audit (broad scan → targeted deep-dives)
    2. Section deep-dive (pick 1 of 13 sections)
    3. God mode (full autonomous audit)
    │
    ▼
psych-master-audit ──► scans all 100 principles
    │
    ▼
Routes to section skills based on findings:
    psych-cognitive-basics (laws 1-10)
    psych-visual-perception (laws 11-20)
    psych-decision-making-core (laws 21-25)
    psych-decision-making-advanced (laws 26-30)
    psych-engagement-motivation (laws 31-40)
    psych-emotional-design-core (laws 41-45)
    psych-emotional-design-advanced (laws 46-50)
    psych-efficiency (laws 51-60)
    psych-behavioral-economics-core (laws 61-65)
    psych-behavioral-economics-habits (laws 66-70)
    psych-social-influence (laws 71-80)
    psych-cognitive-biases (laws 81-90)
    psych-time-behavior (laws 91-100)
    │
    ▼
Agent: psych-scanner (broad scan), deliverable-writer (report)
```

### 2.5 /de:prototype — HTML Prototype

```
/de:prototype [new | feature | redesign]
    │
    ▼
Load dev-prototyping skill (7-step flow)
    │
    ▼
Pre-generate: test-writer agent creates tests (TDD Red phase)
    │
    ▼
Generate prototype (single-file HTML)
    │
    ▼
Post-generate: /simplify reviews code
    │
    ▼
Verify: tests pass (TDD Green phase)
```

### 2.6 /de:dev — Development Pipeline

```
/de:dev [argument]
    │
    ▼
Activity selection ──► AskUserQuestion (8 options):
    1. Full development setup
    2. CLAUDE.md setup (dev-claude-md)
    3. Agent pipeline setup (dev-agent-pipeline)
    4. Context management (dev-context-management)
    5. GitHub workflow (dev-github-workflow)
    6. MCP configuration (dev-mcp-setup)
    7. Kick-start prompts (dev-kickstart-prompts)
    8. Run development pipeline
    │
    ▼ (option 8: full pipeline)
context-analyzer agent ──► Plan Mode ──► test-writer agent (Red)
    ──► backend-implementer agent ──► /simplify
    ──► frontend-implementer agent ──► /simplify
    ──► design-system-auditor agent
    ──► compound-documenter agent
```

### 2.7 /de:review — Multi-Layer Review

```
/de:review [argument]
    │
    ▼
Review type ──► AskUserQuestion (7 options):
    1. Figma designs → ui-design-critique + ui-accessibility + psych-scanner
    2. Live implementation → ui-visual-review + ui-design-critique
    3. Codebase → ui-design-system + design-system-auditor
    4. Accessibility → ui-accessibility
    5. Psychology scan → psych-master-audit → section skills
    6. Ethics review → ux-ethics-review
    7. Full product assessment → ux-product-assessment
    │
    ▼
Post-review ──► AskUserQuestion:
    1. Address findings
    2. Share with stakeholders (ux-communicating-decisions)
    3. Document (compound-documenter)
    4. Run another review
```

### 2.8 /de:compound — Knowledge Documentation

```
/de:compound [status]
    │
    ▼
Load meta-compound skill
    │
    ▼
Action selection ──► AskUserQuestion:
    1. Record current progress
    2. Document a decision
    3. Record a learning
    4. Update project status
    5. Refresh context from existing files
    │
    ▼
Agent: compound-documenter
```

### 2.9 /de:setup — One-Time Configuration

```
/de:setup
    │
    ▼
meta-setup skill
    │
    ▼
Environment detection (plugins: Context7, Figma, Playwright, Figma Console)
    │
    ▼
7 configuration questions via AskUserQuestion:
    - Project state (new / existing without docs / existing with docs)
    - Working mode (God vs Guided)
    - Team size
    - Deliverables path
    - Tool preferences
    - Dev stack
    - Prior research
    │
    ▼
Scaffold folders + create design-engineer.local.md
```

### 2.10 /de:statusline — Utility

```
/de:statusline [install | uninstall | status]
    │
    ▼
meta-statusline skill ──► copy script + configure settings.json
```

### 2.11 Hook Enforcement Points

```
┌─ PreToolUse ─────────────────────────────────────────────────┐
│                                                               │
│  Bash commands → de-safety-hook.js                            │
│    Blocks: rm -rf, git push --force, DROP TABLE, etc.         │
│                                                               │
│  Write/Edit → de-tdd-hook.js                                  │
│    Blocks source writes when no tests exist in tests/         │
│    (only during active implementation with plans/)            │
│                                                               │
└───────────────────────────────────────────────────────────────┘

┌─ PostToolUse ────────────────────────────────────────────────┐
│                                                               │
│  Write/Edit → check_deliverable_deps.py                       │
│    Notifies of downstream dependents when docs/ changes       │
│                                                               │
│  Write/Edit → de-fidelity-hook.js                             │
│    Injects fidelity reminder after source code writes          │
│                                                               │
│  Write/Edit → Haiku prompt hook                               │
│    Reviews plan files for requirement drift                    │
│                                                               │
│  Read/WebFetch/Bash/Grep → de-prompt-injection-hook.js        │
│    Warns about prompt injection in tool outputs                │
│                                                               │
└───────────────────────────────────────────────────────────────┘

┌─ Stop ───────────────────────────────────────────────────────┐
│                                                               │
│  session_dep_summary.py                                       │
│    Writes resume state to .design-engineer.yaml               │
│    Lists stale dependents                                     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 2.12 Skill Reachability Matrix

| Skill | Reached via |
|-------|-------------|
| **meta-setup** | /de:setup |
| **meta-orchestrator** | /de:design |
| **meta-compound** | /de:compound, auto after phases |
| **meta-statusline** | /de:statusline |
| **ux-big-idea** | /de:design (P1), /de:research |
| **ux-problem-statement** | /de:design (P1), /de:research |
| **ux-target-audience** | /de:design (P1), /de:research |
| **ux-assumptions** | /de:design (P1), /de:research |
| **ux-competitor-analysis** | /de:design (P1), /de:research |
| **ux-user-interviews** | /de:design (P1), /de:research |
| **ux-storybrand** | /de:design (P2), /de:research |
| **ux-business-plan** | /de:design (P2), /de:research |
| **ux-story-panels** | /de:design (P2) |
| **ux-behavior-mapping** | /de:design (P2) |
| **ux-motivation-levels** | /de:design (P2) |
| **ux-mvp-requirements** | /de:design (P3) |
| **ux-information-architecture** | /de:design (P3) |
| **ux-bias-audit** | /de:design (P4) |
| **ux-journey-mapping** | /de:design (P4) |
| **ux-ethics-review** | /de:design (P4 opt), /de:review |
| **ux-product-assessment** | /de:design (P4 opt), /de:review |
| **ux-communicating-decisions** | /de:review (post-review option) |
| **ui-design-references** | /de:design (P4) |
| **ui-design-critique** | /de:review |
| **ui-design-system** | /de:review (codebase), /de:design (P5 via orchestrator) |
| **ui-figma-workflow** | /de:design (P4) |
| **ui-figma-handoff** | /de:design (P4 opt, via orchestrator + figma-workflow cross-ref) |
| **ui-visual-review** | /de:review |
| **ui-accessibility** | /de:review |
| **dev-agent-pipeline** | /de:dev |
| **dev-claude-md** | /de:dev |
| **dev-context-management** | /de:dev |
| **dev-github-workflow** | /de:dev |
| **dev-kickstart-prompts** | /de:dev |
| **dev-mcp-setup** | /de:dev |
| **dev-prototyping** | /de:prototype, /de:design (P4) |
| **psych-master-audit** | /de:psych, /de:review (psych option) |
| **psych-* (13 section skills)** | /de:psych (via master-audit routing) |

**All 50 skills are reachable.** No dead code.

---

## 3. Issues Found

### 3.1 Critical Issues

#### C1: Root README.md is stale

**File:** `/design-engineer-plugin/README.md` (line 14)
**Problem:** Says "9 agents, 7 commands, 48 skills" — should be "9 agents, 9 commands, 50 skills"
**Impact:** First thing a user sees on GitHub. Wrong counts undermine credibility.
**Fix:** Update line 14.

#### C2: Model count mismatch in plugin README

**File:** `plugins/design-engineer/README.md`
**Problem:** Claims "Opus (42 components), Sonnet (17 components)" but actual counts are 36 opus + 14 sonnet = 50 skills (plus agents: 6 opus + 3 sonnet). The total 42+17=59 doesn't match 50 skills.
**Impact:** Contradicts the real model allocation.
**Fix:** Update to actual counts: "36 Opus skills, 14 Sonnet skills; 6 Opus agents, 3 Sonnet agents."

#### C3: Stale evals reference removed components

**File:** `plugins/design-engineer/evals/evals.json`
**Problem:** Still references `dev-claude-projects` (removed in v1.2.0) and expects `plan-creator` agent behavior (removed in v1.6.0) in expected outputs.
**Impact:** Running evals would produce false negatives — tests expecting behavior from components that no longer exist.
**Fix:** Update eval definitions to reference current skill/agent names.

---

### 3.2 Moderate Issues

#### M1: CLAUDE.md directory listing doesn't include all hooks

**File:** `plugins/design-engineer/CLAUDE.md` (Directory Structure section)
**Problem:** Lists 6 hook files but the actual hooks/ directory contains 8 files (missing `de-fidelity-hook.js` and `de-prompt-injection-hook.js`).
**Fix:** Add missing hooks to the directory tree.

#### M2: Agent templates create dual maintenance burden

**Location:** `skills/dev-agent-pipeline/references/agent-templates/` (5 files)
**Problem:** Contains simplified templates for 5 of 9 agents (context-analyzer, backend-implementer, frontend-implementer, design-system-auditor, test-writer). These are parameterized starter templates for user projects, NOT copies of plugin agents. However:
- They can drift from actual agents as the plugin evolves
- Only 5 of 9 agents have templates (missing compound-documenter, deliverable-writer, psych-scanner, ux-researcher)
- The intended use (as user project starter templates) is not documented in the skill that contains them
**Impact:** Confusing for maintainers. Templates may become outdated silently.
**Fix:** Either complete the set (all 9) with a clear README, or remove them and let users copy actual agents directly.

#### M3: `ux-communicating-decisions` is barely reachable

**Reached via:** `/de:review` → complete a review → post-review option 2 ("Share with stakeholders")
**Problem:** This is the hardest skill to reach in the entire plugin — it requires completing a full review, then choosing a specific post-review option. It's never a primary entry point and isn't listed in any command's initial menu.
**Impact:** Content about communicating design decisions is essentially buried. Users who specifically need stakeholder communication guidance have no direct path to it.
**Fix:** Consider adding it as option in `/de:research` or making it reachable via `/de:compound`.

#### M4: `/de:psych` section numbering (1-13) vs skill naming inconsistency

**Problem:** The `/de:psych` command presents 13 sections numbered 1-13 to the user. But the skill names use descriptive suffixes (psych-cognitive-basics, psych-decision-making-core, etc.) not numbers. A user selecting "Section 3: Decision Making Core" then sees a skill called `psych-decision-making-core`. The mapping works but isn't obvious.
**Impact:** Minor confusion. No functional issue.

#### M5: Hooks directory not listed in CLAUDE.md structure completely

**File:** `plugins/design-engineer/CLAUDE.md`
**Problem:** The Directory Structure block shows `de-tdd-hook.js` but not `de-fidelity-hook.js` or `de-prompt-injection-hook.js` (added in v1.10.0-1.10.1).
**Fix:** Update directory listing.

---

### 3.3 Minor Issues

#### m1: CHANGELOG dates — multiple versions share same date

**Observation:** Versions 1.9.0 through 1.10.1 all dated 2026-03-18. Versions 1.5.0-1.6.1 all dated 2026-03-12.
**Impact:** Not technically wrong (rapid iteration days), but looks unusual. No action needed unless the dates are incorrect.

#### m2: `/de:design` Phase 4 includes `ui-design-system` only through orchestrator

The `ui-design-system` skill appears in the orchestrator's Phase 5 (Development) but is also reachable via `/de:review` option 3 (Codebase audit). This dual-path is fine but the skill's placement in the pipeline could confuse — it's a design skill listed under development.

#### m3: Some reference files have overlapping content domains

Examples:
- `ui-design-critique/references/typography.md` overlaps with content principles in `ux-writing.md`
- `psych-engagement-motivation/references/section-4-case-studies.md` contains journey-like analysis that overlaps with `ux-journey-mapping/references/journey-case-study.md`
- `ui-design-critique/references/interaction-design.md` contains accessibility guidance that partially overlaps `ui-accessibility/references/accessibility-checklist.md`

**Impact:** Minimal — reference files are loaded per-skill, so overlap doesn't cause confusion during use. It's only a maintenance consideration.

#### m4: `meta-orchestrator` references Phase 5 but `/de:design` only has 4 phases

The orchestrator skill internally tracks Phase 5 (Development) as the continuation after `/de:design`'s 4 design phases end. This is the `/de:dev` pipeline. The naming is consistent within the orchestrator but users see "4 phases" in the command description and "Phase 5" in the orchestrator — minor cognitive dissonance.

#### m5: Hook timeout values are inconsistent

- Python hooks: 10s
- JS hooks: 5s
- Haiku prompt hook: 30s

This is probably intentional (different workloads) but not documented why.

---

## 4. Simplification Proposals

### Proposal S1: Reduce commands from 9 to 6

**Current state:** 9 commands overwhelm new users. Three commands are redundant or utility-level.

**Proposed changes:**

| Current | Action | Rationale |
|---------|--------|-----------|
| `/de:setup` | **Keep** | Mandatory entry point |
| `/de:design` | **Keep** | Main orchestrator |
| `/de:research` | **Remove** → fold into `/de:design` | It's already a subset of Phase 1-2. Users can run `/de:design` and jump to specific research activities. |
| `/de:psych` | **Keep** | Distinct enough — standalone psychology audit |
| `/de:prototype` | **Keep** | Distinct — quick HTML prototyping |
| `/de:dev` | **Keep** | Distinct — development pipeline |
| `/de:review` | **Keep** → absorb psych option naturally | Already has "Psychology scan" as option 5 |
| `/de:compound` | **Rename** → `/de:document` | "Compound" is internal jargon. "Document" is self-explanatory. |
| `/de:statusline` | **Remove** → fold into `/de:setup` | Utility command. Install during setup, manage via setup reconfiguration. |

**Result:** 6 commands: `setup`, `design`, `psych`, `prototype`, `dev`, `document`

**Cost:** Users who want standalone research without the full design pipeline lose a shortcut. Mitigated by `/de:design` supporting direct skill access and phase jumping.

**Alternative (less aggressive):** Keep `/de:research` but still rename `compound` → `document` and remove `statusline`. Result: 7 commands.

---

### Proposal S2: Rename confusing skills

| Current name | Proposed name | Why |
|-------------|---------------|-----|
| `ui-design-critique` | `ui-craft-review` | Distinguishes from `ui-visual-review`. "Craft" signals this is about design quality, not bug-catching. |
| `ui-visual-review` | `ui-implementation-review` | Clarifies this is about implementation fidelity (AI-generated issues, token compliance), not visual design. |
| `ux-psych-framework` | `ux-motivation-levels` | The skill is specifically about Motivation Levels and Experience Value. "Framework" is too generic. |
| `meta-compound` | `meta-document` | Matches the renamed command. |
| `ux-bias-framework` | `ux-bias-audit` | More action-oriented. The bias audit process is the methodology, and the skill performs an audit. |

**Cost:** Cross-references in other skills/commands need updating. One-time migration.

---

### Proposal S3: Consolidate `/de:psych` into `/de:review`

**Current state:** Two commands offer psychology review:
- `/de:psych` — dedicated psychology audit with 13 sections
- `/de:review` option 5 — "Psychology scan" that loads psych-master-audit

**Proposed:** Merge `/de:psych` into `/de:review` as an expanded psychology option. When user selects "Psychology" in review, present the same 3 approaches (master audit, section deep-dive, god mode).

**Result:** 5 commands: `setup`, `design`, `prototype`, `dev`, `review` (+ `document`)

**Cost:** Loses the dedicated `/de:psych` entry point. Users who frequently run psych audits have one more click. The psychology engine (14 skills) remains intact.

**Recommendation:** Only pursue this if S1 is accepted. If the goal is minimal commands, this gets to 5. If 6 is acceptable, keep `/de:psych` standalone.

---

### Proposal S4: Complete or remove agent templates

**Current:** 5 agent templates in `dev-agent-pipeline/references/agent-templates/`. Missing 4.

**Option A (Complete):** Add templates for the missing 4 agents (compound-documenter, deliverable-writer, psych-scanner, ux-researcher). Add a README explaining these are user project starter templates.

**Option B (Remove):** Delete the templates directory. The `dev-agent-pipeline` skill can instruct users to copy agents from the plugin's `agents/` directory and customize. Simpler, no drift risk.

**Recommendation:** Option B. The actual agents ARE the templates. Maintaining a second simplified version is overhead with drift risk.

---

### Proposal S5: Update stale evals

**Fix:** Update `evals/evals.json` to replace:
- `dev-claude-projects` references → `dev-context-management`
- `plan-creator` agent expectations → Plan Mode behavior
- Verify all skill names in eval definitions match current skill inventory

**Cost:** Time to review and update eval definitions. No functional loss.

---

### Proposal S6: Fix documentation discrepancies

Quick fixes (can all be done in one commit):

1. Root `README.md` line 14 → "9 agents, 9 commands, 50 skills"
2. Plugin `README.md` model counts → actual 36/14 split
3. `CLAUDE.md` directory structure → add missing hook files
4. `plugin.json` description → verify counts match

---

### Proposal S7: Promote `ux-communicating-decisions`

**Problem:** Valuable skill buried behind a post-review option.

**Option A:** Add as option 9 in `/de:research`: "Communicating Design Decisions — prepare findings for stakeholder presentation"

**Option B:** Make it a step in the `/de:document` (renamed compound) flow: "Document a decision → optionally prepare stakeholder communication"

**Option C:** No change — it's an advanced skill for a niche use case.

**Recommendation:** Option B — it fits naturally with decision documentation.

---

## 5. Source Alignment Report

### 5.1 Article 1 (UX Workflow) → Plugin Phase 1-3

| Article Concept | Plugin Skill | Alignment |
|----------------|-------------|-----------|
| Big Idea Definition | ux-big-idea | ✅ Aligned |
| Problem Statement | ux-problem-statement | ✅ Aligned |
| Target Audience / Personas | ux-target-audience | ✅ Aligned |
| Assumptions & Hypotheses | ux-assumptions | ✅ Aligned |
| Competitive Analysis | ux-competitor-analysis | ✅ Aligned |
| User Interviews | ux-user-interviews | ✅ Aligned |
| StoryBrand | ux-storybrand | ✅ Aligned |
| Business Plan | ux-business-plan | ✅ Aligned |
| Information Architecture | ux-information-architecture | ✅ Aligned |
| MVP Requirements (ICE model) | ux-mvp-requirements | ✅ Aligned |

**Phase ordering note:** Article presents IA (Phase 4) before MVP (Phase 5). Plugin reverses this: MVP before IA in Phase 3. This is a deliberate reorganization — defining scope (MVP) before structure (IA) makes sense. Not a misalignment.

**Missing from article, added in plugin:** ux-story-panels, ux-behavior-mapping, ux-motivation-levels, ux-bias-audit, ux-journey-mapping, ux-ethics-review, ux-product-assessment. These come from UX strategy methodology, not the articles. This is correct — the plugin integrates both sources.

### 5.2 Article 2 (Dev Workflow) → Plugin Phase 5

| Article Concept | Plugin Skill/Agent | Alignment |
|----------------|-------------------|-----------|
| CLAUDE.md global rules | dev-claude-md | ✅ Aligned |
| Context Analyzer agent | context-analyzer agent | ✅ Aligned |
| Backend Implementer agent | backend-implementer agent | ✅ Aligned |
| Frontend Implementer agent | frontend-implementer agent | ✅ Aligned |
| Design System Auditor agent | design-system-auditor agent | ✅ Aligned |
| Claude Projects for context | dev-context-management | ✅ Adapted (tool-agnostic now) |
| AI Prototyping | dev-prototyping | ✅ Aligned |
| Kickstart Prompts | dev-kickstart-prompts | ✅ Aligned |
| MCP Server setup | dev-mcp-setup | ✅ Aligned |
| GitHub workflow | dev-github-workflow | ✅ Aligned |

**Added beyond articles:** test-writer agent, TDD enforcement hook, /simplify integration, requirement fidelity hooks, prompt injection defense, session resume state. All documented as post-v1.0.0 adjustments.

### 5.3 UX Strategy Methodology → UX Skills

| Methodology Module | Plugin Skill | Alignment |
|-------------------|-------------|-----------|
| Behavior Map Framework | ux-behavior-mapping | ✅ Aligned — critical sequence enforced |
| Bias Audit | ux-bias-audit | ✅ Aligned |
| Story Panels | ux-story-panels | ✅ Aligned — critical sequence enforced |
| Motivation Framework (Experience Value, Motivation Levels) | ux-motivation-levels | ✅ Aligned — critical sequence enforced |
| Journey Mapping | ux-journey-mapping | ✅ Aligned |
| Ethics (Regret/Black Mirror tests) | ux-ethics-review | ✅ Aligned |
| Product Assessment | ux-product-assessment | ✅ Aligned |
| Communicating Decisions | ux-communicating-decisions | ⚠️ Created but barely accessible (see M3) |

### 5.4 Psychology Book (100 Laws) → Psych Skills

| Book Section | Plugin Skill | Laws | Alignment |
|-------------|-------------|------|-----------|
| Cognitive Basics | psych-cognitive-basics | 1-10 | ✅ Aligned |
| Visual Perception | psych-visual-perception | 11-20 | ✅ Aligned |
| Decision Making Core | psych-decision-making-core | 21-25 | ✅ Aligned |
| Decision Making Advanced | psych-decision-making-advanced | 26-30 | ✅ Aligned |
| Engagement & Motivation | psych-engagement-motivation | 31-40 | ✅ Aligned |
| Emotional Design Core | psych-emotional-design-core | 41-45 | ✅ Aligned |
| Emotional Design Advanced | psych-emotional-design-advanced | 46-50 | ✅ Aligned |
| Efficiency | psych-efficiency | 51-60 | ✅ Aligned |
| Behavioral Economics Core | psych-behavioral-economics-core | 61-65 | ✅ Aligned |
| Behavioral Economics Habits | psych-behavioral-economics-habits | 66-70 | ✅ Aligned |
| Social Influence | psych-social-influence | 71-80 | ✅ Aligned |
| Cognitive Biases | psych-cognitive-biases | 81-90 | ✅ Aligned |
| Time & Behavior | psych-time-behavior | 91-100 | ✅ Aligned |

All 100 laws are covered across 13 section skills with full reference files (principles + case studies for key sections).

### 5.5 QA Context (59 Decisions) Compliance

| Decision | Status |
|----------|--------|
| User > Docs > AI hierarchy | ✅ Enforced in every skill |
| Teach while working (guide thinking) | ✅ Skills guide process, not just output |
| One activity = one skill | ✅ All 50 skills are single-activity |
| Opinionated with real context | ✅ All content from source materials |
| English only | ✅ No Ukrainian names found in active files |
| AskUserQuestion with numbered-list fallback | ✅ Consistent across all skills |
| Reference files = full adapted content | ✅ 96 reference files with full content |
| Sources merged silently | ✅ No "from the book" attributions |
| Tool-agnostic with recommendations | ✅ Adapted in v1.2.0/v1.5.1 |
| disable-model-invocation: true on all skills | ✅ All 50 skills have it |

### 5.6 Features Added Beyond Source Materials

These features were added during adjustments #1-12 and don't trace back to the original articles, book, or course:

| Feature | Added in | Source | Assessment |
|---------|----------|--------|------------|
| GSD patterns (session resume, parallel waves, context monitoring) | v1.1.1 | GSD patterns paper | ✅ Belongs — operational excellence |
| ui-design-critique (4-lens framework) | v1.1.0 | Original creation + impeccable.design | ✅ Belongs — fills a gap in source materials |
| ui-figma-handoff | v1.3.0 | Original creation | ✅ Belongs — practical Figma workflow |
| Status line | v1.4.0 | Original creation | ⚠️ Borderline — useful utility but adds a command + skill + hook for something not core to design engineering |
| Safety hook | v1.5.0 | Original creation | ✅ Belongs — protective infrastructure |
| TDD with Playwright | v1.7.0 | obra/superpowers methodology | ✅ Belongs — quality enforcement |
| External knowledge references | v1.9.0-v1.9.2 | impeccable.design, jakubkrehel, emilkowalski | ✅ Belongs — enriches existing UI skills |
| Prompt injection defense | v1.10.0 | lasso-security patterns | ⚠️ Borderline — important for security but not specific to design engineering |
| Requirement fidelity hooks | v1.10.1 | Original creation | ✅ Belongs — enforces core philosophy |

---

## Summary of Recommendations

### Quick Fixes (do immediately)

1. **S6:** Fix root README counts, plugin README model counts, CLAUDE.md directory listing
2. **S5:** Update stale evals

### Simplification (discuss first)

3. **S1:** Reduce commands 9 → 6 (remove research, statusline; rename compound → document)
4. **S2:** Rename confusing skills (5 renames)
5. **S4:** Remove agent templates (or complete the set)
6. **S7:** Promote ux-communicating-decisions into the document flow

### Optional (if pursuing aggressive simplification)

7. **S3:** Merge /de:psych into /de:review (9 → 5 commands)

### Not Recommended

- Merging or removing any skills — all 50 serve distinct purposes
- Removing reference files — the 96 files are well-organized by skill with minimal problematic overlap
- Removing any hooks — all serve clear purposes even if some (statusline, prompt injection) are peripheral to design engineering
- Changing the 4-phase pipeline structure — it's well-organized and aligns with source materials

---

*This report is for discussion only. No changes have been made to any plugin files.*
