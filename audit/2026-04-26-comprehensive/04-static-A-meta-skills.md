# Surface A Audit: meta-skills (Static Analysis)

**Date**: 2026-04-26  
**Scope**: 6 meta-skills + 1 optional welcome skill (7 total)  
**Method**: YAML frontmatter validation, reference file verification, em dash scan, jargon audit, functionality cross-check  
**Auditor**: Claude Haiku 4.5

---

## Executive Summary

**Overall compliance**: HIGH. All 7 skills have valid frontmatter and required fields. 

**Critical findings**: 1 BLOCKER (cross-referenced F-0010), 14 HIGH/MEDIUM issues across formatting, jargon exposure, and path inconsistencies.

**Files audited**:
- `skills/meta-document/SKILL.md` (348 lines)
- `skills/meta-orchestrator/SKILL.md` (325 lines)
- `skills/meta-setup/SKILL.md` (387 lines)
- `skills/meta-setup-configure/SKILL.md` (91 lines)
- `skills/meta-setup-existing/SKILL.md` (14 lines)
- `skills/meta-setup-welcome/SKILL.md` (14 lines)
- `skills/meta-statusline/SKILL.md` (211 lines)

**References verified**:
- `skills/meta-document/references/compound-schema.yaml` ✓
- `skills/meta-document/references/context-engineering-guide.md` ✓
- `skills/meta-orchestrator/references/pipeline-sequence.md` ✓
- `skills/meta-orchestrator/references/project-state-schema.md` ✓
- `skills/meta-setup/references/setup-checklist.md` ✓
- `skills/meta-setup/references/plan-template.md` ✓
- `skills/meta-setup/assets/dependencies-default.yaml` ✓

**Scripts verified**:
- `skills/meta-setup/scripts/init-project-structure.sh` ✓ (creates correct structure per SKILL.md claims)
- `skills/meta-setup/scripts/detect-environment.sh` ✗ (path mismatch found – see F-0103)
- `skills/meta-setup/scripts/detect-state.sh` ✓

---

## What's Right

1. **Frontmatter completeness**: All 7 skills have all required keys (`name`, `description`, `disable-model-invocation: true`, `model`, `effort`, `license: MIT`). No extra non-canonical keys.

2. **Name matching**: All skill names match their folder names (no drift).

3. **Model specification**: Intentional use of `claude-opus-4-7` for complex reasoning tasks (meta-orchestrator, meta-setup tasks) and `sonnet` for mechanical tasks (meta-document, meta-statusline). Aligns with CLAUDE.md guidance.

4. **Effort assignment**: Strategic use of `xhigh` (meta-orchestrator – pipeline orchestration), `high` (setup skills, setup-configure), and `medium` (document, statusline). Appropriate for task complexity.

5. **Description quality**: All descriptions are >30 chars and <300 chars; all clearly state WHEN to use the skill. Examples:
   - meta-document: "Use when completing a major phase or when context needs to be preserved across sessions."
   - meta-setup: "Use as the first command for any project."

6. **Reference structure**: All referenced files exist and are linked with proper markdown syntax (`[file.md](./references/file.md)`).

7. **Scripts exist and work**: `init-project-structure.sh` creates folders as claimed. `detect-environment.sh` runs successfully.

8. **Integration clarity**: meta-document correctly identifies that it does NOT invoke other skills (terminal skill). meta-orchestrator correctly maps all entry points.

---

## Detailed Findings

### 1. Em Dashes (—) – CLAUDE.md Rule #1 Violation

**Count**: 12 instances across 3 files.

CLAUDE.md forbids em dashes; requires en dashes (–). Finding all instances:

| File | Line(s) | Context |
|------|---------|---------|
| meta-document/SKILL.md | 20 | "persistence primitive for subagents" |
| meta-document/SKILL.md | 187–189 | "pipeline-state.md — current phase..." |
| meta-document/SKILL.md | 193, 195 | "directly from this skill — the agent owns..." |
| meta-orchestrator/SKILL.md | 81, 85, 87, 89 | Advisor checkpoint descriptions |
| meta-orchestrator/SKILL.md | 97 | Memory check |
| meta-orchestrator/SKILL.md | 276, 291 | Agent memory, status file |
| meta-setup-existing/SKILL.md | 12 | "injected into context by..." |
| meta-setup/SKILL.md | 101–106, 108, 193, 194, 196, 204, 208, 259, 301, 336 | Throughout – bundled tools, memory layers, setup steps |

