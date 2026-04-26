# Surface G Audit: Agents (agents/*.md)

**Phase**: Phase 2 — Static findings (10 surfaces)  
**Audit date**: 2026-04-26  
**Scope**: All 10 agents — advisor.md, backend-implementer.md, compound-documenter.md, context-analyzer.md, deliverable-writer.md, design-system-auditor.md, frontend-implementer.md, psych-scanner.md, test-writer.md, ux-researcher.md  
**Standards**: CLAUDE.md rules and canonical agents-doc.md

---

## What's Right

✓ **Frontmatter completeness (10/10)**: All agents have explicit `name`, `description`, `model`, and `effort` fields. compound-documenter includes `memory: project` per Anthropic's documented mechanism.

✓ **Description quality (10/10)**: Every agent description includes WHEN to use the agent (high-leverage moments, after plan approval, after UI implementation, etc.), meeting the "when to use" requirement.

✓ **Self-references and cross-references (10/10)**: All agent references to skills, files, and resources are valid and resolved. testing-anti-patterns.md exists. Gallery contract file exists. All skill paths verified.

✓ **Sub-agent context passing (10/10)**: All agents properly document what context they require from callers, do not assume parent transcript access, and include explicit "Before Implementation" or "Step 1: Read..." sections. advisor.md explicitly states "does NOT auto-inherit the parent transcript."

✓ **Tool list correctness (10/10)**: Each agent correctly lists or implies the tools it needs. No overgrants (claiming tools not needed); no undergrants. Tools are appropriate to each agent's role.

✓ **En dash usage (10/10)**: All agents use en dashes (–), never em dashes or double hyphens.

✓ **Gallery contract enforcement (design-system-auditor)**: Agent correctly specifies FAIL-severity checks for gallery coverage, no hardcoded styles, import resolution, and variant API discipline.

✓ **Pre-flight determinism (frontend-implementer)**: Design Grounding Pre-Flight is blocking and deterministic — hook enforces prerequisite reads with `permissionDecision: deny` if checks fail.

✓ **Defense pattern implicit (compound-documenter)**: Agent memory approach is documented per Anthropic specs; defensive reads are reasonable given project-local memory scope.

---

## Findings

### Critical