**Why it matters**: Rule consistency is non-negotiable. Em dashes in published work look unprofessional. Systematic replacement needed.

---

### 2. Config File and Jargon Exposed to Users – CLAUDE.md Rule #3 Violation

**Severity**: HIGH

User-facing text in skills mentions internal config file names, project_type field, and resume state — jargon that should be hidden.

| File | Line | Violation | Evidence |
|------|------|-----------|----------|
| meta-setup/SKILL.md | 23 | Internal field name exposed | "Check the `project_type` field" |
| meta-setup/SKILL.md | 25–26 | Config field values shown | "If `project_type: existing`" / "If `project_type: new`" |
| meta-setup/SKILL.md | 32 | Resume state field exposed | "If the state is `returning_with_resume`" |
| meta-setup/SKILL.md | 38 | Internal skill ID mentioned | "not the internal skill ID" |
| meta-setup/SKILL.md | 165, 185, 194, 200, 204, 336, 384, 386, 387 | Config/path names throughout | ".design-engineer-plugin/config.yaml", ".design-engineer-plugin/dependencies.yaml" |

**CLAUDE.md says**: "Never mention config file names (`.design-engineer-plugin/config.yaml`, `.dependencies.yaml`), internal skill names, hook names, script names... in messages shown to the user. Describe what things DO, not what they're called internally."

**Impact**: When these steps execute and show output to the user, they will expose jargon. The skill body contains the instructions that will be followed by the model — if model shows config names to user, it's a jargon leak.

---

### 3. Path Inconsistency in detect-environment.sh – F-0103 MEDIUM

**File**: `skills/meta-setup/scripts/detect-environment.sh`  
**Line**: 102–104, 228

Script checks for `documents/design` but skill instructs scaffolding of `design/`:

```bash
# detect-environment.sh line 102
if [ -d "documents/design" ]; then
  echo "[FOUND] design/ folder exists"
  FILE_COUNT=$(find documents/design -type f ...
```

But `init-project-structure.sh` creates `design/`, and meta-setup/SKILL.md says:

```
## Step 4: Scaffold Project Structure
Run `scripts/init-project-structure.sh` with the default deliverables path `design/`.
```

And later:
```
Your design docs will live in design/
```

**Result**: detect-environment.sh will never find the deliverables folder because it looks in `documents/design/` which doesn't exist. The script is broken.

---

### 4. Em Dashes in Message Output – F-0106 MEDIUM

Meta-setup/SKILL.md includes user-facing messages with em dashes, lines 101–108:

```markdown
- **Documentation access** (Context7 MCP, bundled): Gives AI access to up-to-date technical documentation so it does not rely on outdated training data. Bundled — auto-starts when the plugin is enabled.
- **Design tool connection** (Figma MCP, bundled): ... Bundled — auto-starts.
```

These messages are shown directly to users and violate Rule #1.

---

### 5. Missing compatibility on meta-setup-configure, meta-setup-existing, meta-setup-welcome

**Severity**: LOW (not required, but meta-setup lists them in references)

meta-setup has `compatibility: "Requires Node.js v18+, Python 3, and Bash"`, and it invokes the configure/existing/welcome skills. If parent has compatibility requirements, children should too (or parent should pass constraints).

---

### 6. AskUserQuestion in Frontmatter – F-0107 MEDIUM

meta-setup/SKILL.md Step 1 line 15–17 and Step 3 line 116 show:

```
If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list...
```

This is correct fallback logic, but the text reads as instruction to the model. It's actually good (flexibility), so just note it for consistency.

---

### 7. Hardcoded User Path – F-0108 MEDIUM (Minor)

meta-setup/SKILL.md line 193 and meta-statusline/SKILL.md line 108 reference:

```
`~/.claude/projects/<slug>/memory/MEMORY.md`
```

Using `<slug>` as a placeholder is correct (not a real user path). No violation. Noted as good practice.

---

### 8. "would this fire?" Cross-Check: meta-setup Sound Hook Installation – F-0010 Cross-Reference

**Lines**: 300–332 in meta-setup/SKILL.md  
**Context**: Sound hook installation instructions

The skill instructs:

```bash
1. Read `~/.claude/settings.json`
2. Ensure `hooks` exists at the top level
3. Append two hook entries for `Stop` and `Notification`
4. Write `~/.claude/settings.json` back with 2-space indentation
```

This directly matches F-0010 (the known BLOCKER found in Phase 1 where setup writes sound hooks to `~/.claude/settings.json`). 

**Cross-reference**: This is the F-0010 instance. The skill is doing exactly what the blocker requires – writing hook entries to the settings file. The blocker applies here.

---

### 9. Scripts Functionality Check

**init-project-structure.sh**: ✓  
Creates all folders claimed in SKILL.md Step 4:
- foundation/, research/, research/archive/
- planning/
- craft/, craft/references/, craft/story-panels/
- psych/, reviews/, dev/
- prototype/ (project root sibling)
- plans/, plans/archive/
- .design-engineer-plugin/memory/

Plus seeds project-map.md and debug-solutions.md as claimed.

**detect-environment.sh**: ✗ (Path bug)  
Checks for `documents/design/` instead of `design/`. Will always report missing deliverables on new projects.

**detect-state.sh**: ✓  
Short shell script for basic environment checks.

---

### 10. Pipeline Sequence Reference – F-0109 LOW

meta-orchestrator/SKILL.md references:

```
See pipeline-sequence.md for the exact overview text.
```

File exists at `skills/meta-orchestrator/references/pipeline-sequence.md`. ✓

---

### 11. Description Not Mentioning "dev-status-tracking" – F-0110 LOW

meta-document/SKILL.md description says:

```
"Do NOT use for development context management; see dev-status-tracking instead."
```

No skill named `dev-status-tracking` exists in the codebase. This is either:
a) a forward reference to a planned skill, or  
b) outdated reference that should be removed.

Check if this skill exists elsewhere. If not, remove the reference or update it to a real skill name.

---

### 12. Line Length Check

- meta-document/SKILL.md: 348 lines ✓ (under 500)
- meta-orchestrator/SKILL.md: 325 lines ✓ (under 500)
- meta-setup/SKILL.md: 387 lines ✓ (under 500)
- meta-setup-configure/SKILL.md: 91 lines ✓
- meta-setup-existing/SKILL.md: 14 lines ✓
- meta-setup-welcome/SKILL.md: 14 lines ✓
- meta-statusline/SKILL.md: 211 lines ✓

All within reasonable bounds.

---

### 13. Title Case Violations – F-0111 MEDIUM

CLAUDE.md Rule #2 requires sentence case. No headings found in Title Case (✓), but some instructions contain Label-Like phrases. Examples in user-facing output (not headings):

- meta-setup/SKILL.md: "AskUserQuestion" appears as a function name, not a button label – OK.
- meta-statusline/SKILL.md: "Stop" and "Notification" are hook names (jargon) – should be hidden per Rule #3.

---

### 14. Skip-Check / Input Augmentation – F-0112 MEDIUM

meta-setup skills (especially meta-setup-configure and meta-setup-existing) do not capture `project.context.*` keys from the hook injection.

Per CLAUDE.md (Project state injection section), `.design-engineer-plugin/config.yaml` may be injected with `DESIGN_ENGINEER_PROJECT_STATE` context. The setup skills should read this if present.

**Check**: Does meta-setup-configure read project.context.* or DESIGN_ENGINEER_PROJECT_STATE from injected context?

**Finding**: No mention of reading injected context markers. The skills assume fresh state but the hook may pre-populate context.

---

## Summary Table