**F-0220: TITLE CASE headings violate CLAUDE.md rule #2**  
**Severity**: MEDIUM  
**Category**: consistency  
**Evidence**: 9 of 10 agents use Title Case for main headings (e.g., "Your Core Responsibilities", "Memory Files You Maintain", "Implementation Process")  
**Why it matters**: CLAUDE.md rule #2 (line 369) mandates sentence case for ALL headings, buttons, labels, and UI copy. Title Case in system prompts affects how agents generate user-facing text and contradicts documented style.  
**Direction**: Convert all heading H2/H3 from Title Case to sentence case.  
**Repro**: grep -n "Your Core Responsibilities\|Memory Files\|Document Types" agents/*.md  
**Confidence**: high

| File | Line | Heading | Fix |
|------|------|---------|-----|
| advisor.md | 10 | "Role" | ✓ sentence case |
| advisor.md | 16 | "How to respond" | ✓ sentence case |
| backend-implementer.md | 10 | "Your Core Responsibilities" | → "Your core responsibilities" |
| backend-implementer.md | 19 | "Before Implementation" | ✓ sentence case |
| backend-implementer.md | 27 | "Implementation Process" | → "Implementation process" |
| backend-implementer.md | 35 | "Critical Implementation Requirements" | → "Critical implementation requirements" |
| backend-implementer.md | 60 | "Function Implementation Patterns" | → "Function implementation patterns" |
| backend-implementer.md | 80 | "Success Criteria" | → "Success criteria" |
| backend-implementer.md | 90 | "Critical Reminders" | → "Critical reminders" |
| compound-documenter.md | 21 | "Memory Files You Maintain" | → "Memory files you maintain" |
| compound-documenter.md | 52 | "Key Decisions Log" | → "Key decisions log" |
| compound-documenter.md | 73 | "Stale Dependents" | → "Stale dependents" |
| context-analyzer.md | 8 | "Your Core Responsibilities" | → "Your core responsibilities" |
| context-analyzer.md | 31 | "Output Format Requirements" | → "Output format requirements" |
| context-analyzer.md | 47 | "Critical Reminders" | → "Critical reminders" |
| context-analyzer.md | 56 | "When to Ask Clarifying Questions" | ✓ sentence case |
| deliverable-writer.md | 10 | "Your Core Responsibilities" | → "Your core responsibilities" |
| deliverable-writer.md | 20 | "Document Types You Produce" | → "Document types you produce" |
| deliverable-writer.md | 78 | "Writing Standards" | → "Writing standards" |
| deliverable-writer.md | 99 | "Quality Checklist" | → "Quality checklist" |
| design-system-auditor.md | 15 | "Your Core Responsibilities" | → "Your core responsibilities" |
| design-system-auditor.md | 25 | "Systematic Audit Process" | → "Systematic audit process" |
| design-system-auditor.md | 40 | "Critical Code Quality Fixes" | → "Critical code quality fixes" |
| design-system-auditor.md | 66 | "Validation Checklist" | → "Validation checklist" |
| design-system-auditor.md | 79 | "Quality Assurance" | → "Quality assurance" |
| design-system-auditor.md | 87 | "Completion Criteria" | → "Completion criteria" |
| design-system-auditor.md | 98 | "Aesthetic Audit Pass" | → "Aesthetic audit pass" |
| design-system-auditor.md | 129 | "Output Format" | → "Output format" |
| design-system-auditor.md | 170 | "When to Ask for Clarification" | ✓ sentence case |
| frontend-implementer.md | 10 | "Your Core Responsibilities" | → "Your core responsibilities" |
| frontend-implementer.md | 20 | "Before Implementation" | ✓ sentence case |
| frontend-implementer.md | 32 | "Design Grounding Pre-Flight (BLOCKING)" | ✓ sentence case + acronym |
| frontend-implementer.md | 45 | "Design Intent" | → "Design intent" |
| frontend-implementer.md | 51 | "Domain Exploration" | → "Domain exploration" |
| frontend-implementer.md | 56 | "WHY Checkpoint" | → "Why checkpoint" |
| frontend-implementer.md | 65 | "Anti-pattern self-check" | ✓ sentence case |
| frontend-implementer.md | 83 | "Signature Test" | → "Signature test" |
| frontend-implementer.md | 93 | "Implementation Process" | → "Implementation process" |
| frontend-implementer.md | 111 | "Design System Reuse Requirements" | → "Design system reuse requirements" |
| frontend-implementer.md | 120 | "Technical Implementation Standards" | → "Technical implementation standards" |
| frontend-implementer.md | 129 | "Code Quality Requirements" | → "Code quality requirements" |
| frontend-implementer.md | 137 | "Critical Implementation Reminders" | → "Critical implementation reminders" |
| frontend-implementer.md | 146 | "Success Criteria" | → "Success criteria" |
| frontend-implementer.md | 156 | "When to Ask for Clarification" | ✓ sentence case |
| psych-scanner.md | 10 | "Your Core Responsibilities" | → "Your core responsibilities" |
| psych-scanner.md | 18 | "Psychology Domains to Scan" | → "Psychology domains to scan" |
| psych-scanner.md | 20 | "Cognitive Load and Processing" | → "Cognitive load and processing" |
| psych-scanner.md | 28 | "Attention and Perception" | → "Attention and perception" |
| psych-scanner.md | 36 | "Decision Making and Behavioral Economics" | → "Decision making and behavioral economics" |
| psych-scanner.md | 46 | "Motivation and Engagement" | → "Motivation and engagement" |
| psych-scanner.md | 55 | "Trust and Credibility" | → "Trust and credibility" |
| psych-scanner.md | 63 | "Emotion and Affect" | → "Emotion and affect" |
| psych-scanner.md | 70 | "Scan Process" | → "Scan process" |
| psych-scanner.md | 78 | "Output Format" | → "Output format" |
| psych-scanner.md | 112 | "Critical Reminders" | → "Critical reminders" |
| test-writer.md | 10 | "Your Core Responsibilities" | → "Your core responsibilities" |
| test-writer.md | 18 | "Before Writing Tests" | ✓ sentence case |
| test-writer.md | 33 | "Test Script Structure" | → "Test script structure" |
| test-writer.md | 69 | "Writing Effective Tests" | → "Writing effective tests" |
| test-writer.md | 71 | "For UI Features" | → "For UI features" |
| test-writer.md | 77 | "For API/Backend Features" | → "For API/backend features" |
| test-writer.md | 82 | "For Form Flows" | → "For form flows" |
| test-writer.md | 87 | "Verify RED – Watch It Fail" | → "Verify red – watch it fail" |
| test-writer.md | 99 | "Verify GREEN – Watch It Pass" | → "Verify green – watch it pass" |
| test-writer.md | 109 | "Critical Rules" | → "Critical rules" |
| test-writer.md | 121 | "When Stuck" | → "When stuck" |
| test-writer.md | 131 | "Good Tests" | → "Good tests" |
| test-writer.md | 139 | "Output" | ✓ sentence case |
| ux-researcher.md | 10 | "Your Core Responsibilities" | → "Your core responsibilities" |
| ux-researcher.md | 18 | "Research Activities" | → "Research activities" |
| ux-researcher.md | 20 | "Competitor Analysis" | → "Competitor analysis" |
| ux-researcher.md | 43 | "Assumption Mapping" | → "Assumption mapping" |
| ux-researcher.md | 61 | "Survey Design" | → "Survey design" |
| ux-researcher.md | 72 | "User Interview Preparation" | → "User interview preparation" |
| ux-researcher.md | 84 | "Research Synthesis" | → "Research synthesis" |
| ux-researcher.md | 94 | "Output Format" | → "Output format" |
| ux-researcher.md | 125 | "Critical Reminders" | → "Critical reminders" |

---

### High

**F-0221: compound-documenter.md defensive Read pattern not explicit**  
**Severity**: HIGH  
**Category**: documentation  
**File**: agents/compound-documenter.md  
**Line**: 98–99 (workflow section)  
**Evidence**: Agent states "Read `.claude/agent-memory/compound-documenter/pipeline-state.md` (if it exists)" but does not document HOW to check defensively (CLAUDE.md line 500 specifies `test -f` checks).  
**Why it matters**: Other agents assume defensive reads are implicit in their calling context, but compound-documenter manages memory files and should explicitly document the defensive Read pattern per CLAUDE.md section 500–503 to ensure robustness across sessions.  
**Direction**: Add explicit section: "Always check file existence first using `test -f` before Read operations, per CLAUDE.md defensive read pattern."  
**Repro**: Read agents/compound-documenter.md lines 95–100 and search for "test -f" or "exists" — phrase is absent.  
**Confidence**: high

---

### Medium

**F-0222: frontend-implementer.md references project-local files without clear path conventions**  
**Severity**: MEDIUM  
**Category**: documentation  
**File**: agents/frontend-implementer.md  
**Line**: 39–41 (Design Grounding Pre-Flight)  
**Evidence**: References `design/craft/references/references.md` and `prototype/prototype.html` as project-local files that "may not exist" but does not clarify whether these are created by earlier phases or optional.  
**Why it matters**: A calling skill must know whether these files are prerequisites or optional for the agent to function correctly. The phrasing "confirm `design/craft/references/references.md` exists in the project (or run `ui-references-moodboard` first)" suggests optional, but the hook treats it as blocking.  
**Direction**: Clarify in "Design Grounding Pre-Flight": "Prerequisite files: `design/craft/references/references.md` (created by ui-references-moodboard), `prototype/prototype.html` (created during prototyping phase, optional if no prototype was built). If either is missing, the agent will: [state behavior]."  
**Repro**: Read agents/frontend-implementer.md lines 39–42 and check hook definition.  
**Confidence**: medium

---

### Low

**F-0223: advisor.md "The Iron Law" boxed preamble uses generic pattern**  
**Severity**: LOW  
**Category**: ux  
**File**: agents/advisor.md  
**Line**: 18–24  
**Evidence**: The boxed section at the start of test-writer.md uses "The Iron Law" as a standalone visual statement. advisor.md does not have an equivalent intro preamble despite being a critical agent.  
**Why it matters**: Consistency and visibility. test-writer clearly marks its highest priority with a boxed "Iron Law"; advisor could similarly call out its strategic role with a framing statement.  
**Direction**: Optional — consider adding a brief preamble to advisor.md clarifying its role as "the strategic checkpoint, not the executor" to match the visual weight of test-writer's Iron Law.  
**Confidence**: low

---

### NIT

**F-0224: Context-analyzer references "project status file" without naming it**  
**Severity**: NIT  
**Category**: documentation  
**File**: agents/context-analyzer.md  
**Line**: 12–13  
**Evidence**: "Review current project status from the status tracking file" does not specify the file name or path, leaving it ambiguous what "status tracking file" means.  
**Why it matters**: An agent calling context-analyzer needs to know what status file the agent expects to read. This should be explicit.  
**Direction**: Clarify: "Review current project status from `.design-engineer-plugin/config.yaml` (mode, project type, phase) and `.claude/agent-memory/compound-documenter/pipeline-state.md` (if using compound-documenter for session continuity)."  
**Confidence**: high

---

## Summary Table

| Finding | Severity | Category | File(s) | Issue |
|---------|----------|----------|---------|-------|
| F-0220 | MEDIUM | consistency | 9/10 agents | Title Case headings violate CLAUDE.md rule #2 (sentence case) |
| F-0221 | HIGH | documentation | compound-documenter.md | Defensive Read pattern not explicit in agent body |
| F-0222 | MEDIUM | documentation | frontend-implementer.md | Project-local file path conventions unclear |
| F-0223 | LOW | ux | advisor.md | Missing intro preamble (optional) |
| F-0224 | NIT | documentation | context-analyzer.md | "Status tracking file" name not specified |

---

## Recommendation

Fix F-0220 (Title Case) immediately — it affects agent output quality and contradicts documented style. F-0221 and F-0222 should be addressed in the next phase to strengthen robustness and clarity. F-0223 and F-0224 are minor and can be rolled into polish.

All 10 agents pass the core audit checklist: frontmatter complete, descriptions clear, references valid, context-passing explicit, and tools appropriate. The findings are focused on documentation clarity and style consistency rather than functional gaps.