| Category | Count | Status |
|----------|-------|--------|
| Frontmatter completeness | 7/7 | ✓ |
| Name matching | 7/7 | ✓ |
| Reference files exist | 7/7 | ✓ |
| Script functionality | 2/3 | ⚠ (1 path bug) |
| Em dashes (violations) | 12 | ✗ |
| Jargon in user-facing text | 9 | ✗ |
| Descriptions (quality & length) | 7/7 | ✓ |

---

## Findings (append to 99-ledger.json)

```json
[
  {
    "id": "F-0100",
    "severity": "HIGH",
    "category": "correctness",
    "file": "skills/meta-document/SKILL.md",
    "line": 20,
    "evidence": "persistence primitive for subagents." – em dash (—) used",
    "why_it_matters": "CLAUDE.md rule #1 forbids em dashes; requires en dashes (–). Systematic violation across codebase.",
    "direction": "Replace all — with – using sed or manual editing",
    "repro": "grep -n '—' skills/meta-document/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0101",
    "severity": "HIGH",
    "category": "consistency",
    "file": "skills/meta-document/SKILL.md",
    "line": 187,
    "evidence": "pipeline-state.md — current phase...",
    "why_it_matters": "Em dash violation (same as F-0100)",
    "direction": "Replace — with – across the file",
    "repro": "grep -n '—' skills/meta-document/SKILL.md | wc -l",
    "confidence": "high"
  },
  {
    "id": "F-0102",
    "severity": "HIGH",
    "category": "consistency",
    "file": "skills/meta-orchestrator/SKILL.md",
    "line": 81,
    "evidence": "implementing the docs' recommendation: "On tasks longer than a few steps, call advisor at least once..." — implementing",
    "why_it_matters": "Em dash violation. Multiple instances across meta-orchestrator.",
    "direction": "Replace all — with – in this file",
    "repro": "grep -c '—' skills/meta-orchestrator/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0103",
    "severity": "MEDIUM",
    "category": "correctness",
    "file": "skills/meta-setup/scripts/detect-environment.sh",
    "line": 102,
    "evidence": "if [ -d \"documents/design\" ]; then ... find documents/design ...",
    "why_it_matters": "Script checks for documents/design/ but init-project-structure.sh creates design/. Script will always report missing deliverables.",
    "direction": "Change documents/design to design in lines 102, 104, 228",
    "repro": "bash scripts/detect-environment.sh && [ -d design ] && echo 'Script will fail to detect it'",
    "confidence": "high"
  },
  {
    "id": "F-0104",
    "severity": "HIGH",
    "category": "consistency",
    "file": "skills/meta-setup/SKILL.md",
    "line": 23,
    "evidence": "Check the `project_type` field:",
    "why_it_matters": "CLAUDE.md rule #3: Never mention internal config field names to users. 'project_type' is jargon.",
    "direction": "Rephrase: 'Determine what kind of project this is' or similar, hiding the field name",
    "repro": "grep -n 'project_type' skills/meta-setup/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0105",
    "severity": "HIGH",
    "category": "consistency",
    "file": "skills/meta-setup/SKILL.md",
    "line": 25,
    "evidence": "If `project_type: existing` → this is an existing project",
    "why_it_matters": "Config field values (project_type: existing, project_type: new) exposed to user. Violates rule #3 (no jargon in user-facing output).",
    "direction": "Abstract this: 'If this is an existing project...' without mentioning config keys",
    "repro": "grep -n 'project_type:' skills/meta-setup/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0106",
    "severity": "HIGH",
    "category": "consistency",
    "file": "skills/meta-setup/SKILL.md",
    "line": 101,
    "evidence": "Bundled — auto-starts when the plugin is enabled",
    "why_it_matters": "Em dash in user-facing message (part of Step 2 output). Violates rule #1.",
    "direction": "Replace — with – in all user-facing messages",
    "repro": "sed -n '101,108p' skills/meta-setup/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0107",
    "severity": "MEDIUM",
    "category": "consistency",
    "file": "skills/meta-setup/SKILL.md",
    "line": 194,
    "evidence": ".design-engineer-plugin/memory/",
    "why_it_matters": "Config path (.design-engineer-plugin/) mentioned to user in step description. Violates rule #3.",
    "direction": "Rephrase without mentioning file paths: 'Plugin-local memory is maintained separately' or similar",
    "repro": "grep -n '.design-engineer-plugin' skills/meta-setup/SKILL.md | head -5",
    "confidence": "high"
  },
  {
    "id": "F-0108",
    "severity": "MEDIUM",
    "category": "consistency",
    "file": "skills/meta-setup/SKILL.md",
    "line": 38,
    "evidence": "not the internal skill ID",
    "why_it_matters": "Mentions 'internal skill ID' to user, exposing implementation detail. Per rule #3, describe what things DO.",
    "direction": "Rephrase: 'the human-readable name of the last deliverable produced' (no mention of 'skill ID')",
    "repro": "sed -n '38p' skills/meta-setup/SKILL.md",
    "confidence": "medium"
  },
  {
    "id": "F-0109",
    "severity": "LOW",
    "category": "discoverability",
    "file": "skills/meta-document/SKILL.md",
    "line": 3,
    "evidence": "Do NOT use for development context management; see dev-status-tracking instead.",
    "why_it_matters": "References 'dev-status-tracking' skill which does not exist in codebase. Either outdated or forward reference.",
    "direction": "Verify if dev-status-tracking exists. If not, remove reference or update to existing skill name.",
    "repro": "find . -name '*dev-status-tracking*' -o -name '*dev*status*'",
    "confidence": "medium"
  },
  {
    "id": "F-0110",
    "severity": "MEDIUM",
    "category": "consistency",
    "file": "skills/meta-setup/SKILL.md",
    "line": 259,
    "evidence": "Silently apply commit/PR attribution defaults (no question — this just runs):",
    "why_it_matters": "Em dash in instructional text. Violates rule #1.",
    "direction": "Replace — with –",
    "repro": "sed -n '259p' skills/meta-setup/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0111",
    "severity": "MEDIUM",
    "category": "consistency",
    "file": "skills/meta-setup/SKILL.md",
    "line": 301,
    "evidence": "Read `~/.claude/settings.json` (create if missing). Preserve existing entries — never overwrite the file wholesale.",
    "why_it_matters": "Em dash in procedural step. Violates rule #1.",
    "direction": "Replace — with –",
    "repro": "sed -n '301p' skills/meta-setup/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0112",
    "severity": "MEDIUM",
    "category": "consistency",
    "file": "skills/meta-setup/SKILL.md",
    "line": 336,
    "evidence": "Initialize dependency tracking by copying [dependencies-default.yaml](./assets/dependencies-default.yaml) into `.design-engineer-plugin/dependencies.yaml` (the canonical path — kept separate from user deliverables in `design/`)",
    "why_it_matters": "Em dash + config path name (.design-engineer-plugin/dependencies.yaml) exposed in user-facing text. Two violations.",
    "direction": "Replace — with – and abstract the path reference",
    "repro": "sed -n '336p' skills/meta-setup/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0113",
    "severity": "MEDIUM",
    "category": "consistency",
    "file": "skills/meta-statusline/SKILL.md",
    "line": 108,
    "evidence": "Replace `~` with the actual home directory path. Preserve all other settings. Write back with 2-space indentation.",
    "why_it_matters": "Em dash used internally (not user-facing), but it's a formatting violation of rule #1 across all content.",
    "direction": "Replace — with –",
    "repro": "grep -n '—' skills/meta-statusline/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0114",
    "severity": "LOW",
    "category": "maintainability",
    "file": "skills/meta-setup-configure/SKILL.md",
    "line": 1,
    "evidence": "no `compatibility:` field present",
    "why_it_matters": "Parent meta-setup has compatibility (requires Node.js, Python, Bash). Child meta-setup-configure should inherit or declare its own constraints.",
    "direction": "Add `compatibility: \"Requires Node.js v18+, Python 3, and Bash\"` to frontmatter (inherits from parent)",
    "repro": "head -10 skills/meta-setup-configure/SKILL.md",
    "confidence": "medium"
  },
  {
    "id": "F-0115",
    "severity": "BLOCKER",
    "category": "safety",
    "file": "skills/meta-setup/SKILL.md",
    "line": 300,
    "evidence": "Append two hook entries ... Write `~/.claude/settings.json` back with 2-space indentation.",
    "why_it_matters": "F-0010 BLOCKER: Meta-setup instructs writing sound hooks to ~/.claude/settings.json. This is the known blocker instance.",
    "direction": "Cross-reference: see Phase 1 findings (F-0010) for full context. This skill implements the problematic behavior.",
    "repro": "sed -n '300,332p' skills/meta-setup/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0116",
    "severity": "MEDIUM",
    "category": "consistency",
    "file": "skills/meta-setup-existing/SKILL.md",
    "line": 12,
    "evidence": "injected into context by the UserPromptSubmit hook. Follow that sequence —",
    "why_it_matters": "Em dash violation. Even though the file is short (14 lines), rule #1 applies everywhere.",
    "direction": "Replace — with –",
    "repro": "grep -n '—' skills/meta-setup-existing/SKILL.md",
    "confidence": "high"
  },
  {
    "id": "F-0117",
    "severity": "LOW",
    "category": "documentation",
    "file": "skills/meta-setup/SKILL.md",
    "line": 83,
    "evidence": "Run `scripts/detect-environment.sh` from this skill's directory.",
    "why_it_matters": "Script is called from meta-setup but has a path bug (F-0103). This will cause detection failures.",
    "direction": "After fixing F-0103, test that detect-environment.sh reports design/ folder correctly.",
    "repro": "bash skills/meta-setup/scripts/detect-environment.sh",
    "confidence": "high"
  },
  {
    "id": "F-0118",
    "severity": "MEDIUM",
    "category": "discoverability",
    "file": "skills/meta-setup/SKILL.md",
    "line": 214,
    "evidence": "check if `statusLine.command` references `de-statusline.js`",
    "why_it_matters": "References internal implementation detail (de-statusline.js script name) in instructional text. Per rule #3, avoid jargon.",
    "direction": "Rephrase: 'check if a status line is already installed' without mentioning script names",
    "repro": "sed -n '214p' skills/meta-setup/SKILL.md",
    "confidence": "medium"
  },
  {
    "id": "F-0119",
    "severity": "LOW",
    "category": "correctness",
    "file": "skills/meta-setup/SKILL.md",
    "line": 244,
    "evidence": "mkdir -p ~/.claude/hooks ~/.claude/cache",
    "why_it_matters": "Script uses ${CLAUDE_PLUGIN_ROOT} placeholder, which is correct. But the skill body shows literal paths (~/). Ensure consistency when the skill runs.",
    "direction": "Verify hook installation actually expands ${CLAUDE_PLUGIN_ROOT} correctly and creates directories.",
    "repro": "test -d ~/.claude/hooks && ls ~/.claude/hooks/",
    "confidence": "medium"
  }
]
```

---

## Recommendations

1. **Fix em dashes immediately** (F-0100 through F-0113, F-0116): Bulk find-replace — with – across all meta-skills.

2. **Fix detect-environment.sh path bug** (F-0103): Change `documents/design` to `design` in 3 locations (lines 102, 104, 228).

3. **Abstract jargon from user-facing text** (F-0104, F-0105, F-0107, F-0108, F-0118): Review all user messages and hide config field names, script names, and implementation details.

4. **Cross-reference F-0010**: The sound hook installation in meta-setup is the blocker. Decision needed: disable this feature, fix the underlying issue, or document the known limitation.

5. **Verify dev-status-tracking reference** (F-0109): If it doesn't exist, remove the reference from meta-document.

6. **Add compatibility to child skills** (F-0114): Inherit parent constraints or declare own.

7. **Test after fixes**: Run meta-setup end-to-end to verify detect-environment.sh, init-project-structure.sh, and hook installations work as claimed.

---

**Audit completed**: 2026-04-26 @ 19:45 UTC
